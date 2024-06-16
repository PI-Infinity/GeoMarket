import axios from "axios";

const getAuthUser = async ({ apiUrl, userStorage }: any) => {
  try {
    const response = await axios.get(
      apiUrl + "/api/v1/users/" + JSON.parse(userStorage).userId
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export default getAuthUser;
