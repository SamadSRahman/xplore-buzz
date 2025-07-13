import { apiClientWithAuth } from "@/lib/axios";
import { formatTime } from "@/lib/utils";

export default function useCTA() {
  const addCTA = async (cta, id) => {
    const formData = new FormData();
    formData.append("productName", cta.name);
    formData.append("productUrl", cta.url);
    formData.append("image", cta.image);
    formData.append("startTime", formatTime(cta.startTime));
    formData.append("endTime", formatTime(cta.endTime));
    formData.append("position", cta.position);
    formData.append("backgroundColor", cta.backgroundColor);
    formData.append("fontColor", cta.fontColor);

    try {
      const response = await apiClientWithAuth.post(
        `products-cta/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("response from add cta", response.data);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };

  const deleteCTA = async (id) => {
    try {
      const response = await apiClientWithAuth.delete(`/products-cta/${id}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("error deleting cta", error.response.data.error);
      throw new Error(error.response.data.error);
    }
  };
  const updateCTA = async (id, cta) => {
    const formData = new FormData();
    formData.append("productName", cta.productName);
    formData.append("productUrl", cta.productUrl);
    if (typeof cta.image === "object") {
      formData.append("image", cta.imageUrl);
    }
    formData.append("startTime", formatTime(cta.startTime));
    formData.append("endTime", formatTime(cta.endTime));
    formData.append("position", cta.position);
    formData.append("fontColor", cta.fontColor);
    formData.append("backgroundColor", cta.backgroundColor);
    try {
      const response = await apiClientWithAuth.patch(
        `/products-cta/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("error deleting cta", error.response.data.error);
      throw new Error(error.response.data.error);
    }
  };
  return { addCTA, deleteCTA, updateCTA };
}