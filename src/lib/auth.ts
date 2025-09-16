// Basic auth validation helpers (no actual authentication implementation)

export interface ValidationError {
  field: string;
  message: string;
}

export interface RegisterFormData {
  email: string;
  phone: string;
  password: string;
  businessName: string;
  locale: 'en' | 'fr';
  termsAccepted: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (basic Canadian/US format)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Password validation
export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Form validation for registration
export const validateRegistrationForm = (data: RegisterFormData): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Email validation
  if (!data.email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }
  
  // Phone validation
  if (!data.phone) {
    errors.push({ field: 'phone', message: 'Phone number is required for 2FA' });
  } else if (!validatePhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
  }
  
  // Password validation
  if (!data.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.valid) {
      errors.push({ field: 'password', message: passwordValidation.errors[0] });
    }
  }
  
  // Business name validation
  if (!data.businessName || data.businessName.trim().length < 2) {
    errors.push({ field: 'businessName', message: 'Business name is required' });
  }
  
  // Terms validation
  if (!data.termsAccepted) {
    errors.push({ field: 'termsAccepted', message: 'You must accept the terms and conditions' });
  }
  
  return errors;
};

// Form validation for login
export const validateLoginForm = (data: LoginFormData): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Email validation
  if (!data.email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }
  
  // Password validation
  if (!data.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }
  
  return errors;
};

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
};

// Mock auth functions (these would connect to Supabase in real implementation)
export const mockRegister = async (data: RegisterFormData): Promise<{ success: boolean; message: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, always return success
  return {
    success: true,
    message: 'Registration successful! Please check your email to verify your account.'
  };
};

export const mockLogin = async (data: LoginFormData): Promise<{ success: boolean; message: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, always return success
  return {
    success: true,
    message: 'Login successful!'
  };
};