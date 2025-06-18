import { useState } from "react";
import { apiClientWithAuth } from "../lib/axios";
import { toast } from "./use-toast";

export default function useProvidersKey() {
  const [providers, setProviders] = useState([]);
  // const [defaultProvider, setDefaultProvider] = useState("")

  const getAllProviders = async (setApiKeys, setDefaultProvider) => {
    try {
      const response = await apiClientWithAuth.get("/ai/providers");
      console.log("Providers", response.data);
      setProviders(response.data.data.providers);
      setDefaultProvider(response.data.data.defaultProvider);
      const apiKeys = response.data.data.providers.filter(
        (provider) => provider.hasKey === true
      );
      setApiKeys(apiKeys);
      if (response.data.data.defaultProvider!==null) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      // setError(error.response.data.error);

      // throw Error(error?.response?.data?.error);
    }
  };

  const storeProviderKey = async (apiKey, provider, maxToken, temperature) => {
    try {
      const response = await apiClientWithAuth.post("/ai/provider-key", {
        apiKey,
        provider,
        maxToken,
        temperature,
      });
      console.log("response", response);
      return response.data;
    } catch (error) {
      console.error(error);

      return error.response.data;
    }
  };

  const setProviderAsDefault = async (provider) => {
    try {
      const response = await apiClientWithAuth.patch("/ai/default-provider", {
        provider: provider.id,
      });
      console.log(response.data);
      toast({
        title: "Default provider updated",
        description: `${provider.name} has been set as default`,
        variant: "default",
      });
      return true;
    } catch (error) {
      console.error(error.response.data);
      toast({
        title: "Error updating default provider",
        description: `${error.response.data.error}`,
        variant: "destructive",
      });
      return false;
    }
  };
  const deleteProvider = async (provider) => {
    try {
      const response = await apiClientWithAuth.delete("/ai/provider-key", {
        data: { provider: provider.id },
      });
      console.log(response.data);
      toast({
        title: "Provider deleted",
        description: `${provider.name} has been deleted`,
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

  const updateProviderKey = async (provider, maxToken, temperature) => {
    try {
      const response = await apiClientWithAuth.patch("/ai/provider-key", {
        provider:provider.id,
        maxToken, temperature
      });
      console.log("response", response.data);
     return response.data
    } catch (error) {
      console.error(error.response.data);
      return error.response.data
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
