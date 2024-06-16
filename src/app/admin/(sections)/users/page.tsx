"use client";
import * as React from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { useApp } from "@/app/context/app";
import axios from "axios";

// Define the User type for better type safety
interface User {
  id: number;
  name: string;
  email: string;
  phone: { value: string };
}

// Define the column configuration
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "email", headerName: "Email", width: 250 },
  { field: "phone", headerName: "Phone", width: 250 },
];

export default function DataTable() {
  const { apiUrl } = useApp();

  const [users, setUsers] = React.useState<User[]>([]);
  const [page, setPage] = React.useState<number>(0);
  const [pageSize, setPageSize] = React.useState<number>(5);
  const [loading, setLoading] = React.useState<boolean>(false);

  const getUsers = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/v1/users`, {
        params: {
          page,
          pageSize,
        },
      });
      setUsers(response.data.data.users);
    } catch (error: any) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getUsers(page, pageSize);
  }, [apiUrl, page, pageSize]);

  const rows = users.map((user, index) => ({
    id: index + 1,
    name: user.name,
    email: user.email,
    phone: user.phone.value,
  }));

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(0); // Reset to the first page whenever the page size changes
  };

  return (
    <div style={{ width: "75%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pagination
        paginationModel={{ page, pageSize }}
        pageSizeOptions={[5, 10]}
        onPaginationModelChange={(params: GridPaginationModel) => {
          handlePageChange(params.page);
          handlePageSizeChange(params.pageSize);
        }}
        checkboxSelection
      />
    </div>
  );
}
