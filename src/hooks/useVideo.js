"use client";

import React, { useState } from "react";
import { apiClientWithAuth } from "../lib/axios";

export default function useVideo() {
  const [allVideos, setAllVideos] = useState([]);
  const uploadVideo = async (video, title, description) => {
    // console.log("params received", video, title, description);

    const formData = new FormData();
    formData.append("video", video);
    formData.append("description", description);
    formData.append("title", title);
    // console.log("form data", formData);

    try {
      const response = await apiClientWithAuth.post("/videos/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading video:", error);
      return error.response.data;
      // throw new Error("Video upload failed");
    }
  };

  const getAllVideos = async () => {
    try {
      const response = await apiClientWithAuth.get("/videos");
      // console.log("response", response.data);
      setAllVideos(response.data.data.videos);
      return response.data;
    } catch (error) {
      console.error("Error fetching videos:", error);
      return error.response.data;
    }
  };

  const getVideoById = async (id) => {
    try {
      const response = await apiClientWithAuth.get("videos/" + id);
      // console.log('response for one vidoe', response.data)
      return response.data;
    } catch (error) {
      console.error("Error fetching video:", error);
      throw new Error("Video upload failed");
    }
  };

  // const updateVideo = async (id, thumbnail, title, description, video) => {
  //   const formData = new FormData();
  //   if (thumbnail) formData.append("image", thumbnail);
  //   if (title) formData.append("title", title);
  //   if (description) formData.append("description", description);
  //   if (video) formData.append("video", video);
  //   try {
  //     const response = await apiClientWithAuth.patch(
  //       `/videos/${id}`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     // console.log('response from update video', response.data)
  //     return response.data;
  //   } catch (error) {
  //     console.error("error updated video", error.response.data);
  //   }
  // };

  const updateVideo = async (id, thumbnail, title, description, video) => {
    const formData = new FormData();

    if (thumbnail !== undefined && thumbnail !== null) {
      formData.append("image", thumbnail);
    }
    if (title !== undefined && title !== null) {
      formData.append("title", title);
    }
    if (description !== undefined && description !== null) {
      formData.append("description", description);
    }
    if (video !== undefined && video !== null) {
      formData.append("video", video);
    }

    try {
      const response = await apiClientWithAuth.patch(
        `/videos/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("error updating video", error.response?.data);
      return { success: false, error: error.response?.data };
    }
  };

  const deleteVideo = async (id) => {
    try {
      const response = await apiClientWithAuth.delete(`/videos/${id}`);
      // Optionally refresh the video list
      await getAllVideos();
      return response.data;
    } catch (error) {
      console.error(
        "Error deleting video:",
        error.response?.data || error.message
      );
      throw new Error("Video deletion failed");
    }
  };

  return {
    uploadVideo,
    getAllVideos,
    allVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
  };
}
