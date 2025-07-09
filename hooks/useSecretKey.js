import { useState } from "react";
import { apiClientWithAuth } from "../lib/axios";

export default function useSecretKey() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getAllSecretKeys = async () => {
    setLoading(true);
    try {
      const response = await apiClientWithAuth.get("/auth/api-keys");
      console.log("response:", response.data);
      return response.data;
    } catch (error) {
      console.error(error.response.data.error);
      setError(error.response.data.error);
      return error.response.data;
    } finally {
      setLoading(false);
    }
  };

  const createNewSecretKey = async (label) => {
    try {
      setLoading(true);
      const response = await apiClientWithAuth.post("/auth/api-keys", { label });
      console.log("response", response.data);
      return response.data;
    } catch (error) {
      console.error(error.response.data.error);
      setError(error.response.data.error);
      return error.response.data;
    } finally {
      setLoading(false);
    }
  };
  const updateSecretKey = async (id, label) => {
    try {
      setLoading(true);
      const response = await apiClientWithAuth.patch(`/auth/api-keys/${id}`, { label });
      console.log("response", response.data);
      return response.data;
    } catch (error) {
      console.error(error.response.data.error);
      setError(error.response.data.error);
      return error.response.data;
    } finally {
      setLoading(false);
    }
  };
  const deleteSecretKey = async (id) => {
    try {
      setLoading(true);
      const response = await apiClientWithAuth.delete(`/auth/api-keys/${id}`);
      console.log("response", response.data);
      return response.data;
    } catch (error) {
      console.error(error.response.data.error);
      setError(error.response.data.error);
      return error.response.data;
    } finally {
      setLoading(false);
    }
  };

  return { getAllSecretKeys, error, loading, createNewSecretKey, updateSecretKey, deleteSecretKey};
}
