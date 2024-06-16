import axios from "axios";

const getUser = async ({ apiUrl, userId }: any) => {
  try {
    const response = await axios.get(apiUrl + "/api/v1/users/" + userId);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export default getUser;
