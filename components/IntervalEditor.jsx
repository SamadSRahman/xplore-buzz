"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Play, Edit, Trash2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function IntervalEditor({
  annotations,
  currentTime,
  videoDuration,
  onAddAnnotation,
  onUpdateAnnotation,
  onDeleteAnnotation,
}) {
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getProgressPercentage = (time) => {
    return videoDuration ? (time / videoDuration) * 100 : 0;
  };

  const getAnnotationWidth = (annotation) => {
    const duration = annotation.endTime - annotation.startTime;
    return (duration / videoDuration) * 100;
  };

  const getAnnotationColor = (type) => {
    switch (type) {
      case "product":
        return "bg-blue-500";
      case "survey":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };
  

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Timeline & Annotations</span>
          </span>
          <div className="text-sm text-gray-500">
            {formatTime(currentTime)} / {formatTime(videoDuration)}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timeline */}
        <div className="relative">
          {/* Timeline Bar */}
          <div className="w-full h-3 bg-gray-200 rounded-full relative overflow-hidden">
            {/* Progress Bar */}
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-200"
              style={{ width: `${getProgressPercentage(currentTime)}%` }}
            />

            {/* Current Time Indicator */}
            <div
              className="absolute top-0 w-1 h-full bg-red-500 transition-all duration-200"
              style={{ left: `${getProgressPercentage(currentTime)}%` }}
            />

            {/* Annotation Blocks */}
            {annotations.map((annotation) => (
              <motion.div
                key={annotation.id}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                className={`absolute top-0 h-full ${getAnnotationColor(
                  annotation.type
                )} opacity-70 hover:opacity-90 cursor-pointer transition-opacity`}
                style={{
                  left: `${getProgressPercentage(annotation.startTime)}%`,
                  width: `${getAnnotationWidth(annotation)}%`,
                  minWidth: "2px",
                }}
                onClick={() => setSelectedAnnotation(annotation)}
                title={`${
                  annotation.type === "product"
                    ? annotation.name
                    : annotation.question
                } (${formatTime(annotation.startTime)} - ${formatTime(
                  annotation.endTime
                )})`}
              />
            ))}
          </div>

          {/* Time Markers */}
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0:00</span>
            <span>{formatTime(videoDuration / 2)}</span>
            <span>{formatTime(videoDuration)}</span>
          </div>
        </div>

        {/* Annotations List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              Annotations ({annotations.length})
            </h3>
            <Button
              size="sm"
              variant="outline"
              className="text-purple-600 border-purple-200"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add New
            </Button>
          </div>

          {annotations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>No annotations yet</p>
              <p className="text-sm">
                Add product showcases or surveys to engage your viewers
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {annotations.map((annotation) => (
                <motion.div
                  key={annotation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                    selectedAnnotation?.id === annotation.id
                      ? "border-purple-300 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedAnnotation(annotation)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge
                        variant="secondary"
                        className={`${getAnnotationColor(
                          annotation.type
                        )} text-white px-2 py-1`}
                      >
                        {annotation.type === "product" ? "Product" : "Survey"}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm">
                          {annotation.type === "product"
                            ? annotation.name
                            : annotation.question}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTime(annotation.startTime)} -{" "}
                          {formatTime(annotation.endTime)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button size="sm" variant="ghost" className="p-1 h-auto">
                        <Play className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="p-1 h-auto">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="p-1 h-auto text-red-500 hover:text-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteAnnotation(annotation.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Annotation Details */}
        {selectedAnnotation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gray-50 rounded-lg border"
          >
            <h4 className="font-semibold text-gray-900 mb-2">
              {selectedAnnotation.type === "product"
                ? "Product Details"
                : "Survey Details"}
            </h4>
            <div className="space-y-2 text-sm">
              {selectedAnnotation.type === "product" ? (
                <>
                  {selectedAnnotation.image && (
                    <div className="w-full">
                      <img
                        src={URL.createObjectURL(selectedAnnotation.image)}
                        alt="Product Thumbnail"
                        className="w-full max-w-xs rounded border object-cover mb-2"
                      />
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Name:</span>{" "}
                    {selectedAnnotation.name}
                  </div>
                  <div>
                    <span className="font-medium">URL:</span>{" "}
                    {selectedAnnotation.url}
                  </div>
                  <div>
                    <span className="font-medium">Position:</span>{" "}
                    {selectedAnnotation.position}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="font-medium">Question:</span>{" "}
                    {selectedAnnotation.question}
                  </div>
                  <div>
                    <span className="font-medium">Type:</span>{" "}
                    {selectedAnnotation.type}
                  </div>
                  <div>
                    <span className="font-medium">Options:</span>{" "}
                    {selectedAnnotation.options?.join(", ")}
                  </div>
                </>
              )}
              <div>
                <span className="font-medium">Duration:</span>{" "}
                {formatTime(selectedAnnotation.startTime)} -{" "}
                {formatTime(selectedAnnotation.endTime)}
              </div>
            </div>
            <div className="flex space-x-2 mt-3">
              <Button size="sm" variant="outline">
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => {
                  onDeleteAnnotation(selectedAnnotation.id);
                  setSelectedAnnotation(null);
                }}
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
