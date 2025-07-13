"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Copy,
  Key,
  ShieldCheck,
  RefreshCw,
  Plus,
  Settings,
  Trash2,
  Eye,
  EyeOff,
  Crown,
  Edit3,
  Check,
  X,
  Cloud,
  Activity,
  Calendar,
  Zap,
  Thermometer,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useSecretKey from "@/hooks/useSecretKey";
import useProvidersKey from "@/hooks/useProvidersKey";

export default function ApiKeysPage() {
  const { toast } = useToast();
  const { getAllSecretKeys, createNewSecretKey, deleteSecretKey, loading } =
    useSecretKey();
  const {
    getAllProviders,
    providers,
    storeProviderKey,
    setProviderAsDefault,
    deleteProvider,
    updateProviderKey,
  } = useProvidersKey();

  // State for API Keys
  const [defaultProvider, setDefaultProvider] = useState("");
  const [platform, setPlatform] = useState("cloudinary");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [cloudName, setCloudName] = useState("");
  const [temperature, setTemperature] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState([]);
  const [showApiKey, setShowApiKey] = useState({});
  const [selectedTab, setSelectedTab] = useState("api-keys");
  const [showApiSecret, setShowApiSecret] = useState({});

  // State for editing providers
  const [editingProvider, setEditingProvider] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  // State for Secret Keys
  const [secretKeys, setSecretKeys] = useState([]);
  const [newKeyLabel, setNewKeyLabel] = useState("");
  const [showSecretKeys, setShowSecretKeys] = useState({});

  useEffect(() => {
    loadSecretKeys();
    getAllProviders(setApiKeys, setDefaultProvider);
    setPlatform("cloudinary");
  }, []);

  const loadSecretKeys = async () => {
    const keys = await getAllSecretKeys();
    if (keys) {
      setSecretKeys(keys.data);
    }
  };

  const handleCreateSecretKey = async () => {
    if (!newKeyLabel) {
      toast({
        title: "Missing information",
        description: "Please enter a label for your new key",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await createNewSecretKey(newKeyLabel);
      if (result) {
        await loadSecretKeys();
        setNewKeyLabel("");
        toast({
          title: "Success",
          description: "New secret key created successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create secret key",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSecretKey = async (id) => {
    console.log("id", id);

    const isDeleteConfirmed = confirm(
      "Are you sure you want to delete this key?"
    );
    if (!isDeleteConfirmed) {
      return;
    }
    try {
      console.log("id passed for delete", id);

      const result = await deleteSecretKey(id);
      if (result.success) {
        await loadSecretKeys();
        toast({
          title: "Success",
          description: "Secret key deleted successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete secret key",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (key) => {
    const isSuccess = await setProviderAsDefault(key);
    if (isSuccess) {
      setTimeout(() => {
        getAllProviders(setApiKeys, setDefaultProvider);
      }, 500);
      toast({
        title: "Default provider updated",
        description: `${key.cloud_name} is now your default provider`,
      });
    }
  };

  const copySecretKey = (key) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied!",
      description: "Secret key copied to clipboard",
    });
  };

  const toggleSecretKeyVisibility = (id) => {
    setShowSecretKeys((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleApiKeyVisibility = (id) => {
    setShowApiKey((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleApiSecretKeyVisibility = (id) => {
    setShowApiSecret((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDeleteProvider = async (key) => {
    const isConfirmed = confirm(
      "Are you sure you want to delete this provider key?"
    );
    if (!isConfirmed) {
      return;
    }
    const isSuccess = await deleteProvider(key.id);
    if (isSuccess) {
      if (key.id === defaultProvider) {
        setDefaultProvider(null);
      }
      getAllProviders(setApiKeys, setDefaultProvider);
      toast({
        title: "Provider deleted",
        description: "Cloud platform key has been removed successfully",
      });
    }
  };

  const handleAddKey = async () => {
    if (!cloudName || !apiKey) {
      toast({
        title: "Missing information",
        description: "Please enter both cloud name and API key",
        variant: "destructive",
      });
      return;
    }

    setAddLoading(true);

    try {
      const result = await storeProviderKey(
        cloudName,
        apiKey,
        apiSecret,
        "cloudinary"
      );

      if (result.success) {
        getAllProviders(setApiKeys, setDefaultProvider);
        setCloudName("");
        setApiKey("");
        setApiSecret("");
        setTemperature("");
        toast({
          title: "API key added",
          description: `Your Cloudinary credentials have been saved`,
        });
      } else {
        toast({
          title: "Failed to add API key",
          description: result.error || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setAddLoading(false);
    }
  };

  // Edit provider functions
  const handleEditProvider = (provider) => {
    setEditingProvider(provider.id);
    setCloudName(provider.cloud_name || "");
    setApiKey(provider.api_key || "");
    setApiSecret(provider.api_secret || "");
    // Initialize visibility states for the edited provider
    setShowApiKey((prev) => ({
      ...prev,
      [provider.id]: true,
    }));
    setShowApiSecret((prev) => ({
      ...prev,
      [provider.id]: true,
    }));
  };

  const handleCancelEdit = () => {
    setEditingProvider(null);
    setCloudName("");
    setApiKey("");
    setApiSecret("");
  };

  const handleUpdateProvider = async () => {
    setUpdateLoading(true);

    try {
      const result = await updateProviderKey(
        editingProvider,
        cloudName,
        apiKey,
        apiSecret,
        true // Set is_default to true directly
      );

      if (result.success) {
        getAllProviders(setApiKeys, setDefaultProvider);
        setEditingProvider(null);
        setCloudName("");
        setApiKey("");
        setApiSecret("");
        toast({
          title: "Settings updated",
          description: `Configuration for ${cloudName} has been updated successfully`,
        });
      } else {
        toast({
          title: "Failed to update settings",
          description: result.error || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update provider settings",
        variant: "destructive",
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12 space-y-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-gradient rounded-full shadow-lg">
            <Key className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-purple-gradient bg-clip-text text-transparent">
              API Keys Management
            </h1>
            <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">
              Securely manage your cloud platform API keys and secret keys with
              advanced configuration options
            </p>
          </div>
        </div>

        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          defaultValue="api-keys"
          className="space-y-10"
        >
          <div className="flex justify-center w-full">
            <TabsList className="flex w-full bg-purple-gradient backdrop-blur-sm shadow-md rounded-full p-1">
              <TabsTrigger
                value="api-keys"
                className="flex-1 text-center text-sm font-medium py-2 px-4 transition-all duration-200 
              rounded-full text-white data-[state=active]:bg-white data-[state=active]:text-purple-600"
              >
                <div className="flex items-center justify-center gap-2">
                  <Cloud className="h-4 w-4" />
                  Cloud Platform Keys
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="secret-keys"
                className="flex-1 text-center text-sm font-medium py-2 px-4 transition-all duration-200 
              rounded-full text-white data-[state=active]:bg-white data-[state=active]:text-purple-600"
              >
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Secret Keys
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="api-keys" className="space-y-10">
            {/* Add New API Key Section */}
            <Card className="bg-white/95 backdrop-blur-sm border border-gray-100 shadow-2xl rounded-2xl w-full">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-2xl p-8">
                <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-gray-800">
                  <div className="p-3 bg-purple-gradient rounded-full">
                    <Plus className="h-5 w-5 text-white" />
                  </div>
                  {editingProvider
                    ? "Update Cloud Platform Key"
                    : "Add New Cloud Platform Key"}
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  {editingProvider
                    ? "Update your Cloud platform API keys with custom configuration settings"
                    : "Connect your Cloud platform API keys with custom configuration settings"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Basic Configuration */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                      <div className="p-2 bg-purple-gradient rounded-full">
                        <Settings className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Basic Configuration
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="platform"
                        className="text-sm font-medium text-gray-700"
                      >
                        Cloud Platform
                      </Label>
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg px-4 py-3 flex items-center gap-3">
                        <Cloud className="h-5 w-5 text-purple-600" />
                        <span className="font-medium text-purple-900">
                          Cloudinary
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="apiKey"
                        className="text-sm font-medium text-gray-700"
                      >
                        API Key
                      </Label>
                      <div className="relative">
                        <div className="bg-gray-300 p-[1.5px] rounded-lg">
                          <Input
                            id="apiKey"
                            type={
                              showApiKey[editingProvider] ? "text" : "password"
                            }
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your API key"
                            className="w-full h-12 bg-white rounded-lg px-4 pr-12 border-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-2 h-8 w-8 p-0 rounded-full"
                          onClick={() =>
                            toggleApiKeyVisibility(editingProvider)
                          }
                        >
                          {showApiKey[editingProvider] ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        Your API key will be encrypted before storage
                      </p>
                    </div>
                  </div>

                  {/* Advanced Configuration */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                      <div className="p-2 bg-purple-gradient rounded-full">
                        <Zap className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Advanced Settings
                      </h3>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="cloudName"
                          className="text-sm font-medium text-gray-700"
                        >
                          Cloud Name
                        </Label>
                        <div className="relative">
                          <div className="bg-gray-300 p-[1.5px] rounded-lg">
                            <Input
                              id="cloudName"
                              type="text"
                              value={cloudName}
                              onChange={(e) => setCloudName(e.target.value)}
                              placeholder="Enter a unique cloud name"
                              className="w-full h-12 bg-white rounded-lg px-4 pr-12 border-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="apiSecret"
                          className="text-sm font-medium text-gray-700"
                        >
                          API Secret Key
                        </Label>
                        <div className="relative">
                          <div className="bg-gray-300 p-[1.5px] rounded-lg">
                            <Input
                              id="apiSecret"
                              type={
                                showApiSecret[editingProvider]
                                  ? "text"
                                  : "password"
                              }
                              value={apiSecret}
                              onChange={(e) => setApiSecret(e.target.value)}
                              placeholder="Enter your API secret"
                              className="w-full h-12 bg-white rounded-lg px-4 pr-12 border-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-2 h-8 w-8 p-0 rounded-full"
                            onClick={() =>
                              toggleApiSecretKeyVisibility(editingProvider)
                            }
                          >
                            {showApiSecret[editingProvider] ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          Your API Secret Key will be encrypted before storage
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-gray-50/80 rounded-b-2xl p-6">
                <div className="flex justify-end w-full">
                  <Button
                    onClick={
                      editingProvider ? handleUpdateProvider : handleAddKey
                    }
                    disabled={
                      !platform ||
                      !apiKey ||
                      (editingProvider ? updateLoading : addLoading)
                    }
                    className="cursor-pointer bg-purple-gradient hover:opacity-90 text-white shadow-lg hover:shadow-xl rounded-lg px-8 py-3 h-auto transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {editingProvider
                      ? updateLoading
                        ? "Updating..."
                        : "Update API Key"
                      : addLoading
                      ? "Adding..."
                      : "Add API Key"}
                  </Button>
                </div>
              </CardFooter>
            </Card>

            {/* Existing API Keys */}
            <Card className="bg-white/95 backdrop-blur-sm border border-gray-100 shadow-2xl rounded-2xl w-full">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-2xl p-8">
                <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-gray-800">
                  <div className="p-3 bg-purple-gradient rounded-full">
                    <Key className="h-5 w-5 text-white" />
                  </div>
                  Your Cloud Platform Keys
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Manage your connected Cloud platform API keys and their
                  configurations
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {apiKeys.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
                      <Key className="h-10 w-10 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                      No API keys added
                    </h3>
                    <p className="text-gray-600 max-w-md text-lg leading-relaxed">
                      Add your first Cloud platform API key to start using
                      advanced Cloud features with custom configurations.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {providers?.map((key) => (
                      <div
                        key={key.id}
                        className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                          defaultProvider === key.id
                            ? "border-yellow-300 bg-gradient-to-r from-yellow-50 to-amber-50 shadow-md"
                            : "border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50/30"
                        }`}
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="w-14 h-14 bg-purple-gradient rounded-full flex items-center justify-center shadow-lg">
                                  <Cloud className="h-7 w-7 text-white" />
                                </div>
                                {defaultProvider === key.id && (
                                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full p-1.5 shadow-lg">
                                    <Crown className="h-3 w-3 text-white" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="text-xl font-semibold capitalize text-gray-800">
                                    {key.cloud_name || key.provider}
                                  </h4>
                                  {defaultProvider === key.id && (
                                    <Badge className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0 shadow-sm px-2 py-1 rounded-full">
                                      <Crown className="h-3 w-3 mr-1" />
                                      Default
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Last used: {key.lastUsed || "Unknown"}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Activity className="h-3 w-3" />
                                    Status: {key.hasKey ? "Active" : "Inactive"}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right space-y-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSetDefault(key)}
                                  className="text-xs bg-purple-gradient text-white hover:bg-purple-600 rounded-lg px-3 py-1"
                                >
                                  Set Default
                                </Button>
                              </div>
                              <div className="flex gap-2">
                                {defaultProvider !== key.id && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSetDefault(key)}
                                    className="text-xs bg-purple-gradient text-white hover:bg-purple-600 rounded-lg"
                                  >
                                    Set Default
                                  </Button>
                                )}
                                {key.id && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditProvider(key)}
                                    className="p-1 bg-purple-gradient text-white hover:bg-purple-600 rounded-lg"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1 bg-gradient-to-br from-red-500 to-red-600 text-white hover:bg-red-700 rounded-lg"
                                  onClick={() => handleDeleteProvider(key)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="secret-keys" className="space-y-10">
            <Card className="bg-white/95 backdrop-blur-sm border border-gray-100 shadow-2xl rounded-2xl w-full">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-t-2xl p-8">
                <CardTitle className="flex items-center gap-3 text-2xl font-semibold text-gray-800">
                  <div className="p-3 bg-purple-gradient rounded-full">
                    <ShieldCheck className="h-5 w-5 text-white" />
                  </div>
                  Secret Keys Management
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Create and manage secret keys for your applications and
                  integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Create New Secret Key */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                      <div className="p-2 bg-purple-gradient rounded-full">
                        <Plus className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Create New Secret Key
                      </h3>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="bg-gray-300 p-[1.5px] rounded-lg">
                          <Input
                            id="newKeyLabel"
                            value={newKeyLabel}
                            onChange={(e) => setNewKeyLabel(e.target.value)}
                            placeholder="Enter a descriptive label for your key (e.g., 'Production API', 'Development')"
                            className="w-full h-12 bg-white rounded-lg px-4 pr-12 border-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={handleCreateSecretKey}
                        disabled={!newKeyLabel || loading}
                        className="cursor-pointer bg-purple-gradient hover:opacity-90 text-white shadow-lg hover:shadow-xl rounded-lg px-8 py-3 h-auto transition-all duration-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Key
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Existing Secret Keys */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Your Secret Keys
                    </h3>

                    {secretKeys?.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
                          <ShieldCheck className="h-10 w-10 text-purple-600" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                          No Secret Keys
                        </h3>
                        <p className="text-gray-600 max-w-md text-lg leading-relaxed">
                          Create your first secret key to start using the API
                          and enable secure access to your applications.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {secretKeys?.map((key) => (
                          <div
                            key={key.id}
                            className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-200 hover:bg-purple-50/30 transition-all duration-300"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-gradient rounded-full flex items-center justify-center shadow-lg">
                                  <Key className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                  <h4 className="text-lg font-semibold text-gray-800">
                                    {key.label}
                                  </h4>
                                  <p className="text-sm text-gray-600 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Created:{" "}
                                    {new Date(
                                      key.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    toggleSecretKeyVisibility(key.id)
                                  }
                                  className="p-1 bg-purple-gradient text-white hover:bg-purple-600 rounded-lg"
                                >
                                  {showSecretKeys[key.id] ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copySecretKey(key.key)}
                                  className="p-1 bg-purple-gradient text-white hover:bg-purple-600 rounded-lg"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1 bg-gradient-to-br from-red-500 to-red-600 text-white hover:bg-red-700 rounded-lg"
                                  onClick={() => handleDeleteSecretKey(key.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="bg-gray-300 p-[1.5px] rounded-lg">
                                <Input
                                  value={key.key}
                                  readOnly
                                  type={
                                    showSecretKeys[key.id] ? "text" : "password"
                                  }
                                  className="w-full h-12 bg-white rounded-lg px-4 pr-12 border-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}