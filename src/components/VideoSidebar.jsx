"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { uid } from "uid";
import {
  ChevronDown,
  ChevronUp,
  Upload,
  Plus,
  Image,
  MessageSquare,
  Clock,
  Palette,
  MapPin,
  Save,
  PlusIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";
import useVideo from "@/hooks/useVideo";

export default function VideoSidebar({
  id,
  video,
  annotations,
  currentTime,
  onAddAnnotation,
  onUpdateAnnotation,
  onDeleteAnnotation,
}) {
  const [thumbnailOpen, setThumbnailOpen] = useState(true);
  const [productOpen, setProductOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAnnotation, setEditingAnnotation] = useState(null);
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const { updateVideo } = useVideo();
  // Form states
  const [productForm, setProductForm] = useState({
    name: "",
    url: "",
    startTime: Math.floor(currentTime),
    endTime: Math.floor(currentTime) + 5,
    image: null,
    fontColor: "#FFFFFF",
    backgroundColor: "#240CEF",
    position: "bottom-right",
  });

  useEffect(() => {
    if (video.thumbnailUrl) {
      setThumbnailImage(video.thumbnailUrl);
    }
  }, [video]);

  const [surveyForm, setSurveyForm] = useState({
    question: "",
    type: "yes-no",
    options: ["Yes", "No"],
    startTime: Math.floor(currentTime),
    endTime: Math.floor(currentTime) + 1, // Changed from +10 to +1
  });

  const hasOverlapWithOtherType = (newAnnotation, annotations) => {
    return annotations.some((existing) => {
      if (existing.id === newAnnotation.id) return false; // skip same
      if (existing.type === newAnnotation.type) return false; // only check cross-type

      // Check if ranges overlap
      const overlap =
        newAnnotation.startTime < existing.endTime &&
        newAnnotation.endTime > existing.startTime;

      return overlap;
    });
  };

  const handleProductSubmit = () => {
    if (!productForm.name || !productForm.url) return;

    const annotation = {
      id: editingAnnotation?.id || uid(),
      type: "product",
      ...productForm,
      // Store the File object directly instead of converting to URL
      image: productForm.image || null,
    };

    if (hasOverlapWithOtherType(annotation, annotations)) {
      toast.error(
        "You can't use Product and Survey at the same timing. Please adjust the timing."
      );
      return;
    }

    if (editingAnnotation) {
      onUpdateAnnotation(editingAnnotation.id, annotation);
      setEditingAnnotation(null);
    } else {
      onAddAnnotation(annotation);
    }

    setProductForm({
      name: "",
      url: "",
      startTime: Math.floor(currentTime),
      endTime: Math.floor(currentTime) + 5,
      image: null,
      fontColor: "#FFFFFF",
      backgroundColor: "#240CEF",
      position: "bottom-right",
    });
    setIsEditing(false);
  };

  const handleSurveySubmit = () => {
    if (!surveyForm.question) return;

    const annotation = {
      id: editingAnnotation?.id || uid(),
      ...surveyForm,
      type: "survey",
      optionType: surveyForm.type, // ✅ add this!
      question: surveyForm.question,
      options: surveyForm.options,
      correctAnswers: surveyForm.correctAnswers,
    };

    // ✅ Step 1: Validate start and end time
    if (annotation.startTime >= annotation.endTime) {
      toast.error("Survey start time must be less than end time.");
      return;
    }

    // ✅ Step 2: Check for overlap with product annotations
    if (hasOverlapWithOtherType(annotation, annotations)) {
      toast.error(
        "You can't use Product and Survey at the same timing. Please adjust the timing."
      );
      return;
    }

    // ✅ Step 3: Proceed with add/update
    if (editingAnnotation) {
      onUpdateAnnotation(editingAnnotation.id, annotation);
      setEditingAnnotation(null);
    } else {
      onAddAnnotation(annotation);
    }

    // ✅ Step 4: Reset form safely
    const newStartTime = Math.floor(currentTime);
    const newEndTime = newStartTime + 10;

    setSurveyForm({
      question: "",
      type: "survey",
      surveyType: "yes-no",
      options: ["Yes", "No"],
      startTime: newStartTime,
      endTime: newEndTime,
    });

    setIsEditing(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const productAnnotations = annotations.filter((a) => a.type === "product");
  async function handleAddThumbnail() {
    if (!thumbnailImage) {
      toast.error("Please select a thumbnail image.");
      return;
    }

    try {
      await updateVideo(id, thumbnailImage);
      toast.success("Thumbnail added successfully!");
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      toast.error("Failed to upload thumbnail.");
    }
  }
  return (
    <div className="space-y-4 h-fit">
      {/* Thumbnail Section */}
      <Card className="bg-white shadow-sm">
        <Collapsible open={thumbnailOpen} onOpenChange={setThumbnailOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                Thumbnail
                {thumbnailOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden relative">
                  {thumbnailImage ? (
                    <img
                      src={
                        typeof thumbnailImage === "string"
                          ? thumbnailImage
                          : URL.createObjectURL(thumbnailImage)
                      }
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image className="w-12 h-12 text-gray-400" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setThumbnailImage(file);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                <div>
                  <Button
                    variant="outline"
                    className="w-full text-sm flex items-center justify-center"
                    onClick={handleAddThumbnail}
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add thumbnail to video
                  </Button>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Product Section */}
      <Card className="bg-white shadow-sm">
        <Collapsible open={productOpen} onOpenChange={setProductOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                {isEditing && editingAnnotation?.type === "product"
                  ? "Call to Action"
                  : "  (Call to Action)"}
                {productOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {!isEditing ? (
                <>
                  {productAnnotations.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {productAnnotations.map((annotation) => (
                        <div
                          key={annotation.id}
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                            {annotation.imageUrl ? (
                              <img
                                src={
                                  typeof annotation.imageUrl === "string"
                                    ? annotation.imageUrl
                                    : URL.createObjectURL(annotation.imageUrl)
                                }
                                alt="Product Thumbnail"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Image className="w-6 h-6 text-gray-400" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {annotation.productName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {annotation.productUrl}
                            </p>
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatTime(annotation.startTime)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button
                    onClick={() => {
                      setIsEditing(true);
                      setEditingAnnotation(null);
                      setProductForm({
                        ...productForm,
                        startTime: Math.floor(currentTime),
                        endTime: Math.floor(currentTime) + 5,
                      });
                    }}
                    variant="outline"
                    className="w-full text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add product
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Product Name
                    </label>
                    <Input
                      placeholder="Enter Product Name"
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="bg-gray-50 border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Product URL
                    </label>
                    <Input
                      placeholder="Enter Product URL"
                      value={productForm.url}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          url: e.target.value,
                        }))
                      }
                      className="bg-gray-50 border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Start Time
                      </label>
                      <div className="relative">
                        <Input
                          placeholder="Start Time"
                          value={formatTime(productForm.startTime)}
                          onChange={(e) => {
                            const [mins, secs] = e.target.value
                              .split(":")
                              .map(Number);
                            setProductForm((prev) => ({
                              ...prev,
                              startTime: (mins || 0) * 60 + (secs || 0),
                            }));
                          }}
                        />
                        <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        End Time
                      </label>
                      <div className="relative">
                        <Input
                          placeholder="Start Time"
                          value={formatTime(productForm.endTime)}
                          onChange={(e) => {
                            const [mins, secs] = e.target.value
                              .split(":")
                              .map(Number);
                            setProductForm((prev) => ({
                              ...prev,
                              endTime: (mins || 0) * 60 + (secs || 0),
                            }));
                          }}
                        />
                        <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Product Image
                    </label>

                    <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 mb-3 overflow-hidden relative group">
                      {productForm.image ? (
                        <img
                          src={URL.createObjectURL(productForm.image)}
                          alt="CTA Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Upload image</p>
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setProductForm((prev) => ({
                              ...prev,
                              image: file,
                            }));
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Font Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded border overflow-hidden">
                          <input
                            type="color"
                            value={productForm.fontColor}
                            onChange={(e) =>
                              setProductForm((prev) => ({
                                ...prev,
                                fontColor: e.target.value,
                              }))
                            }
                            className="w-full h-full cursor-pointer border-none p-0 appearance-none"
                          />
                        </div>
                        <Input
                          value={productForm.fontColor}
                          onChange={(e) =>
                            setProductForm((prev) => ({
                              ...prev,
                              fontColor: e.target.value,
                            }))
                          }
                          className="h-10 bg-gray-50 border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Background Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded border overflow-hidden">
                          <input
                            type="color"
                            value={productForm.backgroundColor}
                            onChange={(e) =>
                              setProductForm((prev) => ({
                                ...prev,
                                backgroundColor: e.target.value,
                              }))
                            }
                            className="w-full h-full cursor-pointer border-none p-0 appearance-none"
                          />
                        </div>
                        <Input
                          value={productForm.backgroundColor}
                          onChange={(e) =>
                            setProductForm((prev) => ({
                              ...prev,
                              backgroundColor: e.target.value,
                            }))
                          }
                          className="h-10 bg-gray-50 border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Position
                    </label>
                    <Select
                      value={productForm.position}
                      onValueChange={(value) =>
                        setProductForm((prev) => ({ ...prev, position: value }))
                      }
                    >
                      <SelectTrigger className="bg-gray-50 border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer">
                        <SelectValue placeholder="Select position..." />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 rounded-md shadow-md cursor-pointer">
                        <SelectItem
                          value="top-left"
                          className="hover:bg-purple-50 px-3 py-2 rounded-md transition-colors"
                        >
                          Top Left
                        </SelectItem>
                        <SelectItem
                          value="top-right"
                          className="hover:bg-purple-50 px-3 py-2 rounded-md transition-colors"
                        >
                          Top Right
                        </SelectItem>
                        <SelectItem
                          value="bottom-left"
                          className="hover:bg-purple-50 px-3 py-2 rounded-md transition-colors"
                        >
                          Bottom Left
                        </SelectItem>
                        <SelectItem
                          value="bottom-right"
                          className="hover:bg-purple-50 px-3 py-2 rounded-md transition-colors"
                        >
                          Bottom Right
                        </SelectItem>
                        <SelectItem
                          value="center"
                          className="hover:bg-purple-50 px-3 py-2 rounded-md transition-colors"
                        >
                          Center
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setEditingAnnotation(null);
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleProductSubmit}
                      className="flex-1 bg-purple-gradient text-white"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Feedback Form Section */}
      <Card className="bg-white shadow-sm">
        <Collapsible open={feedbackOpen} onOpenChange={setFeedbackOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                Feedback Form
                {feedbackOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Write your question below
                </label>
                <Textarea
                  placeholder="Click here to write"
                  value={surveyForm.question}
                  onChange={(e) =>
                    setSurveyForm((prev) => ({
                      ...prev,
                      question: e.target.value,
                    }))
                  }
                  className="min-h-[80px] bg-gray-50 border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Select your option type
                </label>
                <Select
                  value={surveyForm.type}
                  onValueChange={(value) =>
                    setSurveyForm((prev) => ({
                      ...prev,
                      type: value,
                      options: [],
                      newOption: "",
                      correctAnswers: [],
                    }))
                  }
                >
                  <SelectTrigger className="bg-gray-50 border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <SelectValue placeholder="Choose option type..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-md shadow-md">
                    <SelectItem
                      value="single-choice"
                      className="hover:bg-purple-50 px-3 py-2 rounded-md transition-colors"
                    >
                      Single Choice
                    </SelectItem>
                    <SelectItem
                      value="multiple-choice"
                      className="hover:bg-purple-50 px-3 py-2 rounded-md transition-colors"
                    >
                      Multiple Choice
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {["single-choice", "multiple-choice"].includes(
                surveyForm.type
              ) && (
                <div className="mt-4 space-y-3">
                  {/* Input + Add Button (always shown) */}
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Enter option"
                      value={surveyForm.newOption || ""}
                      onChange={(e) =>
                        setSurveyForm((prev) => ({
                          ...prev,
                          newOption: e.target.value,
                        }))
                      }
                      className="bg-gray-50 border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        const trimmed = (surveyForm.newOption || "").trim();
                        if (!trimmed) return;

                        // Prevent duplicates
                        if (surveyForm.options.includes(trimmed)) return;

                        setSurveyForm((prev) => ({
                          ...prev,
                          options: [...prev.options, trimmed],
                          newOption: "",
                        }));
                      }}
                      className="bg-purple-gradient text-white"
                    >
                      Add
                    </Button>
                  </div>

                  {/* Show existing options if any */}
                  <div className="space-y-2">
                    {surveyForm.options.map((opt, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 bg-gray-50 border border-gray-300 rounded p-2"
                      >
                        {/* Single-choice => Radio | Multiple-choice => Checkbox */}
                        {surveyForm.type === "single-choice" ? (
                          <input
                            type="radio"
                            checked={surveyForm.correctAnswers[0] === opt}
                            onChange={() =>
                              setSurveyForm((prev) => ({
                                ...prev,
                                correctAnswers: [opt], // only one correct answer
                              }))
                            }
                          />
                        ) : (
                          <input
                            type="checkbox"
                            checked={surveyForm.correctAnswers?.includes(opt)}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              setSurveyForm((prev) => {
                                let updated = prev.correctAnswers || [];
                                if (isChecked) {
                                  updated = [...updated, opt];
                                } else {
                                  updated = updated.filter((o) => o !== opt);
                                }
                                return { ...prev, correctAnswers: updated };
                              });
                            }}
                          />
                        )}

                        {/* Editable option text */}
                        <Input
                          value={opt}
                          onChange={(e) => {
                            const updated = [...surveyForm.options];
                            updated[idx] = e.target.value;

                            // Also update correctAnswers if label changed
                            const wasCorrect =
                              surveyForm.correctAnswers?.includes(opt);
                            let updatedCorrect = [
                              ...(surveyForm.correctAnswers || []),
                            ];
                            if (wasCorrect) {
                              updatedCorrect = updatedCorrect.map((a) =>
                                a === opt ? e.target.value : a
                              );
                            }

                            setSurveyForm((prev) => ({
                              ...prev,
                              options: updated,
                              correctAnswers: updatedCorrect,
                            }));
                          }}
                          placeholder={`Option ${idx + 1}`}
                          className="flex-1 bg-transparent border-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Time
                </label>
                <div className="relative">
                  <Input
                    placeholder="Select Time"
                    value={formatTime(surveyForm.startTime)}
                    onChange={(e) => {
                      const [mins, secs] = e.target.value
                        .split(":")
                        .map(Number);
                      const newStart = (mins || 0) * 60 + (secs || 0);

                      setSurveyForm((prev) => ({
                        ...prev,
                        startTime: newStart,
                        endTime: newStart + 1, // Always 1 second later
                      }));
                    }}
                    className="bg-gray-50 border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />

                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <Button
                onClick={handleSurveySubmit}
                className="w-full bg-purple-gradient text-white"
                disabled={!surveyForm.question}
              >
                Add Survey
              </Button>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
}