'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  Upload, 
  Plus, 
  Image, 
  MessageSquare,
  Clock,
  Palette,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function VideoSidebar({ 
  video, 
  annotations, 
  currentTime, 
  onAddAnnotation, 
  onUpdateAnnotation, 
  onDeleteAnnotation 
}) {
  const [thumbnailOpen, setThumbnailOpen] = useState(true);
  const [productOpen, setProductOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAnnotation, setEditingAnnotation] = useState(null);

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    url: '',
    startTime: Math.floor(currentTime),
    endTime: Math.floor(currentTime) + 5,
    image: null,
    fontColor: '#FFFFFF',
    backgroundColor: '#240CEF',
    position: 'bottom-right'
  });

  const [surveyForm, setSurveyForm] = useState({
    question: '',
    type: 'yes-no',
    options: ['Yes', 'No'],
    startTime: Math.floor(currentTime),
    endTime: Math.floor(currentTime) + 10
  });

  const handleProductSubmit = () => {
    if (!productForm.name || !productForm.url) return;

    const annotation = {
      type: 'product',
      ...productForm,
      id: editingAnnotation?.id
    };

    if (editingAnnotation) {
      onUpdateAnnotation(editingAnnotation.id, annotation);
      setEditingAnnotation(null);
    } else {
      onAddAnnotation(annotation);
    }

    setProductForm({
      name: '',
      url: '',
      startTime: Math.floor(currentTime),
      endTime: Math.floor(currentTime) + 5,
      image: null,
      fontColor: '#FFFFFF',
      backgroundColor: '#240CEF',
      position: 'bottom-right'
    });
    setIsEditing(false);
  };

  const handleSurveySubmit = () => {
    if (!surveyForm.question) return;

    const annotation = {
      type: 'survey',
      ...surveyForm,
      id: editingAnnotation?.id
    };

    if (editingAnnotation) {
      onUpdateAnnotation(editingAnnotation.id, annotation);
      setEditingAnnotation(null);
    } else {
      onAddAnnotation(annotation);
    }

    setSurveyForm({
      question: '',
      type: 'yes-no',
      options: ['Yes', 'No'],
      startTime: Math.floor(currentTime),
      endTime: Math.floor(currentTime) + 10
    });
    setIsEditing(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const productAnnotations = annotations.filter(a => a.type === 'product');

  return (
    <div className="space-y-4 h-fit">
      {/* Thumbnail Section */}
      <Card className="bg-white shadow-sm">
        <Collapsible open={thumbnailOpen} onOpenChange={setThumbnailOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                Thumbnail
                {thumbnailOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <Image className="w-12 h-12 text-gray-400" />
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1 text-sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload from device
                  </Button>
                  <Button variant="outline" className="flex-1 text-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Select from video
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
                {isEditing && editingAnnotation?.type === 'product' ? 'Call to Action' : 'Product (Call to Action)'}
                {productOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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
                        <div key={annotation.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Image className="w-6 h-6 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{annotation.name}</p>
                            <p className="text-xs text-gray-500 truncate">{annotation.url}</p>
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
                        endTime: Math.floor(currentTime) + 5
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
                    <label className="block text-sm font-medium mb-2">Product Name</label>
                    <Input
                      placeholder="Enter Product Name"
                      value={productForm.name}
                      onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Product URL</label>
                    <Input
                      placeholder="Enter Product URL"
                      value={productForm.url}
                      onChange={(e) => setProductForm(prev => ({ ...prev, url: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Start Time</label>
                      <div className="relative">
                        <Input
                          placeholder="Start Time"
                          value={formatTime(productForm.startTime)}
                          onChange={(e) => {
                            const [mins, secs] = e.target.value.split(':').map(Number);
                            setProductForm(prev => ({ ...prev, startTime: (mins || 0) * 60 + (secs || 0) }));
                          }}
                        />
                        <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">End Time</label>
                      <div className="relative">
                        <Input
                          placeholder="Start Time"
                          value={formatTime(productForm.endTime)}
                          onChange={(e) => {
                            const [mins, secs] = e.target.value.split(':').map(Number);
                            setProductForm(prev => ({ ...prev, endTime: (mins || 0) * 60 + (secs || 0) }));
                          }}
                        />
                        <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Call to Action</label>
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 mb-3">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Upload image</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Font Color</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={productForm.fontColor}
                          onChange={(e) => setProductForm(prev => ({ ...prev, fontColor: e.target.value }))}
                          className="w-8 h-8 rounded border"
                        />
                        <Input
                          value={productForm.fontColor}
                          onChange={(e) => setProductForm(prev => ({ ...prev, fontColor: e.target.value }))}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Background color</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={productForm.backgroundColor}
                          onChange={(e) => setProductForm(prev => ({ ...prev, backgroundColor: e.target.value }))}
                          className="w-8 h-8 rounded border"
                        />
                        <Input
                          value={productForm.backgroundColor}
                          onChange={(e) => setProductForm(prev => ({ ...prev, backgroundColor: e.target.value }))}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Position</label>
                    <Select 
                      value={productForm.position} 
                      onValueChange={(value) => setProductForm(prev => ({ ...prev, position: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top-left">Top Left</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
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
                {feedbackOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Write your question below</label>
                <Textarea
                  placeholder="Click here to write"
                  value={surveyForm.question}
                  onChange={(e) => setSurveyForm(prev => ({ ...prev, question: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Select your option type</label>
                <Select 
                  value={surveyForm.type} 
                  onValueChange={(value) => setSurveyForm(prev => ({ 
                    ...prev, 
                    type: value,
                    options: value === 'yes-no' ? ['Yes', 'No'] : value === 'multiple-choice' ? ['Option 1', 'Option 2', 'Option 3'] : []
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes-no">Yes or No</SelectItem>
                    <SelectItem value="multiple-choice">Multiple choice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {surveyForm.type === 'yes-no' && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="radio" name="preview" className="text-purple-600" />
                    <span className="text-sm">Yes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" name="preview" className="text-purple-600" />
                    <span className="text-sm">No</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Select Time</label>
                <div className="relative">
                  <Input
                    placeholder="Select Time"
                    value={formatTime(surveyForm.startTime)}
                    onChange={(e) => {
                      const [mins, secs] = e.target.value.split(':').map(Number);
                      setSurveyForm(prev => ({ ...prev, startTime: (mins || 0) * 60 + (secs || 0) }));
                    }}
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