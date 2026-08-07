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
  getBrands,
  deleteBrand,
} from "../../api/brandApi";

export default function BrandTable({
  refreshKey,
  onEdit,
}) {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    loadBrands();
  }, [refreshKey]);

  const loadBrands = async () => {
    try {
      const res = await getBrands();
      setRows(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteBrand(deleteId);

      setDeleteId(null);

      loadBrands();

      alert("Brand deleted successfully");
    } catch (err) {
      console.error(err);

      alert("Unable to delete brand");
    }
  };

  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      (
        (row.name || "") +
        " " +
        (row.description || "")
      )
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [rows, search]);

  const columns = [
    {
      field: "name",
      headerName: "Brand",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      minWidth: 300,
    },
    {
      field: "is_active",
      headerName: "Status",
      width: 120,
      renderCell: (params) =>
        params.value ? "Active" : "Inactive",
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
              setDeleteId(params.row.id)
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
        label="Search Brand..."
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <Box sx={{ height: 500 }}>
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
          Delete Brand
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this
            brand?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setDeleteId(null)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={confirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}