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

export default function ColorPage() {
  const [colors, setColors] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [editingColor, setEditingColor] =
    useState(null);

  const [form, setForm] = useState({
    code: "",
    name: "",
    hex_code: "",
    is_active: true,
  });

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /*
   * Load colors
   */
  const loadColors = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/colors/`
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to load colors"
        );
      }

      setColors(data);
    } catch (err) {
      setError(
        err.message ||
          "Failed to load colors"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadColors();
  }, []);

  /*
   * Add
   */
  const handleAdd = () => {
    setEditingColor(null);

    setForm({
      code: "",
      name: "",
      hex_code: "",
      is_active: true,
    });

    setDialogOpen(true);
  };

  /*
   * Edit
   */
  const handleEdit = (color) => {
    setEditingColor(color);

    setForm({
      code: color.code || "",
      name: color.name || "",
      hex_code: color.hex_code || "",
      is_active:
        color.is_active !== false,
    });

    setDialogOpen(true);
  };

  /*
   * Close
   */
  const handleClose = () => {
    setDialogOpen(false);

    setEditingColor(null);
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
        "Color code is required."
      );

      return;
    }

    if (!form.name.trim()) {
      setError(
        "Color name is required."
      );

      return;
    }

    try {
      const url =
        editingColor
          ? `${API_BASE_URL}/colors/${editingColor.id}`
          : `${API_BASE_URL}/colors/`;

      const method =
        editingColor
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
            "Failed to save color"
        );
      }

      setSuccess(
        editingColor
          ? "Color updated successfully."
          : "Color created successfully."
      );

      handleClose();

      await loadColors();
    } catch (err) {
      setError(
        err.message ||
          "Failed to save color"
      );
    }
  };

  /*
   * Delete
   */
  const handleDelete = async (
    color
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${color.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await fetch(
          `${API_BASE_URL}/colors/${color.id}`,
          {
            method: "DELETE",
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
            "Failed to delete color"
        );
      }

      setSuccess(
        "Color deleted successfully."
      );

      await loadColors();
    } catch (err) {
      setError(
        err.message ||
          "Failed to delete color"
      );
    }
  };

  /*
   * Search
   */
  const filteredColors =
    colors.filter((color) => {
      const text =
        search.toLowerCase();

      return (
        color.code
          ?.toLowerCase()
          .includes(text) ||
        color.name
          ?.toLowerCase()
          .includes(text) ||
        color.hex_code
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
            Color Master
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Manage product colors
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Color
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
            placeholder="Search color..."
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
                "70px 150px 1.5fr 150px 110px 120px",
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

            <Box>Color Name</Box>

            <Box>Color</Box>

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
                Loading colors...
              </Typography>
            </Box>
          )}

          {/* EMPTY */}

          {!loading &&
            filteredColors.length ===
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
                  No colors found
                </Typography>
              </Box>
            )}

          {/* ROWS */}

          {!loading &&
            filteredColors.map(
              (color) => (
                <Box
                  key={color.id}
                  sx={{
                    display: "grid",

                    gridTemplateColumns:
                      "70px 150px 1.5fr 150px 110px 120px",

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
                    {color.id}
                  </Box>

                  {/* CODE */}

                  <Box
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {color.code}
                  </Box>

                  {/* NAME */}

                  <Box
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {color.name}
                  </Box>

                  {/* COLOR */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius:
                          "50%",
                        backgroundColor:
                          color.hex_code ||
                          "#e2e8f0",
                        border:
                          "1px solid #cbd5e1",
                      }}
                    />

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {color.hex_code ||
                        "-"}
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
                          color.is_active
                            ? "#dcfce7"
                            : "#fee2e2",

                        color:
                          color.is_active
                            ? "#166534"
                            : "#991b1b",
                      }}
                    >
                      {color.is_active
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
                            color
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
                            color
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

      {/* ADD / EDIT */}

      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingColor
            ? "Edit Color"
            : "Add Color"}
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
              label="Color Code"
              name="code"
              value={form.code}
              onChange={
                handleChange
              }
              fullWidth
              required
            />

            <TextField
              label="Color Name"
              name="name"
              value={form.name}
              onChange={
                handleChange
              }
              fullWidth
              required
            />

            <TextField
              label="Hex Color"
              name="hex_code"
              value={
                form.hex_code
              }
              onChange={
                handleChange
              }
              fullWidth
              placeholder="#FF0000"
              inputProps={{
                maxLength: 10,
              }}
            />

            {/* COLOR PICKER */}

            <Box
              sx={{
                display: "flex",
                alignItems:
                  "center",
                gap: 2,
              }}
            >
              <input
                type="color"
                value={
                  /^#[0-9A-Fa-f]{6}$/.test(
                    form.hex_code
                  )
                    ? form.hex_code
                    : "#000000"
                }
                onChange={(event) =>
                  setForm(
                    (prev) => ({
                      ...prev,
                      hex_code:
                        event.target
                          .value
                        ,
                    })
                  )
                }
                style={{
                  width: 55,
                  height: 40,
                  border: "none",
                  cursor: "pointer",
                }}
              />

              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  backgroundColor:
                    form.hex_code ||
                    "#e2e8f0",
                  border:
                    "1px solid #cbd5e1",
                }}
              />

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Select color
              </Typography>
            </Box>

            {/* ACTIVE */}

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
                Active Color
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
            {editingColor
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
