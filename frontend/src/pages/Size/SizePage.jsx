import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Snackbar,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";

const API_BASE_URL =
  "http://127.0.0.1:8000";

const SIZE_TYPES = [
  "Kids",
  "Men",
  "Women",
  "Sports",
];

export default function SizePage() {
  const [sizes, setSizes] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [editingSize, setEditingSize] =
    useState(null);

  const [form, setForm] = useState({
    code: "",
    name: "",
    size_type: "",
    is_active: true,
  });

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /*
   * Load sizes
   */
  const loadSizes = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/sizes/`
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to load sizes"
        );
      }

      setSizes(data);
    } catch (err) {
      setError(
        err.message ||
          "Failed to load sizes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSizes();
  }, []);

  /*
   * Add
   */
  const handleAdd = () => {
    setEditingSize(null);

    setForm({
      code: "",
      name: "",
      size_type: "",
      is_active: true,
    });

    setDialogOpen(true);
  };

  /*
   * Edit
   */
  const handleEdit = (size) => {
    setEditingSize(size);

    setForm({
      code: size.code || "",
      name: size.name || "",
      size_type:
        size.size_type || "",
      is_active:
        size.is_active !== false,
    });

    setDialogOpen(true);
  };

  /*
   * Close
   */
  const handleClose = () => {
    setDialogOpen(false);

    setEditingSize(null);
  };

  /*
   * Form change
   */
  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
   * Save
   */
  const handleSave = async () => {
    if (!form.code.trim()) {
      setError(
        "Size code is required."
      );

      return;
    }

    if (!form.name.trim()) {
      setError(
        "Size name is required."
      );

      return;
    }

    if (!form.size_type) {
      setError(
        "Size type is required."
      );

      return;
    }

    try {
      const url =
        editingSize
          ? `${API_BASE_URL}/sizes/${editingSize.id}`
          : `${API_BASE_URL}/sizes/`;

      const method =
        editingSize
          ? "PUT"
          : "POST";

      const response =
        await fetch(url, {
          method,

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            form
          ),
        });

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
            "Failed to save size"
        );
      }

      setSuccess(
        editingSize
          ? "Size updated successfully."
          : "Size created successfully."
      );

      handleClose();

      await loadSizes();
    } catch (err) {
      setError(
        err.message ||
          "Failed to save size"
      );
    }
  };

  /*
   * Delete
   */
  const handleDelete = async (
    size
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${size.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await fetch(
          `${API_BASE_URL}/sizes/${size.id}`,
          {
            method: "DELETE",
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
            "Failed to delete size"
        );
      }

      setSuccess(
        "Size deleted successfully."
      );

      await loadSizes();
    } catch (err) {
      setError(
        err.message ||
          "Failed to delete size"
      );
    }
  };

  /*
   * Search
   */
  const filteredSizes =
    sizes.filter((size) => {
      const text =
        search.toLowerCase();

      return (
        size.code
          ?.toLowerCase()
          .includes(text) ||
        size.name
          ?.toLowerCase()
          .includes(text) ||
        size.size_type
          ?.toLowerCase()
          .includes(text)
      );
    });

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          mb: 2,
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
          >
            Size Master
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Manage product sizes
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Size
        </Button>
      </Box>

      {/* SEARCH */}

      <Card
        sx={{
          mb: 2,
        }}
      >
        <CardContent>
          <TextField
            fullWidth
            size="small"
            placeholder="Search size..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* TABLE */}

      <Card>
        <CardContent
          sx={{
            p: 0,
            "&:last-child": {
              pb: 0,
            },
          }}
        >
          {/* TABLE HEADER */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "70px 150px 1.5fr 180px 110px 120px",
              bgcolor: "#f1f5f9",
              borderBottom:
                "1px solid #e2e8f0",
              px: 2,
              py: 1.5,
              fontWeight: 700,
            }}
          >
            <Box>ID</Box>

            <Box>Code</Box>

            <Box>Size Name</Box>

            <Box>Size Type</Box>

            <Box>Status</Box>

            <Box>Action</Box>
          </Box>

          {/* LOADING */}

          {loading && (
            <Box
              sx={{
                p: 4,
                textAlign: "center",
              }}
            >
              <Typography>
                Loading sizes...
              </Typography>
            </Box>
          )}

          {/* EMPTY */}

          {!loading &&
            filteredSizes.length ===
              0 && (
              <Box
                sx={{
                  p: 5,
                  textAlign: "center",
                }}
              >
                <Typography
                  color="text.secondary"
                >
                  No sizes found
                </Typography>
              </Box>
            )}

          {/* ROWS */}

          {!loading &&
            filteredSizes.map(
              (size) => (
                <Box
                  key={size.id}
                  sx={{
                    display: "grid",

                    gridTemplateColumns:
                      "70px 150px 1.5fr 180px 110px 120px",

                    alignItems:
                      "center",

                    px: 2,

                    py: 1.5,

                    borderBottom:
                      "1px solid #e2e8f0",

                    "&:hover": {
                      bgcolor:
                        "#f8fafc",
                    },
                  }}
                >
                  {/* ID */}

                  <Box>
                    {size.id}
                  </Box>

                  {/* CODE */}

                  <Box
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {size.code}
                  </Box>

                  {/* NAME */}

                  <Box
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {size.name}
                  </Box>

                  {/* TYPE */}

                  <Box>
                    <Typography
                      component="span"
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: 12,
                        fontWeight: 600,
                        bgcolor:
                          "#e0f2fe",
                        color:
                          "#075985",
                      }}
                    >
                      {size.size_type}
                    </Typography>
                  </Box>

                  {/* STATUS */}

                  <Box>
                    <Typography
                      component="span"
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: 12,
                        fontWeight: 600,

                        bgcolor:
                          size.is_active
                            ? "#dcfce7"
                            : "#fee2e2",

                        color:
                          size.is_active
                            ? "#166534"
                            : "#991b1b",
                      }}
                    >
                      {size.is_active
                        ? "Active"
                        : "Inactive"}
                    </Typography>
                  </Box>

                  {/* ACTION */}

                  <Box>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() =>
                          handleEdit(
                            size
                          )
                        }
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                          handleDelete(
                            size
                          )
                        }
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              )
            )}
        </CardContent>
      </Card>

      {/* ADD / EDIT DIALOG */}

      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingSize
            ? "Edit Size"
            : "Add Size"}
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection:
                "column",
              gap: 2,
              pt: 1,
            }}
          >
            <TextField
              label="Size Code"
              name="code"
              value={form.code}
              onChange={
                handleChange
              }
              fullWidth
              required
            />

            <TextField
              label="Size Name"
              name="name"
              value={form.name}
              onChange={
                handleChange
              }
              fullWidth
              required
            />

            <TextField
              select
              label="Size Type"
              name="size_type"
              value={
                form.size_type
              }
              onChange={
                handleChange
              }
              fullWidth
              required
            >
              {SIZE_TYPES.map(
                (type) => (
                  <MenuItem
                    key={type}
                    value={type}
                  >
                    {type}
                  </MenuItem>
                )
              )}
            </TextField>

            <Box
              sx={{
                display: "flex",
                alignItems:
                  "center",
              }}
            >
              <Switch
                checked={
                  form.is_active
                }
                onChange={(
                  event
                ) =>
                  setForm(
                    (prev) => ({
                      ...prev,
                      is_active:
                        event.target
                          .checked,
                    })
                  )
                }
              />

              <Typography>
                Active Size
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={
              handleClose
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={
              handleSave
            }
          >
            {editingSize
              ? "Update"
              : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ERROR */}

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={4000}
        onClose={() =>
          setError("")
        }
      >
        <Alert
          severity="error"
          onClose={() =>
            setError("")
          }
        >
          {error}
        </Alert>
      </Snackbar>

      {/* SUCCESS */}

      <Snackbar
        open={Boolean(success)}
        autoHideDuration={3000}
        onClose={() =>
          setSuccess("")
        }
      >
        <Alert
          severity="success"
          onClose={() =>
            setSuccess("")
          }
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}
