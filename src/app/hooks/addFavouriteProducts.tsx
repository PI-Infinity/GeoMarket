import axios from "axios";

const addFavouriteProducts = async ({ apiUrl, currentUser, newPage }: any) => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/products/${currentUser?.userId}/favourites?page=${newPage}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export default addFavouriteProducts;
