import axios from "axios";

const getUnreadChats = async ({ apiUrl, currentUser }: any) => {
  try {
    const response = await axios.get(
      apiUrl + "/api/v1/chats/unreads?currentUser=" + currentUser?.userId
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export default getUnreadChats;
