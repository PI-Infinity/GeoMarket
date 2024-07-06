import axios from "axios";

const getUsersProducts = async ({
  apiUrl,
  search,
  userId,
  page,
  status,
}: any) => {
  try {
    const response = await axios.get(
      apiUrl +
        `/api/v1/products/user/${userId}?page=${page}&limit=8&search=${search}&status=${status}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user's products:", error);
    return [];
  }
};

export default getUsersProducts;
