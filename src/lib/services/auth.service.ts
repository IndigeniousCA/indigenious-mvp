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

  async register(data: RegisterFormData & { userType: 'business' | 'buyer' }): Promise<AuthResponse> {
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

      // 2. Update profile with role
      const { error: profileError } = await this.supabase
        .from('profiles')
        .update({ 
          role: data.userType,
          phone: data.phone 
        })
        .eq('id', authData.user.id)

      if (profileError) {
        console.error('Profile update error:', profileError)
      }

      // 3. Create business profile if business user
      if (data.userType === 'business') {
        const { error: businessError } = await this.supabase
          .from('businesses')
          .insert({
            user_id: authData.user.id,
            business_name: data.businessName,
            status: 'pending'
          })

        if (businessError) {
          console.error('Business creation error:', businessError)
        }
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

      if (profile?.phone) {
        // Send 2FA code
        await this.sendVerificationCode(authData.user.id, profile.phone, 'sms')
        
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
      })

    // In production, integrate with actual email/SMS service
    if (type === 'email') {
      // TODO: Send email via Resend or SendGrid
      console.log(`Email verification code ${code} would be sent to ${destination}`)
    } else {
      // TODO: Send SMS via Twilio
      console.log(`SMS verification code ${code} would be sent to ${destination}`)
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

    // Mark as used
    await this.supabase
      .from('verification_codes')
      .update({ used: true })
      .eq('id', data.id)

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
}