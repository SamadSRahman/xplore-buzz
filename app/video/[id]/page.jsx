"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import VideoPlayer from "@/components/VideoPlayer";
import IntervalEditor from "@/components/IntervalEditor";
import VideoSidebar from "@/components/VideoSidebar";
import { getVideoById } from "@/lib/api/video";
import { Card } from "@/components/ui/card";

export default function VideoPage({ params }) {
  const [video, setVideo] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);


  useEffect(() => {
    loadVideo();
  }, [params.id]);

  const loadVideo = async () => {
    try {
      const videoData = await getVideoById(params.id);
      setVideo(videoData);
      setAnnotations(videoData.annotations || []);
    } catch (error) {
      toast.error("Failed to load video");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnnotation = (annotation) => {
    const newAnnotation = {
      id: Date.now() + Math.random(),
      ...annotation,
    };
    setAnnotations((prev) =>
      [...prev, newAnnotation].sort((a, b) => a.startTime - b.startTime)
    );
    toast.success("Annotation added successfully");
  };

  const handleUpdateAnnotation = (id, updates) => {
    setAnnotations((prev) =>
      prev.map((ann) => (ann.id === id ? { ...ann, ...updates } : ann))
    );
    toast.success("Annotation updated");
  };

  const handleDeleteAnnotation = (id) => {
    setAnnotations((prev) => prev.filter((ann) => ann.id !== id));
    toast.success("Annotation deleted");
  };

  const getActiveAnnotations = () => {
    return annotations.filter(
      (ann) => currentTime >= ann.startTime && currentTime <= ann.endTime
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Video Not Found
          </h2>
          <p className="text-gray-600">
            The video you're looking for doesn't exist.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                {video.title}
                <button className="text-gray-400 hover:text-gray-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                From {new Date(video.createdAt).toLocaleDateString()} •{" "}
                {video.duration || "7days"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="bg-purple-gradient text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
                Save video
              </button>
              <button className="bg-purple-gradient text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
                Share video
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Video Player Section */}
            <div className="xl:col-span-3 space-y-6">
              <Card className="overflow-hidden bg-white shadow-lg">
                <VideoPlayer
                  src={video.src}
                  annotations={getActiveAnnotations()}
                  onTimeUpdate={setCurrentTime}
                  currentTime={currentTime}
                  onDurationChange={setVideoDuration}
                />
              </Card>

              {/* Video Stats */}
              {/* <Card className="p-6 bg-white">
                <div className="grid grid-cols-3 gap-8 text-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Views</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {video.views || 91}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Impressions</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {video.impressions || 101}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Time Played</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {video.timePlayed || "5 hr 10 sec"}
                    </p>
                  </div>
                </div>
              </Card> */}
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1">
              <VideoSidebar
                video={video}
                annotations={annotations}
                currentTime={currentTime}
                onAddAnnotation={handleAddAnnotation}
                onUpdateAnnotation={handleUpdateAnnotation}
                onDeleteAnnotation={handleDeleteAnnotation}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
              />
            </div>
          </div>

          {/* Interval Editor */}
          <IntervalEditor
            annotations={annotations}
            currentTime={currentTime}
            videoDuration={videoDuration}
            onAddAnnotation={handleAddAnnotation}
            onUpdateAnnotation={handleUpdateAnnotation}
            onDeleteAnnotation={handleDeleteAnnotation}
          />
        </motion.div>
      </div>
    </div>
  );
}
