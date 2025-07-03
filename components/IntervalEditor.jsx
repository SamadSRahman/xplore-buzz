"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Play,
  Edit,
  Trash2,
  Clock,
  Save,
  X as Close,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import EditProductPopup from "./popups/EditCTAPopup";
import EditSurveyPopup from "./popups/EditSurveyPopup";

export default function IntervalEditor({
  annotations,
  currentTime,
  videoDuration,
  onAddAnnotation,
  onUpdateAnnotation,
  onDeleteAnnotation,
}) {
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editingType, setEditingType] = useState(null);

  useEffect(() => {
    if (selectedAnnotation) {
      setEditing(false);
      setEditingType(null);
    }
  }, [selectedAnnotation]);

  // const formatTime = (seconds) => {
  //   console.log("format tim triggered with value", seconds);

  //   const mins = Math.floor(seconds / 60);
  //   const secs = Math.floor(seconds % 60);
  //   return `${mins.toString().padStart(2, "0")}:
  //     ${secs.toString().padStart(2, "0")}`;
  // };
  const formatTime = (seconds) => {
    console.log("format tim triggered with value", seconds);

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };
  const getProgressPercentage = (time) =>
    videoDuration ? (time / videoDuration) * 100 : 0;
  const getAnnotationWidth = ({ startTime, endTime }) =>
    ((endTime - startTime) / videoDuration) * 100;
  const typeColor = { product: "bg-blue-500", survey: "bg-purple-500" };
  

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (annotation, e) => {
    e.stopPropagation();
    setSelectedAnnotation(annotation);
    setEditingType(annotation.type);
    setEditing(true);
  };

  const handleCloseEdit = () => {
    setEditing(false);
    setEditingType(null);
  };

  const handleUpdateAnnotation = (updatedAnnotation) => {
    onUpdateAnnotation(updatedAnnotation);
    setSelectedAnnotation(updatedAnnotation);
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
        {/* Timeline Bar */}
        <div className="relative">
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            {/* Progress */}
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
              style={{ width: `${getProgressPercentage(currentTime)}%` }}
            />
            {/* Annotation blocks */}
            {annotations.map((a) => {
              console.log("annotation list", a);
              return (
                <motion.div
                  key={a.id}
                  whileHover={{ scaleX: 1.1 }}
                  className={`absolute top-0 h-full opacity-70 hover:opacity-90 cursor-pointer ${
                    typeColor[a.type]
                  }`}
                  style={{
                    left: `${getProgressPercentage(a.startTime)}%`,
                    width: `${getAnnotationWidth(a)}%`,
                  }}
                  onClick={() => setSelectedAnnotation(a)}
                  title={`${
                    a.type === "product" ? a.productName : a.question
                  }\n (${formatTime(a.startTime)} - ${formatTime(a.endTime)})`}
                />
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">
            Annotations ({annotations.length})
          </h3>
          <Button
            size="sm"
            variant="outline"
            className="text-purple-600 border-purple-200"
            onClick={() => onAddAnnotation(currentTime)}
          >
            <Plus className="w-4 h-4 mr-1" /> Add New
          </Button>
        </div>

        {/* List & Editor */}
        <div className="grid md:grid-cols-1 gap-6">
          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
            {annotations.map((a) => (
              <motion.div
                key={a.id}
                whileHover={{ x: 0 }}
                className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                  selectedAnnotation?.id === a.id
                    ? "border-purple-300 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedAnnotation(a)}
              >
                <div className="flex justify-between items-start">
                  <Badge
                    className={`${typeColor[a.type]} text-white px-2 py-1`}
                  >
                    {a.type === "product" ? "Product" : "Survey"}
                  </Badge>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => handleEdit(a, e)}
                      className="p-1"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteAnnotation(a.id, a.type); // Pass both the id and type
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-sm truncate">
                  {a.type === "product" ? a.productName : a.question}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {/* {a.type === "product"
                    ? formatTime(a.startTime) - formatTime(a.endTime)
                    : formatTime(a.selectTime) - formatTime(a.selectTime + 1)} */}

                  {a.type === "product"
                    ? formatTime(a.startTime) + " - " + formatTime(a.endTime)
                    : formatTime(a.selectTime) +
                      " - " +
                      formatTime(a.selectTime + 1)}
                </p>
              </motion.div>
            ))}
          </div>
          {/* {selectedAnnotation && !editing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gray-50 rounded-lg border"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-900">Details</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => handleEdit(selectedAnnotation, e)}
                  className="text-purple-600 border-purple-200"
                >
                  <Edit className="w-4 h-4 mr-1" /> Edit
                </Button>
              </div>
              
              <div className="space-y-2">
                {selectedAnnotation.type === "product" ? (
                  <>
                    <p><strong>Product:</strong> {selectedAnnotation.productName}</p>
                    {selectedAnnotation.productUrl && (
                      <p><strong>URL:</strong> {selectedAnnotation.productUrl}</p>
                    )}
                  </>
                ) : (
                  <>
                    <p><strong>Question:</strong> {selectedAnnotation.question}</p>
                    <p><strong>Type:</strong> {selectedAnnotation.type?.replace('-', ' ')}</p>
                    {selectedAnnotation.options && selectedAnnotation.options.length > 0 && (
                      <div>
                        <strong>Options:</strong>
                        <ul className="list-disc list-inside ml-2">
                          {selectedAnnotation.options.map((opt, idx) => (
                            <li key={idx} className="text-sm">{opt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
                <p className="text-sm text-gray-500">
                  {formatTime(selectedAnnotation.startTime)} - {formatTime(selectedAnnotation.endTime)}
                </p>
              </div>
            </motion.div>
          )} */}
        </div>
      </CardContent>
      {editing && editingType === "product" && (
        <EditProductPopup
          open={true}
          selectedAnnotation={selectedAnnotation}
          onClose={handleCloseEdit}
          onUpdate={handleUpdateAnnotation}
        />
      )}

      {editing && editingType === "survey" && (
        <EditSurveyPopup
          open={true}
          selectedAnnotation={selectedAnnotation}
          onClose={handleCloseEdit}
          onUpdate={handleUpdateAnnotation}
        />
      )}
    </Card>
  );
}
