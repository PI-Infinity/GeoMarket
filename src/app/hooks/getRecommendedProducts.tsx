import axios from "axios";

const fetchRecommendedProducts = async ({
  apiUrl,
  searchParams,
  productId,
}: any) => {
  try {
    const response = await axios.get(
      apiUrl +
        `/api/v1/products?search=&category=${searchParams}&page=1&limit=6&productId=${productId}&status=public`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching recommended products:", error);
    return [];
  }
};

export default fetchRecommendedProducts;
