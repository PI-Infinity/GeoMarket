import axios from "axios";

const fetchProducts = async ({
  apiUrl,
  search,
  category,
  price,
  page,
}: any) => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/products?search=${search}&category=${category}&price=${price}&page=${page}&limit=8&status=public`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export default fetchProducts;
