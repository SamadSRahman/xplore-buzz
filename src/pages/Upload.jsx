'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import useVideo from '../hooks/useVideo.js';

export default function UploadPage() {
  const [fileObj, setFileObj] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const { uploadVideo } = useVideo();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type.includes('video') || file.name.endsWith('.m3u8'))) {
      setFileObj({ file, name: file.name, size: file.size, progress: 0, status: 'pending' });
    } else {
      toast.error('Please upload a valid video or HLS manifest (.m3u8)');
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file && (file.type.includes('video') || file.name.endsWith('.m3u8'))) {
      setFileObj({ file, name: file.name, size: file.size, progress: 0, status: 'pending' });
    } else {
      toast.error('Unsupported file type');
    }
  };

  const removeFile = () => setFileObj(null);

  const uploadFile = async () => {
    if (!fileObj) return toast.error('Select a video to upload');
    if (!title.trim()) return toast.error('Title is required');
    setUploading(true);
    try {
      setFileObj(f => ({ ...f, status: 'uploading', progress: 0 }));
      const interval = setInterval(() => {
        setFileObj(f => f.progress < 95 ? { ...f, progress: f.progress + 5 } : f);
      }, 150);
      const result = await uploadVideo(fileObj.file, title, description);
      if(result.success){
              clearInterval(interval);
      setFileObj(f => ({ ...f, status: 'completed', progress: 100 }));
      console.log("result", result)
      toast.success(result.message);
      navigate("/videos")
      }
      else{
         toast.error(result.error);
         setFileObj(f => ({ ...f, status: 'error', progress: 0 }));
      }
    } catch (err) {
      console.log("line 67", err)
      toast.error(`Upload failed: ${err.message}`);
      setFileObj(f => ({ ...f, status: 'error', progress: 0 }));
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'uploading': return <div className="w-6 h-6 border-4 border-gradient-to-r from-purple-500 to-pink-500 border-t-transparent rounded-full animate-spin" />;
      case 'completed': return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error': return <AlertCircle className="w-6 h-6 text-red-500" />;
      default: return <Upload className="w-6 h-6 text-gray-400" />;
    }
  };

  const formatSize = bytes => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 mb-6">
          Upload Your Video
        </h1>

        <Card className="mb-6 shadow-lg ring-1 ring-gray-100">
          <CardHeader>
            <CardTitle className="text-lg">Video Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Enter title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="focus:ring-2 focus:ring-purple-300"
            />
            <Textarea
              placeholder="Enter description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="focus:ring-2 focus:ring-purple-300"
              rows={4}
            />
          </CardContent>
        </Card>

        <Card
          className={`${dragActive ? 'ring-2 ring-purple-300 bg-purple-50' : 'hover:ring-2 hover:ring-purple-200'} transition-all duration-300 shadow-md rounded-2xl mb-6`}
        >
          <CardContent className="relative py-16 text-center">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className="absolute inset-0 flex flex-col items-center justify-center px-4"
            >
              { !fileObj && (
                <>
                  <Upload className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-lg font-medium mb-2 text-gray-600">Drag & drop video here</p>
                  <p className="text-sm text-gray-400 mb-4">MP4, WebM, HLS (.m3u8) supported</p>
                  <Button variant="outline" className="px-6 py-2">Browse File</Button>
                </>
              )}

              { fileObj && (
                <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center justify-between w-full max-w-lg mx-auto bg-white p-4 rounded-lg shadow-inner">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(fileObj.status)}
                    <div className="flex flex-col text-left">
                      <span className="font-semibold truncate max-w-xs">{fileObj.name}</span>
                      <span className="text-xs text-gray-500">{formatSize(fileObj.size)}</span>
                      {fileObj.status === 'uploading' && <Progress  value={fileObj.progress} className="mt-1 h-2 rounded-full" />}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removeFile} disabled={uploading}><X className="w-5 h-5" /></Button>
                </motion.div>
              )}

              <input
                type="file"
                accept="video/*,.m3u8"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        <Button
          size="lg"
          onClick={uploadFile}
          disabled={!fileObj || !title.trim() || uploading}
          className="w-full py-3 font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 transition-all rounded-xl shadow-lg"
        >
          {uploading ? 'Uploading...' : 'Start Upload'}
        </Button>

        { fileObj?.status === 'completed' && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="mt-8 p-6 text-center bg-green-50 rounded-2xl shadow-inner">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-green-800 mb-2">Success!</h2>
            <p className="text-green-600 mb-4">Your video is now ready for annotations.</p>
            <Button size="sm" onClick={() => navigate(`/video/${fileObj.videoId}`)} className="text-white bg-green-600 hover:bg-green-700 transition-all rounded-md">
              Go to Video
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}