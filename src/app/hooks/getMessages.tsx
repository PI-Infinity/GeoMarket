import axios from "axios";

const getMessages = async ({ apiUrl, activeRoom, page, currentUser }: any) => {
  try {
    const response = await axios.get(
      apiUrl +
        "/api/v1/messages/" +
        activeRoom.members[0].id +
        "|" +
        activeRoom.members[1].id +
        "?page=" +
        page +
        "&currentUser=" +
        currentUser?.userId
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export default getMessages;
