"use client";

import { useState } from "react";
import { apiClient } from "../lib/axios";
import axios from "axios";

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/accounts/login", credentials);
      console.log("response", response.data);
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      console.error(error);
      setError(error.response.data.error);

      throw Error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials) => {
    console.log("credentials", credentials);

    setLoading(true);
    try {
      const response = await apiClient.post("accounts/signup", {
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        confirmPassword: credentials.confirmPassword, // <-- Add this line
      });
      console.log(response);
      alert(
        "A verification link has been sent to your email address, please click on that to access your account."
      );
      return response.data; // return success flag to the page
    } catch (error) {
      console.error(error);
      setError(error.response.data.error);
      throw Error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (token) => {
    try {
      const response = await apiClient.get(`/accounts/verify-email/${token}`);
      console.log(response);
      // alert("Email Verification Successful!");
      return response.data;
    } catch (error) {
      console.error(error);
      setError(error.response.data.error);
      return error.response.data;
    }
  };
  const resendVerification = async (email) => {
    try {
      const response = await apiClient.post("/accounts/resend-verification", {
        email,
      });
      console.log("response", response);
      return response.data;
    } catch (error) {
      console.error(error);
      setError(error.response.data.error);
      throw Error(error.response.data.error);
    }
  };
  const resetPassword = async (token, password, confirmPassword) => {
    console.log("parmas", token, password, confirmPassword);

    try {
      const response = await apiClient.patch(
        `/accounts/reset-password/${token}`,
        { password, confirm_password: confirmPassword }
      );
      console.log("response", response.data);
      return response.data;
    } catch (error) {
      console.error("error:", error.response.data.error);
      return error.response.data;
    }
  };
  const logout = async () => {
    let token = "";
    if (window !== undefined) {
      localStorage.getItem("token");
    }
    // api client not used due to token issue
    try {
      const response = await axios.post(
        "https://prompthkit.apprikart.com/api/v1/xplore/accounts/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.href = "/login";
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return response.data;
    } catch (error) {
      console.error(error.response.data.error);
      return error.response.data;
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      const response = await apiClient.post("/accounts/forgot-password", {
        email,
      });
      console.log(response.data);
      setError(null);
      return response.data;
    } catch (error) {
      console.error(error);
      setError(error.response.data.error);
      return error.response.data;
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = async (token) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/accounts/auth/google", {
        idToken: token,
      });
      console.log("response", response);
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      // console.log("error", error);

      console.error(error);
      setError(error.response.data.error);

      throw Error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token is missing");
    }

    try {
      const response = await apiClient.patch(
        "/accounts/change-password",
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error(
        error.response?.data?.error || "Failed to change password"
      );
    }
  };

  const deleteAccount = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token is missing");
    }

    try {
      const response = await apiClient.delete("/accounts/delete", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Clean up local storage after successful deletion
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Optionally redirect or return response
      window.location.href = "/"; // or wherever you want

      return response.data;
    } catch (error) {
      console.error("Delete account error:", error);
      throw new Error(
        error.response?.data?.error || "Failed to delete account"
      );
    }
  };

  const updateProfile = async (name) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("Authentication token is missing");

      const response = await apiClient.patch(
        "/accounts/profile",
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Optionally update localStorage user data
      const updatedUser = { ...JSON.parse(localStorage.getItem("user")), name };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to update profile"
      );
    }
  };

  const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("Authentication token is missing");

    const response = await apiClient.get("/accounts/current-user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to fetch current user"
    );
  }
};


  return {
    login,
    register,
    loading,
    error,
    verifyEmail,
    resendVerification,
    logout,
    resetPassword,
    forgotPassword,
    googleSignIn,
    changePassword,
    deleteAccount,
    updateProfile,
    getCurrentUser,
  };
}
