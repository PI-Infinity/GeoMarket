import axios from "axios";

const getUsers = async ({
  apiUrl,
  search,
  page,
  limit,
  onlySellers,
  admin,
}: any) => {
  try {
    const response = await axios.get(
      apiUrl +
        `/api/v1/users?search=${search}&page=${page}&limit=${limit}&onlySellers=${onlySellers}&admin=${admin}`
    );

    return response.data;
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export default getUsers;
