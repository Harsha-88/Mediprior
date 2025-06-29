import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { 
  Shield, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { sendOTP, verifyOTP } from '../lib/authService';

interface OTPVerificationProps {
  identifier: string;
  type: 'email' | 'mobile';
  onVerificationSuccess: () => void;
  onBack: () => void;
  title?: string;
  description?: string;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  identifier,
  type,
  onVerificationSuccess,
  onBack,
  title = "Verify Your Account",
  description = "We've sent a verification code to your account"
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Auto-focus next input
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await verifyOTP(identifier, otpString);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          onVerificationSuccess();
        }, 1500);
      } else {
        setError(response.error || 'Verification failed');
        setAttempts(attempts + 1);
        
        if (attempts >= 2) {
          setError('Too many failed attempts. Please request a new OTP.');
        }
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError('');
    setOtp(['', '', '', '', '', '']);
    setAttempts(0);

    try {
      const response = await sendOTP(identifier, type);
      
      if (response.success) {
        setTimeLeft(300);
        setCanResend(false);
        setSuccess(false);
      } else {
        setError(response.error || 'Failed to resend OTP');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getIdentifierDisplay = () => {
    if (type === 'email') {
      const [username, domain] = identifier.split('@');
      return `${username.slice(0, 3)}***@${domain}`;
    } else {
      return identifier.replace(/(\d{3})(\d{3})(\d{4})/, '$1***$3');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Shield className="text-white h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl text-gray-800">{title}</CardTitle>
          <p className="text-gray-600 mt-2">
            {description}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Identifier Display */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {type === 'email' ? (
                <Mail className="h-4 w-4 text-gray-500" />
              ) : (
                <Phone className="h-4 w-4 text-gray-500" />
              )}
              <span className="text-sm text-gray-600">
                {getIdentifierDisplay()}
              </span>
            </div>
            <Badge variant="outline" className="text-xs">
              {type === 'email' ? 'Email' : 'Mobile'} Verification
            </Badge>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Verification successful! Redirecting...
              </AlertDescription>
            </Alert>
          )}

          {/* OTP Input */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">
              Enter 6-digit verification code
            </Label>
            
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-lg font-semibold border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  disabled={isLoading || success}
                />
              ))}
            </div>
          </div>

          {/* Timer */}
          <div className="text-center">
            {timeLeft > 0 ? (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Code expires in {formatTime(timeLeft)}</span>
              </div>
            ) : (
              <div className="text-sm text-red-500">
                Code has expired
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleVerifyOTP}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              disabled={isLoading || success || otp.join('').length !== 6}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1"
                disabled={isLoading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <Button
                variant="outline"
                onClick={handleResendOTP}
                className="flex-1"
                disabled={isLoading || !canResend}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Resend
              </Button>
            </div>
          </div>

          {/* Help Text */}
          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>Didn't receive the code? Check your spam folder</p>
            <p>You can request a new code in {formatTime(timeLeft)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPVerification; 