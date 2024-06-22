import axios from "axios";

const getAdminUsers = async ({ apiUrl, search, page, limit, sort }: any) => {
  try {
    const response = await axios.get(
      apiUrl +
        `/api/v1/admin/users?search=${search}&page=${page}&limit=${limit}&sortField=${sort?.sortField}&sortOrder=${sort?.sortOrder}`
    );

    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export default getAdminUsers;
