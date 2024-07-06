import axios from "axios";
import { removeCookie } from "../utils/cookies";

const getAuthUser = async ({ apiUrl, userStorage, setCurrentUser }: any) => {
  try {
    if (userStorage) {
      const response = await axios.get(
        apiUrl + "/api/v1/users/" + JSON.parse(userStorage).userId
      );
      return response.data;
    }
  } catch (error: any) {
    if (error?.response?.data?.message === "User not found with this id") {
      console.log(error?.response?.data?.message);
      removeCookie("GeoMarket:currentUser");
      setCurrentUser(null);
    }
  }
};

export default getAuthUser;
