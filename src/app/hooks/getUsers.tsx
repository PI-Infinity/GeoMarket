import axios from "axios";

const getUsers = async ({ apiUrl, search, page, onlySellers }: any) => {
  try {
    const response = await axios.get(
      apiUrl + `/api/v1/users?search=${search}&page=${page}&onlySellers=true`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export default getUsers;
