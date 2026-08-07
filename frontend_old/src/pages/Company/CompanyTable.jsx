import { useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  TextField,
  Button,
  Stack,
} from "@mui/material";

import {
  getCompanies,
  deleteCompany,
} from "../../api/companyApi";

export default function CompanyTable({
  refreshKey,
  onEdit,
}) {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCompanies();
  }, [refreshKey]);

  const loadCompanies = async () => {
    try {
      const res = await getCompanies();
      setRows(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this company?")) {
      return;
    }

    try {
      await deleteCompany(id);
      alert("Company deleted successfully");
      loadCompanies();
    } catch (err) {
      console.error(err);
      alert("Unable to delete company");
    }
  };

  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      (
        (row.company_name || "") +
        " " +
        (row.brand_name || "") +
        " " +
        (row.gst_no || "")
      )
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [rows, search]);

  const columns = [
    {
      field: "company_name",
      headerName: "Company",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "brand_name",
      headerName: "Brand",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "gst_no",
      headerName: "GST",
      flex: 1,
      minWidth: 170,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 220,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            size="small"
            onClick={() => onEdit(params.row)}
          >
            Edit
          </Button>

          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() =>
              handleDelete(params.row.id)
            }
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ];
    return (
    <Box>
      <TextField
        fullWidth
        size="small"
        label="Search Company..."
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <Box sx={{ height: 520 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSizeOptions={[10, 20, 50]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
}