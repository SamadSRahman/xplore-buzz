'use client';

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const { token } = useParams(); // dynamically captured from the URL
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying | success | error

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        return;
      }

      const res = await verifyEmail(token);
      if (res?.success) {
        setStatus('success');
        toast.success('Email verified successfully!');
      } else {
        setStatus('error');
        toast.error(res?.error || 'Verification failed');
      }
    };

    verify();
  }, [token, verifyEmail]);

  const renderStatus = () => {
    if (status === 'verifying') {
      return (
        <>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <RefreshCw className="w-8 h-8 text-white animate-spin" />
            </div>
          </div>
          <h2 className="text-center text-xl font-semibold text-gray-700 mb-2">
            Verifying your email...
          </h2>
        </>
      );
    }

    if (status === 'success') {
      return (
        <>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-center text-xl font-semibold text-green-700 mb-2">
            Email Verified Successfully!
          </h2>
          <Link to="/login">
            <Button className="w-full mt-4 bg-purple-gradient text-white">
              Continue to Sign In
            </Button>
          </Link>
        </>
      );
    }

    if (status === 'error') {
      return (
        <>
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
              <XCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-center text-xl font-semibold text-red-700 mb-2">
            Verification Failed
          </h2>
          <p className="text-center text-gray-600 mb-4">
            The verification link is invalid or expired.
          </p>
          <Link to="/login">
            <Button variant="outline" className="w-full">
              Back to Sign In
            </Button>
          </Link>
        </>
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="w-full max-w-md">
        <div className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-xl p-8 text-center">
          {renderStatus()}
        </div>
      </div>
    </div>
  );
}