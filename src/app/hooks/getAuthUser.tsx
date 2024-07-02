import axios from "axios";

const getAuthUser = async ({ apiUrl, userStorage }: any) => {
  try {
    if (userStorage) {
      const response = await axios.get(
        apiUrl + "/api/v1/users/" + JSON.parse(userStorage).userId
      );
      return response.data;
    }
  } catch (error: any) {
    console.error("Error get auth user:", error);
    return [];
  }
};

export default getAuthUser;
