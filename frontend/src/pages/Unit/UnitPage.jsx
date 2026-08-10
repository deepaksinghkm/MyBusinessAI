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

export default function UnitPage() {
  const [units, setUnits] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [editingUnit, setEditingUnit] =
    useState(null);

  const [form, setForm] = useState({
    code: "",
    name: "",
    short_name: "",
    is_active: true,
  });

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /*
   * Load units
   */
  const loadUnits = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/units/`
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to load units"
        );
      }

      setUnits(data);
    } catch (err) {
      setError(
        err.message ||
          "Failed to load units"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUnits();
  }, []);

  /*
   * Add unit
   */
  const handleAdd = () => {
    setEditingUnit(null);

    setForm({
      code: "",
      name: "",
      short_name: "",
      is_active: true,
    });

    setDialogOpen(true);
  };

  /*
   * Edit unit
   */
  const handleEdit = (unit) => {
    setEditingUnit(unit);

    setForm({
      code: unit.code || "",
      name: unit.name || "",
      short_name:
        unit.short_name || "",
      is_active:
        unit.is_active !== false,
    });

    setDialogOpen(true);
  };

  /*
   * Close dialog
   */
  const handleClose = () => {
    setDialogOpen(false);

    setEditingUnit(null);
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
   * Save unit
   */
  const handleSave = async () => {
    if (!form.code.trim()) {
      setError(
        "Unit code is required."
      );

      return;
    }

    if (!form.name.trim()) {
      setError(
        "Unit name is required."
      );

      return;
    }

    if (!form.short_name.trim()) {
      setError(
        "Short name is required."
      );

      return;
    }

    try {
      const url =
        editingUnit
          ? `${API_BASE_URL}/units/${editingUnit.id}`
          : `${API_BASE_URL}/units/`;

      const method =
        editingUnit
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
            "Failed to save unit"
        );
      }

      setSuccess(
        editingUnit
          ? "Unit updated successfully."
          : "Unit created successfully."
      );

      handleClose();

      await loadUnits();
    } catch (err) {
      setError(
        err.message ||
          "Failed to save unit"
      );
    }
  };

  /*
   * Delete unit
   */
  const handleDelete = async (
    unit
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${unit.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await fetch(
          `${API_BASE_URL}/units/${unit.id}`,
          {
            method: "DELETE",
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
            "Failed to delete unit"
        );
      }

      setSuccess(
        "Unit deleted successfully."
      );

      await loadUnits();
    } catch (err) {
      setError(
        err.message ||
          "Failed to delete unit"
      );
    }
  };

  /*
   * Search
   */
  const filteredUnits =
    units.filter((unit) => {
      const text =
        search.toLowerCase();

      return (
        unit.code
          ?.toLowerCase()
          .includes(text) ||
        unit.name
          ?.toLowerCase()
          .includes(text) ||
        unit.short_name
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
            Unit Master
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Manage product units
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Unit
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
            placeholder="Search unit..."
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

            <Box>Unit Name</Box>

            <Box>Short Name</Box>

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
                Loading units...
              </Typography>
            </Box>
          )}

          {/* EMPTY */}

          {!loading &&
            filteredUnits.length ===
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
                  No units found
                </Typography>
              </Box>
            )}

          {/* ROWS */}

          {!loading &&
            filteredUnits.map(
              (unit) => (
                <Box
                  key={unit.id}
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
                  <Box>
                    {unit.id}
                  </Box>

                  <Box
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {unit.code}
                  </Box>

                  <Box
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {unit.name}
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
                          "#f1f5f9",
                        color:
                          "#334155",
                      }}
                    >
                      {unit.short_name}
                    </Typography>
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
                          unit.is_active
                            ? "#dcfce7"
                            : "#fee2e2",

                        color:
                          unit.is_active
                            ? "#166534"
                            : "#991b1b",
                      }}
                    >
                      {unit.is_active
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
                            unit
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
                            unit
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
          {editingUnit
            ? "Edit Unit"
            : "Add Unit"}
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
              label="Unit Code"
              name="code"
              value={form.code}
              onChange={
                handleChange
              }
              fullWidth
              required
            />

            <TextField
              label="Unit Name"
              name="name"
              value={form.name}
              onChange={
                handleChange
              }
              fullWidth
              required
            />

            <TextField
              label="Short Name"
              name="short_name"
              value={
                form.short_name
              }
              onChange={
                handleChange
              }
              fullWidth
              required
              placeholder="e.g. Pair"
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
                Active Unit
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
            {editingUnit
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
