import axios from "axios";

const fetchProducts = async ({ apiUrl, search, currentUser }: any) => {
  try {
    const response = await axios.get(
      apiUrl +
        `/api/v1/products?search=${search}&seller=${currentUser?.userId}&currentUser=true&page=1`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export default fetchProducts;
