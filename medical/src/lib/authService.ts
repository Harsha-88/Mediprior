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

// Load users from localStorage on startup (for demo persistence)
const loadUsersFromStorage = () => {
  try {
    const storedUsers = localStorage.getItem('mediprior_users');
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      users.push(...parsedUsers);
    }
  } catch (error) {
    console.error('Failed to load users from storage:', error);
  }
};

// Save users to localStorage (for demo persistence)
const saveUsersToStorage = () => {
  try {
    localStorage.setItem('mediprior_users', JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save users to storage:', error);
  }
};

// Load sessions from localStorage on startup (for demo persistence)
const loadSessionsFromStorage = () => {
  try {
    const storedSessions = localStorage.getItem('mediprior_sessions');
    if (storedSessions) {
      const parsedSessions = JSON.parse(storedSessions);
      Object.entries(parsedSessions).forEach(([token, session]: [string, any]) => {
        if (new Date() < new Date(session.expiresAt)) {
          sessions.set(token, session);
        }
      });
    }
  } catch (error) {
    console.error('Failed to load sessions from storage:', error);
  }
};

// Save sessions to localStorage (for demo persistence)
const saveSessionsToStorage = () => {
  try {
    const sessionsObj = Object.fromEntries(sessions);
    localStorage.setItem('mediprior_sessions', JSON.stringify(sessionsObj));
  } catch (error) {
    console.error('Failed to save sessions to storage:', error);
  }
};

// Load data on module initialization
loadUsersFromStorage();
loadSessionsFromStorage();

// Utility functions
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const hashPassword = (password: string): string => {
  // Simple hash for demo - use bcrypt in production
  return btoa(password + 'mediprior_salt');
};

const generateToken = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
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
      id: generateToken(),
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      password: hashPassword(password),
      isEmailVerified: true,
      isMobileVerified: true,
      role,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      sessions: 1
    };

    users.push(newUser);

    // Save users to storage
    saveUsersToStorage();

    // Generate session token for automatic login
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    sessions.set(token, {
      userId: newUser.id,
      expiresAt: expiresAt.toISOString()
    });

    // Save sessions to storage
    saveSessionsToStorage();

    return {
      success: true,
      user: newUser,
      token
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
    const user = users.find(u => u.email === identifier || u.mobile === identifier);
    
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

    // Save sessions to storage
    saveSessionsToStorage();

    // Update user session count
    user.sessions++;
    user.lastLogin = new Date().toISOString();

    // Save updated user data to storage
    saveUsersToStorage();

    return {
      success: true,
      user,
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
    const user = users.find(u => u.email === identifier || u.mobile === identifier);
    
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // Send OTP for password reset
    const otpResponse = await sendOTP(identifier, 'email');
    if (!otpResponse.success) {
      return {
        success: false,
        error: 'Failed to send reset OTP'
      };
    }

    return {
      success: true,
      otpSent: true
    };
  } catch (error) {
    return {
      success: false,
      error: 'Password reset initiation failed'
    };
  }
};

export const resetPassword = async (
  identifier: string, 
  otp: string, 
  newPassword: string
): Promise<AuthResponse> => {
  try {
    const user = users.find(u => u.email === identifier || u.mobile === identifier);
    
    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // Verify OTP
    const otpResponse = await verifyOTP(identifier, otp);
    if (!otpResponse.success) {
      return {
        success: false,
        error: otpResponse.error || 'Invalid OTP'
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
        error: 'Invalid or expired session'
      };
    }

    const session = sessions.get(token);
    if (!session) {
      return {
        success: false,
        error: 'Session not found'
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
      user
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
    // Save updated sessions to storage
    saveSessionsToStorage();
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

// User Management
export const getUserById = (userId: string): User | null => {
  return users.find(u => u.id === userId) || null;
};

// Utility function to clear all demo data (for testing)
export const clearDemoData = () => {
  users.length = 0;
  otpStore.clear();
  sessions.clear();
  localStorage.removeItem('mediprior_users');
  localStorage.removeItem('mediprior_sessions');
  localStorage.removeItem('mediprior_token');
  localStorage.removeItem('mediprior_user');
  localStorage.removeItem('mediprior_remember');
}; 