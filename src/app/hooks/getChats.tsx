import axios from "axios";

const getChats = async ({ apiUrl, currentUser }: any) => {
  try {
    const response = await axios.get(
      apiUrl +
        "/api/v1/chats?userId=" +
        currentUser?.userId +
        "&page=1&limit=12"
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export default getChats;
