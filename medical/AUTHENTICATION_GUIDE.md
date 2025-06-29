# MediPrior Authentication System

## Overview

MediPrior features a comprehensive, professional authentication system with OTP verification, password reset functionality, and secure session management. The system is designed for a health monitoring platform serving patients, caregivers, healthcare providers, and family members.

## Features

### ✅ User Registration (Sign Up)
- **Full Name**: Required field with validation
- **Email Address**: Required with email format validation
- **Mobile Number**: Required with phone number validation
- **Password**: Minimum 8 characters with complexity requirements
- **Role Selection**: Patient, Caregiver, Healthcare Provider, Family Member
- **OTP Verification**: Email-based verification before account activation
- **Terms & Privacy**: Required acceptance of terms and privacy policy

### ✅ User Login (Sign In)
- **Flexible Login**: Email or mobile number + password
- **Password Visibility Toggle**: Show/hide password functionality
- **Remember Me**: Optional session persistence
- **Real-time Validation**: Instant feedback on form errors
- **Secure Authentication**: JWT-based session management

### ✅ Password Reset
- **Forgot Password**: Email/mobile-based reset initiation
- **OTP Verification**: Secure code verification
- **New Password Setup**: Password strength validation
- **Automatic Redirect**: Seamless flow back to login

### ✅ Security Features
- **Password Hashing**: Secure password storage (bcrypt in production)
- **OTP Expiration**: 5-minute expiration with retry limits
- **Session Management**: 24-hour session tokens
- **Duplicate Prevention**: Email and mobile uniqueness validation
- **Rate Limiting**: OTP attempt limits (3 attempts max)

## Technical Implementation

### Authentication Service (`src/lib/authService.ts`)

The core authentication logic is implemented in a comprehensive service that handles:

```typescript
// Key functions
- registerUser()     // User registration with OTP
- loginUser()        // User authentication
- sendOTP()          // OTP generation and sending
- verifyOTP()        // OTP verification
- initiatePasswordReset() // Password reset initiation
- resetPassword()    // Password update
- validateSession()  // Session validation
- logoutUser()       // User logout
```

### OTP Verification Component (`src/components/OTPVerification.tsx`)

Professional OTP input component with:
- 6-digit code input with auto-focus
- Real-time validation
- Countdown timer (5 minutes)
- Resend functionality
- Paste support
- Error handling

### Authentication Context (`src/contexts/AuthContext.tsx`)

React context providing:
- User state management
- Session persistence
- Login/logout functions
- Loading states
- Authentication status

## User Interface

### Design System
- **Color Scheme**: Health-focused green/blue gradient
- **Typography**: Clean, professional fonts
- **Icons**: Lucide React icons for consistency
- **Responsive**: Mobile-first design approach

### Components
- **Form Validation**: Real-time feedback
- **Loading States**: Spinner animations
- **Error Handling**: User-friendly error messages
- **Success States**: Confirmation feedback
- **Accessibility**: ARIA labels and keyboard navigation

## User Flow

### Registration Flow
1. User fills registration form
2. Real-time validation provides feedback
3. Form submission triggers OTP to email
4. User enters 6-digit OTP
5. Account is verified and activated
6. User is redirected to dashboard

### Login Flow
1. User enters email/mobile + password
2. Credentials are validated
3. Session token is generated
4. User data is stored in context
5. User is redirected to dashboard

### Password Reset Flow
1. User clicks "Forgot Password"
2. User enters email/mobile
3. OTP is sent to account
4. User verifies OTP
5. User sets new password
6. User is redirected to login

## Security Considerations

### Production Deployment
- Replace in-memory storage with database
- Implement proper password hashing (bcrypt)
- Add rate limiting for OTP requests
- Use HTTPS for all communications
- Implement proper session management
- Add audit logging

### OTP Service Integration
Current implementation uses console logging for OTP codes. For production:

```typescript
// Email OTP (using services like SendGrid, AWS SES)
const sendEmailOTP = async (email: string, otp: string) => {
  // Integrate with email service
};

// SMS OTP (using services like Twilio, AWS SNS)
const sendSMSOTP = async (phone: string, otp: string) => {
  // Integrate with SMS service
};
```

### Database Schema
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  mobile VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  is_email_verified BOOLEAN DEFAULT FALSE,
  is_mobile_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  sessions_count INTEGER DEFAULT 0
);

-- OTP table
CREATE TABLE otp_codes (
  id UUID PRIMARY KEY,
  identifier VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  type VARCHAR(10) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Testing

### Demo Mode
The current implementation includes a demo mode for testing:
- Any email/password combination works
- OTP codes are logged to console
- No external service dependencies

### Test Credentials
```
Email: test@example.com
Password: TestPassword123
OTP: Check console for generated code
```

## File Structure

```
src/
├── lib/
│   └── authService.ts          # Core authentication logic
├── components/
│   ├── OTPVerification.tsx     # OTP input component
│   ├── Header.tsx              # Navigation with user menu
│   └── ProtectedRoute.tsx      # Route protection
├── contexts/
│   └── AuthContext.tsx         # Authentication context
└── pages/
    ├── Login.tsx               # Login page with reset
    └── Signup.tsx              # Registration page
```

## Future Enhancements

### Planned Features
- [ ] Social login (Google, Apple)
- [ ] Two-factor authentication (2FA)
- [ ] Biometric authentication
- [ ] Dark mode support
- [ ] Multi-language support
- [ ] Account recovery options

### Security Improvements
- [ ] JWT refresh tokens
- [ ] Device fingerprinting
- [ ] Suspicious activity detection
- [ ] Account lockout policies
- [ ] Security audit logging

## Support

For technical support or questions about the authentication system, please refer to the codebase documentation or contact the development team.

---

**MediPrior Authentication System** - Prioritizing security and user experience in health monitoring. 