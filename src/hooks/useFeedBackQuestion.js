import { apiClientWithAuth } from "@/lib/axios";
import { formatTime } from "@/lib/utils";

export const useFeedBackQuestion = () => {
  const addFeedBackQuestion = async (id, questionData) => {
    console.log("Adding survey with payload:", questionData);
    try {
      const payload = {
        ...questionData,
        selectTime: formatTime(questionData.selectTime),
      };
      const response = await apiClientWithAuth.post(
        `feedback-questions/${id}`,
        payload
      );
      console.log("Backend response for addFeedBackQuestion:", {
        status: response.status,
        data: response.data,
      });
      return response.data.data;
    } catch (error) {
      console.error(
        "Error adding feedback question:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const getAllFeedBackQuestions = async (id) => {
    try {
      const response = await apiClientWithAuth.get(`feedback-questions/${id}`);
      console.log("Fetched Feedback Questions Response:", {
        status: response.status,
        data: response.data,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching feedback questions:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  // ✅ UPDATE
  const updateFeedBackQuestion = async (id, questionData) => {
    try {
      const payload = {
        ...questionData,
        selectTime: formatTime(questionData.selectTime),
      };

      const response = await apiClientWithAuth.patch(
        `feedback-questions/${id}`,
        payload
      );
      console.log("Updated Feedback Question:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error updating feedback question:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  // ✅ DELETE
  const deleteFeedBackQuestion = async (id) => {
    try {
      const response = await apiClientWithAuth.delete(
        `feedback-questions/${id}`
      );
      console.log("Deleted Feedback Question:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error deleting feedback question:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  return {
    addFeedBackQuestion,
    getAllFeedBackQuestions,
    updateFeedBackQuestion,
    deleteFeedBackQuestion,
  };
};