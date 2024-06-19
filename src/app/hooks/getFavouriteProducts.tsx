import axios from "axios";

const getFavouriteProducts = async ({ apiUrl, currentUser, page }: any) => {
  try {
    const response = await axios.get(
      apiUrl + `/api/v1/products/${currentUser?.userId}/favourites?page=${page}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export default getFavouriteProducts;
