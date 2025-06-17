'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { uploadVideo } from '@/lib/api/video';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const videoFiles = droppedFiles.filter(file => 
      file.type.includes('video') || file.name.endsWith('.m3u8')
    );
    
    if (videoFiles.length > 0) {
      addFiles(videoFiles);
    } else {
      toast.error('Please upload video files or HLS manifests (.m3u8)');
    }
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    const fileObjects = newFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'pending', // pending, uploading, completed, error
    }));
    setFiles(prev => [...prev, ...fileObjects]);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    setUploading(true);

    for (const fileObj of files) {
      if (fileObj.status === 'completed') continue;

      try {
        // Update file status to uploading
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: 'uploading', progress: 0 } : f
        ));

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setFiles(prev => prev.map(f => {
            if (f.id === fileObj.id && f.progress < 90) {
              return { ...f, progress: f.progress + 10 };
            }
            return f;
          }));
        }, 200);

        // Upload the file
        const result = await uploadVideo(fileObj.file, (progress) => {
          setFiles(prev => prev.map(f => 
            f.id === fileObj.id ? { ...f, progress } : f
          ));
        });

        clearInterval(progressInterval);

        // Mark as completed
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { 
            ...f, 
            status: 'completed', 
            progress: 100,
            videoId: result.id 
          } : f
        ));

        toast.success(`${fileObj.name} uploaded successfully!`);
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: 'error', progress: 0 } : f
        ));
        toast.error(`Failed to upload ${fileObj.name}: ${error.message}`);
      }
    }

    setUploading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'uploading':
        return <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return <File className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const completedFiles = files.filter(f => f.status === 'completed');

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-buzz-gradient bg-clip-text text-transparent">
            Upload Your Videos
          </h1>
          <p className="text-gray-600 text-lg">
            Upload HLS video files to create interactive annotations and surveys
          </p>
        </div>

        {/* Upload Area */}
        <Card className="border-2 border-dashed transition-colors duration-300 hover:border-purple-300">
          <CardContent className="p-8">
            <div
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Drop your files here</h3>
              <p className="text-gray-500 mb-6">
                Supports HLS (.m3u8), MP4, WebM, and other video formats
              </p>
              <input
                type="file"
                multiple
                accept="video/*,.m3u8"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="pointer-events-none">
                Choose Files
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* File List */}
        {files.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Files to Upload</CardTitle>
              <CardDescription>
                {files.length} file(s) ready for upload
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {files.map((fileObj) => (
                <motion.div
                  key={fileObj.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                >
                  {getStatusIcon(fileObj.status)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{fileObj.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(fileObj.size)}</p>
                    {fileObj.status === 'uploading' && (
                      <Progress value={fileObj.progress} className="mt-2 h-2" />
                    )}
                  </div>
                  {fileObj.status === 'completed' && (
                    <Button
                      size="sm"
                      onClick={() => router.push(`/video/${fileObj.videoId}`)}
                      className="bg-purple-gradient text-white"
                    >
                      View
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(fileObj.id)}
                    disabled={fileObj.status === 'uploading'}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Upload Button */}
        {files.length > 0 && (
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={uploadFiles}
              disabled={uploading || files.every(f => f.status === 'completed')}
              className="bg-purple-gradient text-white px-8 py-3 rounded-xl font-semibold"
            >
              {uploading ? 'Uploading...' : 'Start Upload'}
            </Button>
          </div>
        )}

        {/* Success Message */}
        {completedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-6 bg-green-50 rounded-2xl border border-green-200"
          >
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Upload Complete!
            </h3>
            <p className="text-green-600 mb-4">
              {completedFiles.length} file(s) uploaded successfully. 
              You can now add annotations and surveys.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {completedFiles.map((file) => (
                <Button
                  key={file.id}
                  size="sm"
                  onClick={() => router.push(`/video/${file.videoId}`)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Edit {file.name}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}