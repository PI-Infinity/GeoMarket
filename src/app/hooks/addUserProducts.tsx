import axios from "axios";

const addProducts = async ({ apiUrl, search, newPage, currentUser }: any) => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/products?search=${search}&seller=${currentUser?.userId}&currentUser=true&page=${newPage}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export default addProducts;
