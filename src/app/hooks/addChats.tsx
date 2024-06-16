import axios from "axios";

const addChats = async ({ apiUrl, currentUser, newPage }: any) => {
  try {
    const response = await axios.get(
      apiUrl +
        "/api/v1/chats?userId=" +
        currentUser?.userId +
        "&page=" +
        newPage +
        "&limit=12"
    );

    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export default addChats;
