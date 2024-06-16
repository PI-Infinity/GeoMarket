import axios from "axios";

const addMessages = async ({
  apiUrl,
  activeRoom,
  newPage,
  currentUser,
}: any) => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/messages/${
        activeRoom.members[0].id + "|" + activeRoom.members[1].id
      }?page=${newPage}&currentUser=${currentUser?.userId}`
    );

    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export default addMessages;
