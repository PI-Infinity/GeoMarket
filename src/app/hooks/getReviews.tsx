import axios from "axios";

const getReviews = async ({ apiUrl, productId, newPage }: any) => {
  try {
    const response = await axios.get(
      apiUrl + `/api/v1/products/${productId}/reviews?page=${newPage}&limit=4`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

export default getReviews;
