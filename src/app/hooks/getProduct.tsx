import axios from "axios";

const getProduct = async ({ apiUrl, productId, requestBy }: any) => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/products/${productId}?requestBy=${requestBy}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export default getProduct;
