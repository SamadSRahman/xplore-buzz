"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Globe } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, googleSignIn, loading, error } = useAuth();

  const handleGoogleSuccess = async (tokenResponse) => {
    console.log("Google login success:", tokenResponse);

    const authCode = tokenResponse?.code; // ✅ This is the Google auth code

    // Now pass it to your hook:
    const result = await googleSignIn(authCode);

    console.log("Result from googleSignIn:", result);

    if (result.success) {
      navigate("/videos");
    } else {
      toast.error("Google sign-in failed.");
    }
  };

  const handleGoogleError = (err) => {
    console.error("Google OAuth error", err);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
    scope: "profile email", // request profile + email
    flow: "auth-code", // or 'auth-code' if you want a code to exchange server-side
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const result = await login({ email, password });
      if (result.success) {
        toast.success("Welcome back!");
        navigate("/videos");
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
    }
  };

  // ✅ GOOGLE SIGN IN SETUP
  // useEffect(() => {
  //   /* global google */
  //   if (window.google) {
  //     google.accounts.id.initialize({
  //       client_id:
  //         "135383393969-o1s2vecpf1n41sh4jngrhhvdf7l9en84.apps.googleusercontent.com",
  //       callback: handleGoogleCallback,
  //     });

  //     google.accounts.id.renderButton(
  //       document.getElementById("google-signin"),
  //       {
  //         theme: "outline",
  //         size: "large",
  //         width: "250",
  //       }
  //     );

  //     google.accounts.id.prompt(); // optional
  //   }
  // }, []);

  // const handleGoogleCallback = async (response) => {
  //   console.log("Google ID Token:", response.credential);
  //   try {
  //     const result = await googleSignIn(response.credential);
  //     if (result.success) {
  //       toast.success("Google sign-in successful!");
  //       navigate("/videos");
  //     } else {
  //       toast.error("Google sign-in failed");
  //     }
  //   } catch (error) {
  //     toast.error(error.message || "Google sign-in failed");
  //   }
  // };

  // ✅ OPTION 2: Using Google Identity Services (if you prefer this approach)
  // Comment out the above googleLogin if using this approach

  useEffect(() => {
    if (window.google) {
      google.accounts.id.initialize({
        client_id:
          "135383393969-o1s2vecpf1n41sh4jngrhhvdf7l9en84.apps.googleusercontent.com",
        callback: handleGoogleCallback,
      });

      google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        {
          theme: "outline",
          size: "large",
          width: "100%",
        }
      );
    }
  }, []);

  const handleGoogleCallback = async (response) => {
    console.log("Google ID Token:", response.credential);

    try {
      // response.credential is the JWT ID token
      const result = await googleSignIn(response.credential);

      if (result.success) {
        toast.success("Google sign-in successful!");
        navigate("/videos");
      } else {
        toast.error("Google sign-in failed");
      }
    } catch (error) {
      toast.error(error.message || "Google sign-in failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-buzz-gradient flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to your BUZZ account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="ml-2 text-sm text-gray-600">
                    Remember me
                  </span>
                </label>
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-gradient text-white"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>

              {/* <Button
                onClick={() => googleLogin()}
                variant="outline"
                className="w-fit flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 m-auto"
              >
                <Globe size={18} /> Sign In with Google
              </Button> */}

              <div id="google-signin-button" className="w-full"></div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
