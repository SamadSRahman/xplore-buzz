"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import VideoPlayer from "@/components/VideoPlayer";
import IntervalEditor from "@/components/IntervalEditor";
import VideoSidebar from "@/components/VideoSidebar";
import { Card } from "@/components/ui/card";
import useVideo from "../hooks/useVideo.js";
import useCTA from "@/hooks/useCTA";
import { useFeedBackQuestion } from "@/hooks/useFeedBackQuestion";
import QRPopup from "@/components/QRPopup";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function VideoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isQRPopupOpen, setIsQRPopupOpen] = useState(false);

  const { getVideoById } = useVideo();
  const { addCTA, deleteCTA, updateCTA } = useCTA();
  const {
    addFeedBackQuestion,
    deleteFeedBackQuestion,
    updateFeedBackQuestion,
  } = useFeedBackQuestion();

  useEffect(() => {
    loadVideo();
  }, [id]);

  const loadVideo = async () => {
    try {
      const videoData = await getVideoById(id);
      setVideo(videoData.data);

      const ctaArray =
        videoData.data.videoProductsCTA.map((cta) => ({
          ...cta,
          type: "product",
        })) || [];
      const surveyArray =
        videoData.data.videoFeedbackQuestions.map((cta) => ({
          ...cta,
          type: "survey",
          startTime: cta.selectTime,
          endTime: cta.selectTime + 1,
        })) || [];

      const allAnnotations = [...ctaArray, ...surveyArray];
      setAnnotations(allAnnotations);
    } catch (error) {
      toast.error("Failed to load video");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnnotation = async (annotation) => {
    if (annotation.type === "product") {
      const result = await addCTA(annotation, id);
      const newAnnotation = {
        type: "product",
        ...result.data,
      };
      setAnnotations((prev) =>
        [...prev, newAnnotation].sort((a, b) => a.startTime - b.startTime)
      );
      toast.success("CTA added successfully");
    } else if (annotation.type === "survey") {
      const questionPayload = {
        question: annotation.question,
        optionType: annotation.optionType,
        options: annotation.options,
        correctAnswers: annotation.correctAnswers,
        selectTime: annotation.startTime,
      };
      const result = await addFeedBackQuestion(id, questionPayload);
      const newAnnotation = {
        ...result,
        type: "survey",
        startTime: annotation.startTime,
        selectTime: annotation.startTime,
        endTime: annotation.startTime + 1,
      };
      setAnnotations((prev) =>
        [...prev, newAnnotation].sort((a, b) => a.startTime - b.startTime)
      );
      toast.success("Survey added successfully");
    } else {
      toast.error("Unknown annotation type");
    }
  };

  const handleUpdateAnnotation = async (annotation) => {
    if (annotation.type === "product") {
      const result = await updateCTA(annotation.id, annotation);

      if (result.success) {
        setAnnotations((prev) =>
          prev.map((ann) =>
            ann.id === annotation.id ? { ...ann, ...annotation } : ann
          )
        );
        toast.success("CTA updated successfully");
      } else {
        toast.error("CTA update failed");
      }
    } else if (annotation.type === "survey") {
      const questionPayload = {
        question: annotation.question,
        optionType: annotation.optionType,
        options: annotation.options,
        correctAnswers: annotation.correctAnswers,
        selectTime: annotation.selectTime,
      };

      const result = await updateFeedBackQuestion(
        annotation.id,
        questionPayload
      );

      if (result.success) {
        setAnnotations((prev) =>
          prev.map((ann) =>
            ann.id === annotation.id ? { ...ann, ...annotation } : ann
          )
        );
        toast.success("Survey updated successfully");
      } else {
        toast.error("Survey update failed");
      }
    } else {
      toast.error("Unknown annotation type");
    }
  };

  const handleDeleteAnnotation = async (id, type) => {
    let result;

    if (type === "product") {
      result = await deleteCTA(id);
    } else if (type === "survey") {
      result = await deleteFeedBackQuestion(id);
    } else {
      toast.error("Unknown annotation type");
      return;
    }

    if (result.success) {
      setAnnotations((prev) => prev.filter((ann) => ann.id !== id));
      toast.success(
        `${type === "product" ? "CTA" : "Survey"} deleted successfully`
      );
    } else {
      toast.error(`Failed to delete ${type === "product" ? "CTA" : "Survey"}`);
    }
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
            The video you&apos;re looking for doesn&apos;t exist.
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
              <button
                onClick={() => navigate(`/analytics/video/${id}`)}
                className="bg-purple-gradient text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Analytics
              </button>
              {/* <button className="bg-purple-gradient text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
                Save video
              </button> */}
              <button
                onClick={() => setIsQRPopupOpen(true)}
                className="bg-purple-gradient text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
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
                  thumbnail={video.thumbnailUrl}
                  src={video.hlsUrl}
                  annotations={getActiveAnnotations()}
                  onTimeUpdate={setCurrentTime}
                  currentTime={currentTime}
                  onDurationChange={setVideoDuration}
                />
              </Card>
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1">
              <VideoSidebar
                id={id}
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
      <QRPopup
        isOpen={isQRPopupOpen}
        onClose={() => setIsQRPopupOpen(false)}
        qrCodeUrl={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
          `https://xplore-buzz-video-preview.vercel.app/video/${id}`
        )}`}
        previewUrl={`https://xplore-buzz-video-preview.vercel.app/video/${id}`}
        linkToCopy={`https://xplore-buzz-video-preview.vercel.app/video/${id}`}
      />
    </div>
  );
}
