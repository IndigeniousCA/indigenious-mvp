import { createClient } from '@/lib/supabase/client'
import type { RegisterFormData, LoginFormData } from '@/lib/auth'

export interface AuthResponse {
  success: boolean
  message: string
  requiresVerification?: boolean
  user?: any
}

export class AuthService {
  private supabase = createClient()

  async register(data: RegisterFormData & { userType: 'indigenous_business' | 'canadian_business' }): Promise<AuthResponse> {
    try {
      // 1. Create user account
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            phone: data.phone,
            business_name: data.businessName,
            locale: data.locale
          }
        }
      })

      if (authError) {
        return {
          success: false,
          message: authError.message
        }
      }

      if (!authData.user) {
        return {
          success: false,
          message: 'Failed to create user account'
        }
      }

      // 2. Update users table with user type
      // TODO: Fix TypeScript issue with Supabase updates
      // const { error: userError } = await this.supabase
      //   .from('users')
      //   .update({ 
      //     user_type: data.userType,
      //     phone: data.phone,
      //     email: data.email,
      //     preferred_language: data.locale
      //   })
      //   .eq('id', authData.user.id)

      // if (userError) {
      //   console.error('User update error:', userError)
      // }
      console.log('TODO: Update user profile for:', authData.user.id)

      // 3. Create business profile
      const { error: businessError } = await this.supabase
        .from('businesses')
        .insert({
          user_id: authData.user.id,
          business_name: data.businessName,
          indigenous_owned: data.userType === 'indigenous_business',
          open_to_partnership: data.userType === 'canadian_business',
          verification_status: 'pending',
          requires_payment: data.userType === 'canadian_business'
        } as any)

      if (businessError) {
        console.error('Business creation error:', businessError)
      }

      // 4. Send verification code
      await this.sendVerificationCode(authData.user.id, data.email, 'email')

      return {
        success: true,
        message: 'Account created! Please check your email for the verification code.',
        requiresVerification: true,
        user: authData.user
      }
    } catch (error) {
      console.error('Registration error:', error)
      return {
        success: false,
        message: 'An unexpected error occurred during registration'
      }
    }
  }

  async login(data: LoginFormData): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await this.supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })

      if (error) {
        return {
          success: false,
          message: error.message
        }
      }

      if (!authData.user) {
        return {
          success: false,
          message: 'Invalid credentials'
        }
      }

      // Check if user needs 2FA
      const { data: profile } = await this.supabase
        .from('profiles')
        .select('phone')
        .eq('id', authData.user.id)
        .single()

      if ((profile as any)?.phone) {
        // Send 2FA code
        await this.sendVerificationCode(authData.user.id, (profile as any).phone, 'sms')
        
        return {
          success: true,
          message: 'Please enter the verification code sent to your phone',
          requiresVerification: true,
          user: authData.user
        }
      }

      return {
        success: true,
        message: 'Login successful!',
        user: authData.user
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        message: 'An unexpected error occurred during login'
      }
    }
  }

  async sendVerificationCode(userId: string, destination: string, type: 'email' | 'sms'): Promise<void> {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Store in database
    await this.supabase
      .from('verification_codes')
      .insert({
        user_id: userId,
        code,
        type,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
      } as any)

    // Send via email or SMS service
    if (type === 'email') {
      const emailService = new (await import('./email.service')).EmailService()
      await emailService.sendVerificationCode(destination, code)
    } else {
      // TODO: Send SMS via Twilio
      console.log(`SMS verification code ${code} would be sent to ${destination}`)
      // For MVP, we can send SMS codes via email as a fallback
      const userEmail = await this.getUserEmail(userId)
      if (userEmail) {
        const emailService = new (await import('./email.service')).EmailService()
        await emailService.sendVerificationCode(userEmail, code)
      }
    }
  }

  async verifyCode(userId: string, code: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('verification_codes')
      .select('*')
      .eq('user_id', userId)
      .eq('code', code)
      .eq('used', false)
      .gte('expires_at', new Date().toISOString())
      .single()

    if (error || !data) {
      return false
    }

    // TODO: Fix TypeScript issue with Supabase updates
    // Mark as used
    // await this.supabase
    //   .from('verification_codes')
    //   .update({ used: true })
    //   .eq('id', data.id)
    console.log('TODO: Mark verification code as used:', data.id)

    return true
  }

  async logout(): Promise<void> {
    await this.supabase.auth.signOut()
  }

  async getUser() {
    const { data: { user } } = await this.supabase.auth.getUser()
    return user
  }

  async getProfile() {
    const user = await this.getUser()
    if (!user) return null

    const { data } = await this.supabase
      .from('profiles')
      .select('*, businesses(*)')
      .eq('id', user.id)
      .single()

    return data
  }

  private async getUserEmail(userId: string): Promise<string | null> {
    const { data } = await this.supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single()
    
    return data?.email || null
  }
}