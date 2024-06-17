import axios from "axios";

const getUsers = async ({ apiUrl, search }: any) => {
  try {
    const response = await axios.get(apiUrl + `/api/v1/users?search=${search}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export default getUsers;
