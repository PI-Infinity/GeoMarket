import axios from "axios";

const fetchProducts = async ({ apiUrl, search, currentUser, page }: any) => {
  try {
    const response = await axios.get(
      apiUrl +
        `/api/v1/products?search=${search}&seller=${currentUser?.userId}&currentUser=true&page=${page}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export default fetchProducts;
