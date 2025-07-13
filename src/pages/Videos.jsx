"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { formatDistanceToNow, format } from "date-fns";
import { useNavigate } from "react-router-dom";
import useVideo from "@/hooks/useVideo";

export default function VideoListPage() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { getAllVideos, allVideos, deleteVideo  } = useVideo();

  useEffect(() => {
    async function load() {
      try {
        await getAllVideos();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };
  const handleDelete = async (id) => {
  if (confirm("Are you sure you want to delete this video?")) {
    try {
      await deleteVideo(id);
    } catch (err) {
      console.error("Failed to delete video:", err);
      alert("Video deletion failed.");
    }
  }
};


  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner className="w-12 h-12 text-purple-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 mb-8"
      >
        Your Videos
      </motion.h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allVideos.map((video) => (
          <motion.div
            key={video.id}
            whileHover={{ scale: 1.02 }}
            className="transition-transform"
          >
            <Card className="shadow-lg rounded-2xl overflow-hidden">
              <div className="relative h-44 bg-gray-100">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <Play className="w-12 h-12" />
                  </div>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50"
                  onClick={() => navigate(`/video/${video.id}`)}
                >
                  <Play className="w-4 h-4 text-purple-600" />
                </Button>
              </div>
              <CardContent className="p-4 space-y-2">
                <CardTitle className="text-lg truncate">
                  {video.title}
                </CardTitle>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {video.description}
                </p>
              </CardContent>
              <CardFooter className="flex flex-col items-start space-y-2 px-4 py-2 border-t">
                <div className="flex items-center justify-between w-full text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(video.duration)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {video.status === "ready" ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-green-600">Ready</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                        <span className="text-yellow-600">{video.status}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between w-full text-xs text-gray-600">
                  <span>
                    Uploaded{" "}
                    {formatDistanceToNow(new Date(video.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  <div className="flex">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => console.log("Share", video.id)}
                    >
                      <Share2 className="w-4 h-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(video.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardFooter>

              <div className="px-4 pb-4 text-xs text-gray-400">
                Uploaded{" "}
                {formatDistanceToNow(new Date(video.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}