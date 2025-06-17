'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function SurveyPopup({ annotation, onClose }) {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (annotation.type === 'multiple-choice' && selectedAnswers.length === 0) {
      toast.error('Please select at least one answer');
      return;
    }
    
    if (annotation.type === 'yes-no' && !selectedAnswer) {
      toast.error('Please select an answer');
      return;
    }

    setSubmitted(true);
    toast.success('Thank you for your feedback!');
    
    // Auto-close after 2 seconds
    setTimeout(() => {
      onClose?.();
    }, 2000);
  };

  const handleCheckboxChange = (value, checked) => {
    if (checked) {
      setSelectedAnswers(prev => [...prev, value]);
    } else {
      setSelectedAnswers(prev => prev.filter(answer => answer !== value));
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
      >
        <Card className="bg-white shadow-xl border-0 max-w-sm">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Thank You!</h3>
            <p className="text-gray-600 text-sm">Your response has been recorded.</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 max-w-md w-full mx-4"
    >
      <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-base">Quick Survey</CardTitle>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <p className="text-gray-900 font-medium">{annotation.question}</p>
            
            {annotation.type === 'yes-no' && (
              <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">No</Label>
                </div>
              </RadioGroup>
            )}

            {annotation.type === 'multiple-choice' && (
              <div className="space-y-2">
                {annotation.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`option-${index}`}
                      checked={selectedAnswers.includes(option)}
                      onCheckedChange={(checked) => handleCheckboxChange(option, checked)}
                    />
                    <Label htmlFor={`option-${index}`}>{option}</Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full bg-purple-gradient text-white"
            disabled={
              (annotation.type === 'yes-no' && !selectedAnswer) ||
              (annotation.type === 'multiple-choice' && selectedAnswers.length === 0)
            }
          >
            Submit
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}