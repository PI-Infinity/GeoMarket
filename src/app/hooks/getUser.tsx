import axios from "axios";

const getUser = async ({ apiUrl, userId }: any) => {
  try {
    if (userId && !userId?.includes("product")) {
      const response = await axios.get(apiUrl + "/api/v1/users/" + userId);
      return response.data;
    }
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return [];
  }
};

export default getUser;
