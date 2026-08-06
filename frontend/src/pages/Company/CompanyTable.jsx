import { useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  TextField,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
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
  const [deleteId, setDeleteId] = useState(null);

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

  const openDeleteDialog = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await deleteCompany(deleteId);

      alert("Company deleted successfully");

      setDeleteId(null);

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
        (row.gst_no || "") +
        " " +
        (row.mobile || "")
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
      minWidth: 180,
    },
    {
      field: "brand_name",
      headerName: "Brand",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "gst_no",
      headerName: "GST",
      flex: 1,
      minWidth: 170,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      flex: 1,
      minWidth: 130,
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
            onClick={() => {
              if (onEdit) {
                onEdit(params.row);
              }
            }}
          >
            Edit
          </Button>

          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() =>
              openDeleteDialog(params.row.id)
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

      <Dialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
      >
        <DialogTitle>
          Delete Company
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this
            company?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setDeleteId(null)}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={confirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}