"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import ProductPopup from "./ProductPopup";
import SurveyPopup from "./SurveyPopup";

export default function VideoPlayer({
  src,
  thumbnail,
  annotations = [],
  onTimeUpdate,
  currentTime,
  onDurationChange,
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const controlsTimeoutRef = useRef(null);
  const [activeSurveyPopups, setActiveSurveyPopups] = useState(new Set());
  const [wasPlayingBeforeSurvey, setWasPlayingBeforeSurvey] = useState(false);
  const [completedSurveyIds, setCompletedSurveyIds] = useState(new Set());
  const [dismissedSurveyIds, setDismissedSurveyIds] = useState(new Set());
  const [hasVideoStarted, setHasVideoStarted] = useState(false);
  const [lastCurrentTime, setLastCurrentTime] = useState(0); // Track previous time for rewind detection

  // Sample video URL (replace with actual HLS stream)
useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari
      video.src = src;
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // optional: auto play
      });
      return () => {
        hls.destroy();
      };
    } else {
      // fallback
      video.src = src;
    }
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      onTimeUpdate?.(currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      onDurationChange?.(video.duration);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setHasVideoStarted(true);
    };
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [onTimeUpdate, onDurationChange]);

  // ✅ Enhanced logic to reset dismissed surveys when rewinding
  useEffect(() => {
    if (!hasVideoStarted) return;

    // Check if user has rewound the video (current time is significantly less than last time)
    const hasRewound = currentTime < lastCurrentTime - 1; // 1 second threshold to avoid minor fluctuations
    
    // Reset dismissed surveys if:
    // 1. Video is restarted from beginning
    // 2. User has rewound past any survey times
    // 3. User seeks to before any dismissed survey's start time
    if (currentTime < 0.5 || hasRewound) {
      const surveyAnnotations = annotations.filter(a => a.type === "survey");
      
      // Check if current time is before any dismissed survey's start time
      const shouldReset = Array.from(dismissedSurveyIds).some(surveyId => {
        const survey = surveyAnnotations.find(a => a.id === surveyId);
        return survey && currentTime < survey.startTime;
      });

      if (shouldReset || currentTime < 0.5) {
        setDismissedSurveyIds(new Set());
        console.log('🔄 Reset dismissed surveys - video rewound or restarted');
      }
    }

    setLastCurrentTime(currentTime);
  }, [currentTime, hasVideoStarted, lastCurrentTime, annotations, dismissedSurveyIds]);

  // Handle survey popup visibility and video pause/play
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const currentSurveyAnnotations = annotations.filter(
      (a) =>
        a.type === "survey" &&
        currentTime >= a.startTime &&
        currentTime <= a.endTime &&
        !completedSurveyIds.has(a.id) &&
        !dismissedSurveyIds.has(a.id)
    );

    const newActiveSurveys = new Set(currentSurveyAnnotations.map((a) => a.id));

    const hasNewSurvey = currentSurveyAnnotations.some(
      (a) => !activeSurveyPopups.has(a.id)
    );

    if (hasNewSurvey && !video.paused) {
      setWasPlayingBeforeSurvey(true);
      video.pause();
    }

    setActiveSurveyPopups(newActiveSurveys);
  }, [currentTime, annotations, activeSurveyPopups, completedSurveyIds, dismissedSurveyIds]);

  const handleSurveyClose = (surveyId, isCompleted = false) => {
    setActiveSurveyPopups((prev) => {
      const newSet = new Set(prev);
      newSet.delete(surveyId);

      if (newSet.size === 0 && wasPlayingBeforeSurvey) {
        const video = videoRef.current;
        if (video) video.play();
        setWasPlayingBeforeSurvey(false);
      }

      return newSet;
    });

    if (isCompleted) {
      setCompletedSurveyIds((prev) => new Set(prev).add(surveyId));
    } else {
      setDismissedSurveyIds((prev) => new Set(prev).add(surveyId));
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;

    // Reset dismissed surveys when starting from beginning
    if (video.currentTime < 0.5) {
      setDismissedSurveyIds(new Set());
    }

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    const video = videoRef.current;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;

    // Reset dismissed surveys when seeking backwards past survey times
    const surveyAnnotations = annotations.filter(a => a.type === "survey");
    const shouldReset = Array.from(dismissedSurveyIds).some(surveyId => {
      const survey = surveyAnnotations.find(a => a.id === surveyId);
      return survey && newTime < survey.startTime;
    });

    if (shouldReset || newTime < 0.5) {
      setDismissedSurveyIds(new Set());
      console.log('🔄 Reset dismissed surveys - seeking backwards');
    }

    video.currentTime = newTime;
  };

  const toggleFullscreen = () => {
    const container = videoRef.current.parentElement;
    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const skip = (seconds) => {
    const video = videoRef.current;
    const newTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
    
    // Reset dismissed surveys when skipping backwards past survey times
    if (seconds < 0) {
      const surveyAnnotations = annotations.filter(a => a.type === "survey");
      const shouldReset = Array.from(dismissedSurveyIds).some(surveyId => {
        const survey = surveyAnnotations.find(a => a.id === surveyId);
        return survey && newTime < survey.startTime;
      });

      if (shouldReset) {
        setDismissedSurveyIds(new Set());
        console.log('🔄 Reset dismissed surveys - skipping backwards');
      }
    }

    video.currentTime = newTime;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="relative bg-black rounded-lg overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
       <video
        ref={videoRef}
        className="w-full aspect-video"
        onClick={togglePlay}
        poster={thumbnail}
      />

      {/* Annotation Overlays */}
      <AnimatePresence>
        {annotations
          .filter((a) => currentTime >= a.startTime && currentTime <= a.endTime)
          .map((annotation) => (
            <motion.div
              key={annotation.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              <div className="pointer-events-auto">
                {annotation.type === "product" && (
                  <ProductPopup annotation={annotation} />
                )}
                {annotation.type === "survey" &&
                  activeSurveyPopups.has(annotation.id) && (
                    <SurveyPopup
                      annotation={annotation}
                      onClose={(isCompleted = false) => handleSurveyClose(annotation.id, isCompleted)}
                    />
                  )}
              </div>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Video Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end"
          >
            {/* Progress Bar */}
            <div className="px-4 pb-2">
              <div
                className="w-full h-2 bg-white/30 rounded-full cursor-pointer hover:h-3 transition-all"
                onClick={handleSeek}
              >
                <div
                  className="h-full bg-purple-500 rounded-full relative"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>

            {/* Control Bar */}
            <div className="flex items-center justify-between px-4 pb-4 text-white">
              <div className="flex items-center space-x-4">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </button>

                {/* Skip buttons */}
                <button
                  onClick={() => skip(-10)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => skip(10)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <RotateCw className="w-5 h-5" />
                </button>

                {/* Volume */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleMute}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 accent-purple-500"
                  />
                </div>

                {/* Time */}
                <span className="text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {/* Reset Surveys Button (for testing) */}
                <button
                  onClick={() => {
                    setDismissedSurveyIds(new Set());
                    setCompletedSurveyIds(new Set());
                    console.log('🔄 Manually reset all surveys');
                  }}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  title="Reset Surveys"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Settings */}
                <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <Settings className="w-5 h-5" />
                </button>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading indicator */}
      {duration === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
}