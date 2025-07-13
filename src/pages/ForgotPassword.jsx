'use client';

import { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiClient, setApiClient] = useState(null);
  const navigate = useNavigate();

  // Dynamically import and setup API client on mount
  useEffect(() => {
    const setupApiClient = async () => {
      const { apiClient: client } = await import('@/lib/axios');
      setApiClient(client);
    };
    
    setupApiClient();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!apiClient) {
      toast.error('API client not ready');
      return;
    }

    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/accounts/forgot-password', {
        email,
      });

      if (response.data.success) {
        toast.success('Reset link sent to your email');
        navigate('/login');
      } else {
        toast.error(response.data.error || 'Failed to send reset link');
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.error || 'Error sending reset link'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="w-full max-w-md">
        <div className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-xl p-8">
          <div className="text-center space-y-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-buzz-gradient flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <h2 className="text-2xl font-bold">Forgot Password</h2>
            <p className="text-gray-600">
              Enter your email and we&apos;ll send you a password reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-gradient text-white"
              disabled={loading || !apiClient}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link
                to="/login"
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}