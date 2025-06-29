import { createHash, randomBytes } from 'crypto';

// Types for authentication
export interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  role: 'Patient' | 'Caregiver' | 'Healthcare Provider' | 'Family Member';
  createdAt: string;
  lastLogin: string;
  sessions: number;
}

export interface OTPData {
  code: string;
  expiresAt: string;
  type: 'email' | 'mobile';
  attempts: number;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
  requiresOTP?: boolean;
  otpSent?: boolean;
}

// In-memory storage for demo (replace with database in production)
const users: User[] = [];
const otpStore: Map<string, OTPData> = new Map();
const sessions: Map<string, { userId: string; expiresAt: string }> = new Map();

// Utility functions
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const hashPassword = (password: string): string => {
  return createHash('sha256').update(password + 'mediprior_salt').digest('hex');
};

const generateToken = (): string => {
  return randomBytes(32).toString('hex');
};

const isOTPExpired = (otpData: OTPData): boolean => {
  return new Date() > new Date(otpData.expiresAt);
};

const isSessionValid = (token: string): boolean => {
  const session = sessions.get(token);
  if (!session) return false;
  return new Date() < new Date(session.expiresAt);
};

// OTP Management
export const sendOTP = async (identifier: string, type: 'email' | 'mobile'): Promise<AuthResponse> => {
  try {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const otpData: OTPData = {
      code: otp,
      expiresAt: expiresAt.toISOString(),
      type,
      attempts: 0
    };

    otpStore.set(identifier, otpData);

    // Simulate sending OTP (replace with actual email/SMS service)
    console.log(`OTP sent to ${type}: ${identifier} - Code: ${otp}`);

    return {
      success: true,
      otpSent: true
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to send OTP'
    };
  }
};

export const verifyOTP = async (identifier: string, otp: string): Promise<AuthResponse> => {
  try {
    const otpData = otpStore.get(identifier);
    
    if (!otpData) {
      return {
        success: false,
        error: 'OTP not found or expired'
      };
    }

    if (isOTPExpired(otpData)) {
      otpStore.delete(identifier);
      return {
        success: false,
        error: 'OTP has expired'
      };
    }

    if (otpData.attempts >= 3) {
      otpStore.delete(identifier);
      return {
        success: false,
        error: 'Too many OTP attempts. Please request a new one.'
      };
    }

    otpData.attempts++;

    if (otpData.code !== otp) {
      return {
        success: false,
        error: 'Invalid OTP'
      };
    }

    // OTP verified successfully
    otpStore.delete(identifier);
    
    return {
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to verify OTP'
    };
  }
};

// User Registration
export const registerUser = async (
  fullName: string,
  email: string,
  mobile: string,
  password: string,
  role: User['role']
): Promise<AuthResponse> => {
  try {
    // Check for existing users
    const existingUser = users.find(u => u.email === email || u.mobile === mobile);
    if (existingUser) {
      return {
        success: false,
        error: existingUser.email === email 
          ? 'Email already registered' 
          : 'Mobile number already registered'
      };
    }

    // Validate input
    if (!fullName.trim() || !email.trim() || !mobile.trim() || !password.trim()) {
      return {
        success: false,
        error: 'All fields are required'
      };
    }

    if (password.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters long'
      };
    }

    if (!email.includes('@')) {
      return {
        success: false,
        error: 'Please enter a valid email address'
      };
    }

    // Create new user
    const newUser: User = {
      id: randomBytes(16).toString('hex'),
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      password: hashPassword(password),
      isEmailVerified: false,
      isMobileVerified: false,
      role,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      sessions: 0
    };

    users.push(newUser);

    // Send OTP for verification
    const otpResponse = await sendOTP(email, 'email');
    if (!otpResponse.success) {
      return {
        success: false,
        error: 'Failed to send verification OTP'
      };
    }

    return {
      success: true,
      requiresOTP: true,
      otpSent: true
    };
  } catch (error) {
    return {
      success: false,
      error: 'Registration failed'
    };
  }
};

// User Login
export const loginUser = async (identifier: string, password: string): Promise<AuthResponse> => {
  try {
    // Find user by email or mobile
    const user = users.find(u => u.email === identifier.toLowerCase() || u.mobile === identifier);
    
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // Verify password
    if (user.password !== hashPassword(password)) {
      return {
        success: false,
        error: 'Invalid password'
      };
    }

    // Generate session token
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    sessions.set(token, {
      userId: user.id,
      expiresAt: expiresAt.toISOString()
    });

    // Update user stats
    user.lastLogin = new Date().toISOString();
    user.sessions += 1;

    return {
      success: true,
      user: {
        ...user,
        password: '' // Don't send password in response
      },
      token
    };
  } catch (error) {
    return {
      success: false,
      error: 'Login failed'
    };
  }
};

// Password Reset
export const initiatePasswordReset = async (identifier: string): Promise<AuthResponse> => {
  try {
    const user = users.find(u => u.email === identifier.toLowerCase() || u.mobile === identifier);
    
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    const type = user.email === identifier.toLowerCase() ? 'email' : 'mobile';
    const otpResponse = await sendOTP(identifier, type);
    
    if (!otpResponse.success) {
      return {
        success: false,
        error: 'Failed to send reset OTP'
      };
    }

    return {
      success: true,
      requiresOTP: true,
      otpSent: true
    };
  } catch (error) {
    return {
      success: false,
      error: 'Password reset failed'
    };
  }
};

export const resetPassword = async (
  identifier: string, 
  otp: string, 
  newPassword: string
): Promise<AuthResponse> => {
  try {
    // Verify OTP
    const otpResponse = await verifyOTP(identifier, otp);
    if (!otpResponse.success) {
      return otpResponse;
    }

    // Find user
    const user = users.find(u => u.email === identifier.toLowerCase() || u.mobile === identifier);
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // Update password
    user.password = hashPassword(newPassword);

    return {
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: 'Password reset failed'
    };
  }
};

// Session Management
export const validateSession = (token: string): AuthResponse => {
  try {
    if (!isSessionValid(token)) {
      return {
        success: false,
        error: 'Session expired'
      };
    }

    const session = sessions.get(token);
    if (!session) {
      return {
        success: false,
        error: 'Invalid session'
      };
    }

    const user = users.find(u => u.id === session.userId);
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    return {
      success: true,
      user: {
        ...user,
        password: ''
      },
      token
    };
  } catch (error) {
    return {
      success: false,
      error: 'Session validation failed'
    };
  }
};

export const logoutUser = (token: string): AuthResponse => {
  try {
    sessions.delete(token);
    return {
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: 'Logout failed'
    };
  }
};

// Get user by ID
export const getUserById = (userId: string): User | null => {
  const user = users.find(u => u.id === userId);
  return user ? { ...user, password: '' } : null;
}; 