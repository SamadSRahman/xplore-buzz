'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Lock, ArrowLeft, CheckCircle, XCircle, Eye, EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import useAuth from '@/hooks/useAuth';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const { resetPassword } = useAuth();
  const router = useRouter();

  const [tokenStatus, setTokenStatus] = useState('validating'); // 'validating', 'valid', 'expired', 'invalid'
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!token) return setTokenStatus('invalid');

    // Simulate token validation - remove this if you validate from backend
    setTimeout(() => {
      setTokenStatus('valid'); // assume valid for now
    }, 1000);
  }, [token]);

  const validatePassword = (password) => {
    const errors = {};
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.password = 'Must contain upper, lower case & number';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const passwordErrors = validatePassword(password);

    if (Object.keys(passwordErrors).length > 0) {
      setErrors(passwordErrors);
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await resetPassword(token, password, confirmPassword);
      if (res.success) {
        toast.success('Password reset successful!');
        setIsSuccess(true);
      } else {
        toast.error(res.error || 'Reset failed');
        setTokenStatus('invalid');
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10"
            placeholder="Enter new password"
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10 pr-10"
            placeholder="Confirm password"
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-purple-gradient text-white"
      >
        {isSubmitting ? 'Updating...' : 'Reset Password'}
      </Button>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="w-full max-w-md">
        <div className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-xl p-8">
          <div className="text-center space-y-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-buzz-gradient flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <h2 className="text-2xl font-bold">
              {isSuccess ? 'Password Reset Successfully' : 'Reset Your Password'}
            </h2>
            <p className="text-gray-600">
              {isSuccess
                ? 'You can now sign in with your new password.'
                : 'Enter a strong password below to reset your account.'}
            </p>
          </div>

          {tokenStatus === 'validating' ? (
            <p className="text-center text-gray-500">Validating link...</p>
          ) : tokenStatus !== 'valid' ? (
            <div className="text-center text-red-600">Invalid or expired token.</div>
          ) : isSuccess ? (
            <Link href="/login">
              <Button className="w-full mt-4 bg-purple-gradient text-white">
                Go to Login
              </Button>
            </Link>
          ) : (
            renderForm()
          )}
        </div>
      </div>
    </div>
  );
}
