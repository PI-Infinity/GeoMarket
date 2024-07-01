import axios from "axios";

const fetchProducts = async ({
  apiUrl,
  search,
  category,
  price,
  page,
  byOrder,
  sort,
  sales,
}: // displayedIds,
// displayedIds,
any) => {
  try {
    const response = await axios.get(
      `${apiUrl}/api/v1/products?search=${search}&category=${category}&price=${price}&byOrder=${byOrder}&page=${page}&limit=8&status=public&sort=${sort}&sales=${sales}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export default fetchProducts;
