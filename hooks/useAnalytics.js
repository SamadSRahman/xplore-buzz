"use client";

import { useState } from "react";
import { apiClientWithAuth } from "../lib/axios"; // adjust path if needed

export default function useAnalytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getVideoAnalyticsSummary = async (videoId, timeRange = "30d") => {
    setLoading(true);
    try {
      const response = await apiClientWithAuth.get(`/analytics/video/${videoId}/summary`, {
        params: { timeRange }
      });
      console.log("Analytics summary response:", response.data);
      setAnalyticsData(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching analytics summary:", error);
      if (error.response) {
        console.error("API Response Error:", error.response.data);
        throw new Error(error.response.data.message || "Failed to fetch analytics summary");
      }
      throw new Error("Unexpected error fetching analytics summary");
    } finally {
      setLoading(false);
    }
  };

  return {
    analyticsData,
    loading,
    getVideoAnalyticsSummary
  };
}
