"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, X, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

export default function SurveyPopup({ annotation, onClose }) {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    console.log("annotation", annotation);
  }, []);

  const handleSubmit = () => {
    if (annotation.optionType === "multiple-choice") {
      if (selectedAnswers.length === 0) {
        toast.error("Please select at least one answer");
        return;
      }
    } else {
      if (!selectedAnswer) {
        toast.error("Please select an answer");
        return;
      }
    }

    setSubmitted(true);
    toast.success("Thank you for your feedback!");

    setTimeout(() => {
      onClose?.(true);
    }, 2000);
  };

  const handleCheckboxChange = (value, checked) => {
    if (checked) {
      setSelectedAnswers((prev) => [...prev, value]);
    } else {
      setSelectedAnswers((prev) => prev.filter((answer) => answer !== value));
    }
  };

  const handleSkip = () => {
    toast.info("Survey skipped");
    onClose?.(false);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="absolute inset-0 z-50 flex items-center justify-center px-4 bg-white/95"
      >
        <div className="w-full max-w-md">
          <Card className="bg-white shadow-xl border-0">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-600 text-sm">
                Your response has been recorded.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm"
    >
      <Card className="w-full h-full bg-white/98 backdrop-blur-sm shadow-2xl border-0 flex flex-col justify-center items-center px-4">
        <CardHeader className="pb-4 w-full max-w-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <CardTitle className="text-lg font-semibold text-gray-800">
                Quick Survey
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 w-full max-w-xl">
          <p className="text-gray-900 font-medium text-lg leading-relaxed">
            {annotation.question}
          </p>

          {annotation.optionType === "multiple-choice" ? (
            <div className="space-y-3">
              {annotation.options?.map((option) => {
                const checked = selectedAnswers.includes(option);
                return (
                  <div
                    key={option}
                    className={`flex items-center px-4 py-3 border-2 rounded-xl transition-all cursor-pointer ${
                      checked
                        ? "bg-purple-50 border-purple-400"
                        : "bg-white border-gray-200 hover:bg-gray-50 hover:border-purple-200"
                    }`}
                    onClick={() => handleCheckboxChange(option, !checked)}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(option, checked)
                      }
                      className="mr-3"
                    />
                    <Label className="text-gray-800 font-medium cursor-pointer text-base">
                      {option}
                    </Label>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              <RadioGroup
                value={selectedAnswer}
                onValueChange={setSelectedAnswer}
                className="space-y-3"
              >
                {annotation.options?.map((option) => {
                  const selected = selectedAnswer === option;
                  return (
                    <div
                      key={option}
                      onClick={() => setSelectedAnswer(option)}
                      className={`flex items-center px-4 py-3 border-2 rounded-xl transition-all cursor-pointer ${
                        selected
                          ? "bg-purple-50 border-purple-400"
                          : "bg-white border-gray-200 hover:bg-gray-50 hover:border-purple-200"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                          style={{
                            borderColor: selected ? "#a855f7" : "#cbd5e1",
                          }}
                        >
                          {selected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                          )}
                        </div>
                        <Label className="text-gray-800 font-medium cursor-pointer text-base">
                          {option}
                        </Label>
                      </div>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
          )}

          <div className="space-y-3 pt-4">
            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              disabled={
                annotation.optionType === "multiple-choice"
                  ? selectedAnswers.length === 0
                  : !selectedAnswer
              }
            >
              Submit Response
            </Button>
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="w-full text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 py-3 rounded-lg transition-all duration-200"
            >
              Skip Survey
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}