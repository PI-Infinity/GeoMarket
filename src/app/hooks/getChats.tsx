import axios from "axios";

const getChats = async ({ apiUrl, currentUser, newPage }: any) => {
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
    console.log("Error getting chats:", error);
  }
};

export default getChats;
