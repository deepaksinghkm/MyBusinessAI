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

export default function CategoryPage() {
  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [editingCategory, setEditingCategory] =
    useState(null);

  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
    is_active: true,
  });

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /*
   * Load categories
   */
  const loadCategories = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/categories/`
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to load categories"
        );
      }

      setCategories(data);
    } catch (err) {
      setError(
        err.message ||
          "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  /*
   * Add category
   */
  const handleAdd = () => {
    setEditingCategory(null);

    setForm({
      code: "",
      name: "",
      description: "",
      is_active: true,
    });

    setDialogOpen(true);
  };

  /*
   * Edit category
   */
  const handleEdit = (
    category
  ) => {
    setEditingCategory(category);

    setForm({
      code: category.code || "",
      name: category.name || "",
      description:
        category.description || "",
      is_active:
        category.is_active !== false,
    });

    setDialogOpen(true);
  };

  /*
   * Close dialog
   */
  const handleClose = () => {
    setDialogOpen(false);

    setEditingCategory(null);
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
   * Save category
   */
  const handleSave = async () => {
    if (!form.code.trim()) {
      setError(
        "Category code is required."
      );

      return;
    }

    if (!form.name.trim()) {
      setError(
        "Category name is required."
      );

      return;
    }

    try {
      const url =
        editingCategory
          ? `${API_BASE_URL}/categories/${editingCategory.id}`
          : `${API_BASE_URL}/categories/`;

      const method =
        editingCategory
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
            "Failed to save category"
        );
      }

      setSuccess(
        editingCategory
          ? "Category updated successfully."
          : "Category created successfully."
      );

      handleClose();

      await loadCategories();
    } catch (err) {
      setError(
        err.message ||
          "Failed to save category"
      );
    }
  };

  /*
   * Delete category
   */
  const handleDelete = async (
    category
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${category.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await fetch(
          `${API_BASE_URL}/categories/${category.id}`,
          {
            method: "DELETE",
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
            "Failed to delete category"
        );
      }

      setSuccess(
        "Category deleted successfully."
      );

      await loadCategories();
    } catch (err) {
      setError(
        err.message ||
          "Failed to delete category"
      );
    }
  };

  /*
   * Search
   */
  const filteredCategories =
    categories.filter(
      (category) => {
        const text =
          search.toLowerCase();

        return (
          category.code
            ?.toLowerCase()
            .includes(text) ||
          category.name
            ?.toLowerCase()
            .includes(text) ||
          category.description
            ?.toLowerCase()
            .includes(text)
        );
      }
    );

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
            Category Master
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Manage product categories
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Category
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
            placeholder="Search category..."
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
                "70px 150px 1.5fr 2fr 110px 120px",
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

            <Box>Category Name</Box>

            <Box>Description</Box>

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
                Loading categories...
              </Typography>
            </Box>
          )}

          {/* EMPTY */}

          {!loading &&
            filteredCategories.length ===
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
                  No categories found
                </Typography>
              </Box>
            )}

          {/* ROWS */}

          {!loading &&
            filteredCategories.map(
              (category) => (
                <Box
                  key={category.id}
                  sx={{
                    display: "grid",

                    gridTemplateColumns:
                      "70px 150px 1.5fr 2fr 110px 120px",

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
                  <Box>
                    {category.id}
                  </Box>

                  <Box
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {category.code}
                  </Box>

                  <Box
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {category.name}
                  </Box>

                  <Box
                    sx={{
                      color:
                        "text.secondary",

                      overflow:
                        "hidden",

                      textOverflow:
                        "ellipsis",

                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {category.description ||
                      "-"}
                  </Box>

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
                          category.is_active
                            ? "#dcfce7"
                            : "#fee2e2",

                        color:
                          category.is_active
                            ? "#166534"
                            : "#991b1b",
                      }}
                    >
                      {category.is_active
                        ? "Active"
                        : "Inactive"}
                    </Typography>
                  </Box>

                  <Box>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() =>
                          handleEdit(
                            category
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
                            category
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
          {editingCategory
            ? "Edit Category"
            : "Add Category"}
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
              label="Category Code"
              name="code"
              value={form.code}
              onChange={
                handleChange
              }
              fullWidth
              required
            />

            <TextField
              label="Category Name"
              name="name"
              value={form.name}
              onChange={
                handleChange
              }
              fullWidth
              required
            />

            <TextField
              label="Description"
              name="description"
              value={
                form.description
              }
              onChange={
                handleChange
              }
              fullWidth
              multiline
              rows={3}
            />

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
                Active Category
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
            {editingCategory
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