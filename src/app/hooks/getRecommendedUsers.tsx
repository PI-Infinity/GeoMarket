import axios from "axios";

const fetchRecommendedUsers = async ({ apiUrl }: any) => {
  try {
    const response = await axios.get(apiUrl + `/api/v1/users`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export default fetchRecommendedUsers;
