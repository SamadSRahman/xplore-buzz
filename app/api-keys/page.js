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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
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
  const [platform, setPlatform] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [maxTokens, setMaxTokens] = useState([1000]);
  const [temperature, setTemperature] = useState([0.7]);
  const [testLoading, setTestLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState([]);
  const [showApiKey, setShowApiKey] = useState({});

  // State for editing providers
  const [editingProvider, setEditingProvider] = useState(null);
  const [editMaxTokens, setEditMaxTokens] = useState([1000]);
  const [editTemperature, setEditTemperature] = useState([0.7]);
  const [updateLoading, setUpdateLoading] = useState(false);

  // State for Secret Keys
  const [secretKeys, setSecretKeys] = useState([]);
  const [newKeyLabel, setNewKeyLabel] = useState("");
  const [showSecretKeys, setShowSecretKeys] = useState({});

  useEffect(() => {
    loadSecretKeys();
    // getAllProviders(setApiKeys, setDefaultProvider);
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
    const isDeleteConfirmed = confirm(
      "Are you sure you want to delete this key?"
    );
    if (!isDeleteConfirmed) {
      return;
    }
    try {
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
    console.log(key);
    const isSuccess = await setProviderAsDefault(key);
    if (isSuccess) {
      setTimeout(() => {
        getAllProviders(setApiKeys, setDefaultProvider);
      }, 500);
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

  const handleTestConnection = async () => {
    if (!platform || !apiKey) {
      toast({
        title: "Missing information",
        description: "Please select a platform and enter an API key",
        variant: "destructive",
      });
      return;
    }

    setTestLoading(true);

    try {
      // Mock API test with configuration
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Connection successful",
        description: `Successfully connected to ${platform} API with max tokens: ${maxTokens[0]}, temperature: ${temperature[0]}`,
      });
    } catch (error) {
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect to the API",
        variant: "destructive",
      });
    } finally {
      setTestLoading(false);
    }
  };

  const handleDeleteProvider = async (key) => {
    const isConfirmed = confirm(
      "Are you sure you want to delete this provider key?"
    );
    if (!isConfirmed) {
      return;
    }
    const isSuccess = await deleteProvider(key);
    if (isSuccess) {
      getAllProviders(setApiKeys, setDefaultProvider);
    }
  };

  const handleAddKey = async () => {
    if (!platform || !apiKey) {
      toast({
        title: "Missing information",
        description: "Please select a platform and enter an API key",
        variant: "destructive",
      });
      return;
    }

    setAddLoading(true);

    try {
      const result = await storeProviderKey(
        apiKey,
        platform,
        maxTokens[0],
        temperature[0]
      );

      if (result.success) {
        getAllProviders(setApiKeys, setDefaultProvider);

        // Reset form
        setPlatform("");
        setApiKey("");
        setMaxTokens([1000]);
        setTemperature([0.7]);

        toast({
          title: "API key added",
          description: `Your ${platform} API key has been securely stored with custom settings`,
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
        description: "Failed to add API key",
        variant: "destructive",
      });
    } finally {
      setAddLoading(false);
    }
  };

  const resetConfiguration = () => {
    setMaxTokens([1000]);
    setTemperature([0.7]);
    toast({
      title: "Configuration Reset",
      description: "Settings have been reset to default values",
    });
  };

  // Edit provider functions
  const handleEditProvider = (provider) => {
    setEditingProvider(provider.id);
    setEditMaxTokens([provider.max_token || 1000]);
    setEditTemperature([provider.temperature || 0.7]);
  };

  const handleCancelEdit = () => {
    setEditingProvider(null);
    setEditMaxTokens([1000]);
    setEditTemperature([0.7]);
  };

  const handleUpdateProvider = async (provider) => {
    setUpdateLoading(true);

    try {
      // Since we're using the same API as adding, we need to pass the existing API key
      // You might need to adjust this based on your API structure
      const currentProvider = provider;

      const result = await updateProviderKey(
        provider,
        editMaxTokens[0],
        editTemperature[0]
      );

      if (result.success) {
        getAllProviders(setApiKeys, setDefaultProvider);
        setEditingProvider(null);

        toast({
          title: "Settings updated",
          description: `Configuration for ${currentProvider.name} has been updated successfully`,
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

  const resetEditConfiguration = () => {
    setEditMaxTokens([1000]);
    setEditTemperature([0.7]);
  };

  return (
    <div className="space-y-8 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            API Keys Management
          </h2>
          <p className="text-muted-foreground mt-2">
            Manage your secret keys and AI platform API keys with custom
            configurations
          </p>
        </div>
      </div>

      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="api-keys" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            AI Platform Keys
          </TabsTrigger>
          <TabsTrigger value="secret-keys" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Secret Keys
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys" className="space-y-6">
          {/* Add New API Key Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Add New AI Platform Key
              </CardTitle>
              <CardDescription>
                Connect your AI platform API keys with custom configuration
                settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Configuration */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="h-4 w-4 text-primary" />
                    <h3 className="text-lg font-semibold">
                      Basic Configuration
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="platform">AI Platform</Label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select AI platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {providers?.map((provider) => (
                          <SelectItem key={provider.id} value={provider.id}>
                            <span className="flex items-center gap-2">
                              {/* {provider.id === "openai" ? <SiOpenai /> : <SiGooglegemini />} */}
                              {provider.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <div className="relative">
                      <Input
                        id="apiKey"
                        type={showApiKey.new ? "text" : "password"}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your API key"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => toggleApiKeyVisibility("new")}
                      >
                        {showApiKey.new ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      🔒 Your API key will be encrypted before storage
                    </p>
                  </div>
                </div>

                {/* Advanced Configuration */}
                <div className="space-y-4">
                  {/* <div className="flex items-center gap-2 mb-4">
                    <Settings className="h-4 w-4 text-primary" />
                    <h3 className="text-lg font-semibold">Advanced Settings</h3>
                  </div> */}

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="cloud_name">Cloud Name</Label>
                        {/* <Badge variant="secondary">{maxTokens[0]}</Badge> */}
                      </div>
                      <Input
                        id="cloudName"
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your cloud name"
                        className="pr-10"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="temperature">Temperature</Label>
                        <Badge variant="secondary">{temperature[0]}</Badge>
                      </div>
                      <div className="relative">
                        <Input
                          id="apiKey"
                          type={showApiKey.new ? "text" : "password"}
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="Enter your cloud name"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => toggleApiKeyVisibility("new")}
                        >
                          {showApiKey.new ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetConfiguration}
                      className="w-full"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset to Defaults
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div></div>
              <Button
                onClick={handleAddKey}
                disabled={!platform || !apiKey || addLoading}
                className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                {addLoading ? "Adding..." : "Add API Key"}
              </Button>
            </CardFooter>
          </Card>

          {/* Existing API Keys */}
          <Card>
            <CardHeader>
              <CardTitle>Your AI Platform Keys</CardTitle>
              <CardDescription>
                Manage your connected AI platform API keys and their
                configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {apiKeys.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-4">
                    <Key className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">
                    No API keys added
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    Add your first AI platform API key to start using advanced
                    AI features with custom configurations.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys?.map((key) => (
                    <div
                      key={key.id}
                      className={`border rounded-lg p-4 transition-colors relative ${
                        defaultProvider === key.id
                          ? "border-primary bg-primary/5 hover:bg-primary/10"
                          : "hover:bg-accent/50"
                      }`}
                    >
                      {editingProvider === key.id ? (
                        // Edit Mode
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"></div>
                                {defaultProvider === key.id && (
                                  <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                                    <Crown className="h-3 w-3 text-white" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold capitalize">
                                    {key.name || key.platform}
                                  </h4>
                                  <Badge variant="outline" className="text-xs">
                                    Editing
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Update configuration settings
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancelEdit}
                                disabled={updateLoading}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateProvider(key)}
                                disabled={updateLoading}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label htmlFor={`editMaxTokens-${key.id}`}>
                                  Max Tokens
                                </Label>
                                <Badge variant="secondary">
                                  {editMaxTokens[0]}
                                </Badge>
                              </div>
                              <Slider
                                id={`editMaxTokens-${key.id}`}
                                min={100}
                                max={4000}
                                step={100}
                                value={editMaxTokens}
                                onValueChange={setEditMaxTokens}
                                className="w-full"
                              />
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label htmlFor={`editTemperature-${key.id}`}>
                                  Temperature
                                </Label>
                                <Badge variant="secondary">
                                  {editTemperature[0]}
                                </Badge>
                              </div>
                              <Slider
                                id={`editTemperature-${key.id}`}
                                min={0}
                                max={2}
                                step={0.1}
                                value={editTemperature}
                                onValueChange={setEditTemperature}
                                className="w-full"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={resetEditConfiguration}
                              disabled={updateLoading}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Reset to Defaults
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                {/* {key.name === "Openai" ? <SiOpenai className="h-5 w-5" /> : <SiGooglegemini className="h-5 w-5" />} */}
                              </div>
                              {defaultProvider === key.id && (
                                <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                                  <Crown className="h-3 w-3 text-white" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold capitalize">
                                  {key.name || key.platform}
                                </h4>
                                {defaultProvider === key.id && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                  >
                                    Default
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Last used: {key.lastUsed || "Unknown"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <Badge
                                className={
                                  key.hasKey
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                }
                              >
                                {key.hasKey ? "Active" : "Inactive"}
                              </Badge>
                              <div className="text-xs text-muted-foreground mt-1">
                                Tokens: {key.max_token || 1000} | Temp:{" "}
                                {key.temperature || 0.7}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {defaultProvider !== key.id && key.hasKey && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSetDefault(key)}
                                  className="text-xs"
                                >
                                  Set Default
                                </Button>
                              )}
                              {key.hasKey && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditProvider(key)}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteProvider(key)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="secret-keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Secret Keys Management
              </CardTitle>
              <CardDescription>
                Create and manage secret keys for your applications and
                integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Create New Secret Key */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-primary" />
                    <h3 className="text-lg font-semibold">
                      Create New Secret Key
                    </h3>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1">
                      <Input
                        id="newKeyLabel"
                        value={newKeyLabel}
                        onChange={(e) => setNewKeyLabel(e.target.value)}
                        placeholder="Enter a descriptive label for your key (e.g., 'Production API', 'Development')"
                      />
                    </div>
                    <Button
                      onClick={handleCreateSecretKey}
                      disabled={!newKeyLabel || loading}
                      className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Key
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Existing Secret Keys */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Your Secret Keys</h3>

                  {secretKeys?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="rounded-full bg-muted p-4">
                        <ShieldCheck className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">
                        No Secret Keys
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                        Create your first secret key to start using the API and
                        enable secure access to your applications.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {secretKeys?.map((key) => (
                        <div
                          key={key.id}
                          className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Key className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-semibold">{key.label}</h4>
                                <p className="text-xs text-muted-foreground">
                                  Created:{" "}
                                  {new Date(key.createdAt).toLocaleDateString()}
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
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteSecretKey(key.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground">
                              Secret Key
                            </Label>
                            <Input
                              value={key.key}
                              readOnly
                              type={
                                showSecretKeys[key.id] ? "text" : "password"
                              }
                              className="font-mono text-sm"
                            />
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
  );
}
