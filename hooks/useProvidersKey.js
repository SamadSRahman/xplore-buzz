import { useState } from "react";
import { apiClientWithAuth } from "../lib/axios";
import { toast } from "./use-toast";

export default function useProvidersKey() {
  const [providers, setProviders] = useState([]);

  const getAllProviders = async (setApiKeys, setDefaultProvider) => {
    try {
      const response = await apiClientWithAuth.get("/cdn-configs");
      const configs = response.data.data.configs || [];

      // Store full configs in hook state
      setProviders(configs);

      // Set default provider ID
      const defaultConfig = configs.find((cfg) => cfg.is_default);
      setDefaultProvider(defaultConfig?.id || null);

      // Optional: set active keys (if you still want to filter)
      const activeKeys = configs.filter((cfg) => cfg.is_active);
      setApiKeys(activeKeys);

      return true;
    } catch (error) {
      console.error(
        "getAllProviders error:",
        error?.response?.data || error.message
      );
      return false;
    }
  };

  const storeProviderKey = async (
    cloud_name,
    api_key,
    api_secret,
    provider = "cloudinary"
  ) => {
    try {
      const response = await apiClientWithAuth.post("/cdn-configs", {
        provider,
        cloud_name,
        api_key,
        api_secret,
      });
      console.log("response", response);
      return response.data;
    } catch (error) {
      console.error(
        "storeProviderKey error:",
        error?.response?.data || error.message
      );
      return error.response?.data || { success: false, error: "Unknown error" };
    }
  };

  const setProviderAsDefault = async (provider) => {
    try {
      const response = await apiClientWithAuth.patch(
        `/cdn-configs/${provider.id}`
      ); // ✅ Fix: use provider.id

      console.log("Set default response:", response.data);

      toast({
        title: "Default provider updated",
        description: `${
          provider.cloud_name || provider.name
        } has been set as default`,
        variant: "default",
      });

      return true;
    } catch (error) {
      console.error(
        "Set default error:",
        error.response?.data || error.message
      );
      toast({
        title: "Error updating default provider",
        description: `${error.response?.data?.error || "Unexpected error"}`,
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteProvider = async (id) => {
    try {
      const response = await apiClientWithAuth.delete(`/cdn-configs/${id}`);
      console.log(response.data);
      toast({
        title: "Provider deleted",
        variant: "default",
      });
      return true;
    } catch (error) {
      console.error(error.response.data);
      toast({
        title: "Error deleting provider",
        description: `${error.response.data.error}`,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateProviderKey = async (
    id,
    cloud_name,
    api_key,
    api_secret,
    is_default
  ) => {
    try {
      const response = await apiClientWithAuth.patch(`/cdn-configs/${id}`, {
        cloud_name,
        api_key,
        api_secret,
        is_default,
      });
      console.log("response", response.data);
      return response.data;
    } catch (error) {
      console.error(error.response.data);
      return error.response.data || { success: false, error: "Unknown error" };
    }
  };

  return {
    getAllProviders,
    providers,
    storeProviderKey,
    setProviderAsDefault,
    deleteProvider,
    updateProviderKey,
  };
}
