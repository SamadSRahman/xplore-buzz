import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Plus, Edit, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";

function EditSurveyPopup({ open, selectedAnnotation, onClose, onUpdate }) {
  const [form, setForm] = useState({});
  const [newOption, setNewOption] = useState("");

  useEffect(() => {
    console.log("Selected Annotation:", selectedAnnotation);
    if (selectedAnnotation) {
      setForm({
        question: selectedAnnotation.question || "",
        type: selectedAnnotation.optionType || "single-choice", // Changed from 'type' to 'optionType'
        options: selectedAnnotation.options || [],
        startTime: selectedAnnotation.startTime,
        endTime: selectedAnnotation.endTime,
        correctAnswers: selectedAnnotation.correctAnswers || [],
      });
      setNewOption("");
    }
  }, [selectedAnnotation]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const addOption = () => {
    const trimmed = newOption.trim();
    if (!trimmed || form.options.includes(trimmed)) return;

    setForm((prev) => {
      const updatedOptions = [...prev.options, trimmed];
      // Remove invalid correct answers that are not in the new options
      const updatedCorrectAnswers = prev.correctAnswers.filter((answer) =>
        updatedOptions.includes(answer)
      );

      return {
        ...prev,
        options: updatedOptions,
        correctAnswers: updatedCorrectAnswers,
      };
    });
    setNewOption("");
  };

  const removeOption = (index) => {
    const updated = form.options.filter((_, i) => i !== index);
    // Remove correct answers that are no longer in the options
    setForm((prev) => {
      const updatedCorrectAnswers = prev.correctAnswers.filter((answer) =>
        updated.includes(answer)
      );

      return {
        ...prev,
        options: updated,
        correctAnswers: updatedCorrectAnswers,
      };
    });
  };

  const updateOption = (index, value) => {
    const updated = [...form.options];
    updated[index] = value;
    setForm((prev) => ({ ...prev, options: updated }));
  };

  const handleSubmit = () => {
    // Ensure type is valid
    if (!["single-choice", "multiple-choice"].includes(form.type)) {
      toast.error("Unknown annotation type.");
      return;
    }

    // Ensure correctAnswers is an array if it is undefined
    const correctAnswers = form.correctAnswers || [];

    // Ensure all correct answers are part of the options array
    const isValid = correctAnswers.every((answer) =>
      form.options.includes(answer)
    );

    if (!isValid) {
      toast.error("Correct answers must be one of the provided options.");
      return;
    }

    const updatedAnnotation = {
      ...selectedAnnotation,
      question: form.question,
      optionType: form.type, // Map back to 'optionType'
      options: form.options,
      correctAnswers: form.correctAnswers,
      startTime: form.startTime,
      selectTime: form.startTime,
      endTime: form.endTime,
    };
    onUpdate(updatedAnnotation);
    onClose();
  };

  if (!selectedAnnotation) return null;

  return (
    <Dialog className="h-max-screen" open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 z-50">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            Edit Survey Question
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              placeholder="Enter your question"
              value={form.question}
              onChange={(e) => handleChange("question", e.target.value)}
              className="min-h-[60px] bg-gray-50 border border-gray-300"
            />
          </div>

          <div>
            <Label htmlFor="type">Option Type</Label>
            <Select
              value={form.type}
              onValueChange={(value) => handleChange("type", value)}
            >
              <SelectTrigger className="bg-gray-50 border border-gray-300">
                <SelectValue placeholder="Choose option type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-choice">Single Choice</SelectItem>
                <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {["single-choice", "multiple-choice"].includes(form.type) && (
            <div className="space-y-2">
              <Label>Options</Label>

              {/* Add new option */}
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Enter option"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  className="bg-gray-50 border border-gray-300"
                />
                <Button
                
                  type="button"
                  onClick={addOption}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Add
                </Button>
              </div>

              {/* Existing options */}
              <div className="space-y-2">
                {form.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <Input
                      value={opt}
                      onChange={(e) => updateOption(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      className="bg-gray-50 border border-gray-300"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Correct Answers */}
              <div className="space-y-2">
                <Label>Correct Answers</Label>
                {form.type === "single-choice" ? (
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {form.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={form.correctAnswers[0] === opt}
                          onChange={() => {
                            setForm((prev) => ({
                              ...prev,
                              correctAnswers: [opt], // Only one correct answer for single-choice
                            }));
                          }}
                        />
                        <span className="text-sm">{opt}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {form.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={form.correctAnswers.includes(opt)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setForm((prev) => {
                              let updated = [...prev.correctAnswers];
                              if (isChecked) {
                                updated.push(opt);
                              } else {
                                updated = updated.filter(
                                  (answer) => answer !== opt
                                );
                              }
                              return { ...prev, correctAnswers: updated };
                            });
                          }}
                        />
                        <span className="text-sm">{opt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <div className="relative">
              <Input
                id="startTime"
                placeholder="MM:SS"
                value={formatTime(form.startTime)}
                onChange={(e) => {
                  const [mins, secs] = e.target.value.split(":").map(Number);
                  const newStart = (mins || 0) * 60 + (secs || 0);
                  setForm((prev) => ({
                    ...prev,
                    startTime: newStart,
                    endTime: newStart + 1,
                  }));
                }}
                className="bg-gray-50 border border-gray-300"
              />
              <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4">
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={!form.question}
            >
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditSurveyPopup;