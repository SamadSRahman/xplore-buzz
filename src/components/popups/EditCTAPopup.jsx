import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


// Edit Product Annotation Popup
export default function EditProductPopup({
  open,
  selectedAnnotation,
  onClose,
  onUpdate,
}) {
  const [form, setForm] = useState({});
  const [dirty, setDirty] = useState({});
    const inputRef = useRef(null);
  useEffect(() => {
    console.log("selected annotation:", selectedAnnotation);

    if (selectedAnnotation) {
      setForm({
        productName: selectedAnnotation.productName || "",
        productUrl: selectedAnnotation.productUrl || "",
        imageUrl: selectedAnnotation.imageUrl || null,
        startTime: selectedAnnotation.startTime,
        endTime: selectedAnnotation.endTime,
        position: selectedAnnotation.position,
      });
      setDirty({});
    }
  }, [selectedAnnotation]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setDirty((prev) => ({ ...prev, [field]: true }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    handleChange("imageUrl", file);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSubmit = () => {
    const updatedAnnotation = {
      ...selectedAnnotation,
      ...form,
    };
    onUpdate(updatedAnnotation);
    onClose();
  };

  if (!selectedAnnotation) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent  className="max-w-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 z-50">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            Edit Product Annotation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <Label
              htmlFor="productName"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Product Name
            </Label>
            <Input
              id="productName"
              value={form.productName}
              onChange={(e) => handleChange("productName", e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter product name"
            />
          </div>

          {/* Product URL */}
          <div className="space-y-2">
            <Label
              htmlFor="productUrl"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Product URL
            </Label>
            <Input
              id="productUrl"
              value={form.productUrl}
              onChange={(e) => handleChange("productUrl", e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="https://example.com/product"
            />
          </div>

          {/* Image Section */}
          <div className="space-y-3">
            <Label
              htmlFor="image"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Product Image
            </Label>

            {/* Image Preview */}
            {form.imageUrl && (
              <div className="relative group">
                <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <Image
                  width={200}
                  height={200}
                  onClick={()=>inputRef.current.click()}
                    src={typeof form.imageUrl === "string" ? form.imageUrl : URL.createObjectURL(form.imageUrl)}
                    alt="Product preview"
                    className="w-full h-32 object-contain transition-transform duration-200 group-hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  {/* Fallback for broken images */}
                  <div className="hidden w-full h-32 items-center justify-center bg-gray-100 dark:bg-gray-800">
                    <div className="text-center">
                      <svg
                        className="mx-auto h-8 w-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="mt-1 text-xs text-gray-500">
                        Image not found
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* File Input */}
            <div className="relative">
              <Input
                id="image"
                type="file"
                accept="image/*"
               ref={inputRef}
                onChange={handleFileChange}
                className="hidden w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 dark:file:bg-purple-900/20 dark:file:text-purple-400"
              />
            </div>
          </div>

          {/* Time Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="startTime"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Start Time
              </Label>
              <div className="relative">
                <Input
                  id="startTime"
                  value={formatTime(form.startTime)}
                  onChange={(e) => {
                    const [mins, secs] = e.target.value.split(":").map(Number);
                    const newTime = (mins || 0) * 60 + (secs || 0);
                    handleChange("startTime", newTime);
                  }}
                  placeholder="00:00"
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 font-mono text-center"
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="endTime"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                End Time
              </Label>
              <div className="relative">
                <Input
                  id="endTime"
                  value={formatTime(form.endTime)}
                  onChange={(e) => {
                    const [mins, secs] = e.target.value.split(":").map(Number);
                    const newTime = (mins || 0) * 60 + (secs || 0);
                    handleChange("endTime", newTime);
                  }}
                  placeholder="00:00"
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 font-mono text-center"
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
              <div className="space-y-2 col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Position
                    </label>
                    <Select
                      value={form.position}
                      onValueChange={(value) =>
                        handleChange("position", value)
                      }
                    >
                      <SelectTrigger className="bg-gray-50 border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer">
                        <SelectValue placeholder="Select position..." />
                      </SelectTrigger>
                    <SelectContent 
            className="bg-white border border-gray-200 rounded-md shadow-md cursor-pointer z-[99999]"
            container={document.body}
          >
                      <SelectItem value="top-left" className="hover:bg-purple-50 px-3 py-2 rounded-md transition-colors">
              Top Left
            </SelectItem>
            <SelectItem value="top-right" className="hover:bg-purple-50 px-3 py-2 rounded-md transition-colors">
              Top Right
            </SelectItem>
            <SelectItem value="bottom-left" className="hover:bg-purple-50 px-3 py-2 rounded-md transition-colors">
              Bottom Left
            </SelectItem>
            <SelectItem value="bottom-right" className="hover:bg-purple-50 px-3 py-2 rounded-md transition-colors">
              Bottom Right
            </SelectItem>
            <SelectItem value="center" className="hover:bg-purple-50 px-3 py-2 rounded-md transition-colors">
              Center
            </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
          </div>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="mt-2 w-full sm:w-auto px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
