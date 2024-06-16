import axios from "axios";

const getRoom = async ({ apiUrl, id }: any) => {
  try {
    const response = await axios.get(apiUrl + "/api/v1/chats/" + id);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching room:", error);
    return [];
  }
};

export default getRoom;
