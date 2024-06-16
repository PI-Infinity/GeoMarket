import axios from "axios";

const getProduct = async ({ apiUrl, productId }: any) => {
  try {
    const response = await axios.get(`${apiUrl}/api/v1/products/${productId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export default getProduct;
