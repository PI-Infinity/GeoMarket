import axios from "axios";

const getUsers = async ({
  apiUrl,
  search,
  category,
  page,
  limit,
  onlySellers,
  admin,
}: any) => {
  try {
    const response = await axios.get(
      apiUrl +
        `/api/v1/users?search=${search}&category=${category}&page=${page}&limit=${limit}&onlySellers=${onlySellers}&admin=${admin}`
    );

    return response.data;
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export default getUsers;
