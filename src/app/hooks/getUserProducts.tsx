import axios from "axios";

const getUsersProducts = async ({ apiUrl, search, userId, page }: any) => {
  try {
    const response = await axios.get(
      apiUrl +
        `/api/v1/products/user/${userId}?page=${page}&limit=8&search=${search}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export default getUsersProducts;
