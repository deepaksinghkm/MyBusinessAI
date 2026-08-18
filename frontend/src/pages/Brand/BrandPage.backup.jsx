import { useEffect, useRef, useState } from "react";

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
import ImageIcon from "@mui/icons-material/Image";
import SearchIcon from "@mui/icons-material/Search";
import UploadIcon from "@mui/icons-material/Upload";

import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandLogo,
  deleteBrandLogo,
} from "../../api/brandApi";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function BrandPage() {
  // =========================================================
  // DATA
  // =========================================================

  const [brands, setBrands] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================================================
  // SEARCH
  // =========================================================

  const [search, setSearch] = useState("");

  const searchInputRef = useRef(null);

  // shortcut mode:
  // null
  // modify
  // delete
  const [shortcutMode, setShortcutMode] =
    useState(null);

  // =========================================================
  // DIALOG
  // =========================================================

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [editingBrand, setEditingBrand] =
    useState(null);

  // =========================================================
  // FORM
  // =========================================================

  const [form, setForm] = useState({
    name: "",
    description: "",
    logo: "",
    is_active: true,
  });

  // =========================================================
  // LOGO
  // =========================================================

  const [selectedLogo, setSelectedLogo] =
    useState(null);

  const [logoPreview, setLogoPreview] =
    useState("");

  const logoInputRef = useRef(null);

  // =========================================================
  // MESSAGES
  // =========================================================

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // =========================================================
  // LOAD BRANDS
  // =========================================================

  const loadBrands = async () => {
    try {
      setLoading(true);

      const data = await getBrands();

      setBrands(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.message ||
          "Failed to load brands"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  // =========================================================
  // ADD
  // F4
  // =========================================================

  const handleAdd = () => {
    setShortcutMode(null);

    setEditingBrand(null);

    setForm({
      name: "",
      description: "",
      logo: "",
      is_active: true,
    });

    setSelectedLogo(null);

    setLogoPreview("");

    setDialogOpen(true);
  };

  // =========================================================
  // EDIT
  // =========================================================

  const handleEdit = (brand) => {
    if (!brand) {
      setError("Please select a brand first.");
      return;
    }

    setShortcutMode(null);

    setEditingBrand(brand);

    setForm({
      name: brand.name || "",
      description:
        brand.description || "",
      logo: brand.logo || "",
      is_active:
        brand.is_active !== false,
    });

    setSelectedLogo(null);

    if (brand.logo) {
      setLogoPreview(
        `${API_BASE_URL}${brand.logo}`
      );
    } else {
      setLogoPreview("");
    }

    setDialogOpen(true);
  };

  // =========================================================
  // CLOSE
  // ESC
  // =========================================================

  const handleClose = () => {
    setDialogOpen(false);

    setEditingBrand(null);

    setSelectedLogo(null);

    setLogoPreview("");

    setShortcutMode(null);

    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // LOGO SELECT
  // =========================================================

  const handleLogoSelect = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith("image/")
    ) {
      setError(
        "Please select an image file."
      );

      event.target.value = "";

      return;
    }

    if (
      file.size >
      2 * 1024 * 1024
    ) {
      setError(
        "Logo must be 2 MB or smaller."
      );

      event.target.value = "";

      return;
    }

    setSelectedLogo(file);

    const previewUrl =
      URL.createObjectURL(file);

    setLogoPreview(previewUrl);
  };

  // =========================================================
  // SAVE
  // =========================================================

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError(
        "Brand name is required."
      );

      return;
    }

    try {
      let savedBrand;

      if (editingBrand) {
        savedBrand =
          await updateBrand(
            editingBrand.id,
            {
              name: form.name.trim(),
              description:
                form.description,
              logo: form.logo,
              is_active:
                form.is_active,
            }
          );

        setSuccess(
          "Brand updated successfully."
        );
      } else {
        savedBrand =
          await createBrand({
            name: form.name.trim(),
            description:
              form.description,
            logo: form.logo,
            is_active:
              form.is_active,
          });

        setSuccess(
          "Brand created successfully."
        );
      }

      // Upload selected logo
      if (selectedLogo) {
        await uploadBrandLogo(
          savedBrand.id,
          selectedLogo
        );
      }

      handleClose();

      await loadBrands();
    } catch (err) {
      setError(
        err.message ||
          "Failed to save brand."
      );
    }
  };

  // =========================================================
  // DELETE
  // F3
  // =========================================================

  const handleDelete = async (
    brand
  ) => {
    if (!brand) {
      setError(
        "Please select a brand first."
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${brand.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteBrand(
        brand.id
      );

      setSuccess(
        "Brand deleted successfully."
      );

      setSearch("");

      setShortcutMode(null);

      await loadBrands();
    } catch (err) {
      setError(
        err.message ||
          "Failed to delete brand."
      );
    }
  };

  // =========================================================
  // REMOVE LOGO
  // =========================================================

  const handleRemoveLogo = async () => {
    // New logo selected but not uploaded
    if (
      selectedLogo &&
      editingBrand
    ) {
      setSelectedLogo(null);

      if (editingBrand.logo) {
        setLogoPreview(
          `${API_BASE_URL}${editingBrand.logo}`
        );
      } else {
        setLogoPreview("");
      }

      if (logoInputRef.current) {
        logoInputRef.current.value =
          "";
      }

      return;
    }

    // Existing logo
    if (
      editingBrand &&
      editingBrand.logo
    ) {
      try {
        await deleteBrandLogo(
          editingBrand.id
        );

        setForm((prev) => ({
          ...prev,
          logo: "",
        }));

        setLogoPreview("");

        setEditingBrand(
          (prev) => ({
            ...prev,
            logo: null,
          })
        );

        setSuccess(
          "Brand logo removed."
        );

        await loadBrands();
      } catch (err) {
        setError(
          err.message ||
            "Failed to remove logo."
        );
      }

      return;
    }

    setSelectedLogo(null);

    setLogoPreview("");

    if (logoInputRef.current) {
      logoInputRef.current.value =
        "";
    }
  };

  // =========================================================
  // FILTER
  // =========================================================

  const filteredBrands =
    brands.filter((brand) => {
      const text =
        search
          .toLowerCase()
          .trim();

      if (!text) {
        return true;
      }

      return (
        brand.name
          ?.toLowerCase()
          .includes(text) ||
        brand.code
          ?.toLowerCase()
          .includes(text) ||
        brand.description
          ?.toLowerCase()
          .includes(text)
      );
    });

  // =========================================================
  // GET FIRST MATCH
  // =========================================================

  const getFirstMatchingBrand =
    () => {
      const text =
        search
          .toLowerCase()
          .trim();

      if (!text) {
        return null;
      }

      return (
        brands.find((brand) => {
          const name =
            brand.name
              ?.toLowerCase() || "";

          const code =
            brand.code
              ?.toLowerCase() || "";

          return (
            name === text ||
            code === text
          );
        }) ||
        filteredBrands[0] ||
        null
      );
    };

  // =========================================================
  // F2 MODIFY
  // =========================================================

  const startModifyMode = () => {
    setShortcutMode("modify");

    setSuccess(
      "Modify mode: enter Brand Name or Code and press Enter."
    );

    setTimeout(() => {
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    }, 50);
  };

  // =========================================================
  // F3 DELETE
  // =========================================================

  const startDeleteMode = () => {
    setShortcutMode("delete");

    setSuccess(
      "Delete mode: enter Brand Name or Code and press Enter."
    );

    setTimeout(() => {
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    }, 50);
  };

  // =========================================================
  // ENTER IN SEARCH
  // =========================================================

  const handleSearchKeyDown = (
    event
  ) => {
    if (event.key !== "Enter") {
      return;
    }

    if (!shortcutMode) {
      return;
    }

    event.preventDefault();

    const brand =
      getFirstMatchingBrand();

    if (!brand) {
      setError(
        "No matching brand found."
      );

      return;
    }

    if (
      shortcutMode === "modify"
    ) {
      handleEdit(brand);

      return;
    }

    if (
      shortcutMode === "delete"
    ) {
      handleDelete(brand);

      return;
    }
  };

  // =========================================================
  // F6 CLEAR
  // =========================================================

  const handleClear = () => {
    setSearch("");

    setShortcutMode(null);

    setForm({
      name: "",
      description: "",
      logo: "",
      is_active: true,
    });

    setEditingBrand(null);

    setSelectedLogo(null);

    setLogoPreview("");

    if (logoInputRef.current) {
      logoInputRef.current.value =
        "";
    }

    if (dialogOpen) {
      setDialogOpen(false);
    }

    setSuccess("Form cleared.");

    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);
  };

  // =========================================================
  // GLOBAL KEYBOARD SHORTCUTS
  // =========================================================

  useEffect(() => {
    const handleKeyDown = (
      event
    ) => {
      // F4 = ADD
      if (event.key === "F4") {
        event.preventDefault();

        handleAdd();

        return;
      }

      // F2 = MODIFY
      if (event.key === "F2") {
        event.preventDefault();

        startModifyMode();

        return;
      }

      // F3 = DELETE
      if (event.key === "F3") {
        event.preventDefault();

        startDeleteMode();

        return;
      }

      // F6 = CLEAR
      if (event.key === "F6") {
        event.preventDefault();

        handleClear();

        return;
      }

      // ESC = CLOSE
      if (
        event.key === "Escape"
      ) {
        if (dialogOpen) {
          event.preventDefault();

          handleClose();

          return;
        }

        if (shortcutMode) {
          event.preventDefault();

          setShortcutMode(null);

          setSearch("");

          return;
        }
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    dialogOpen,
    shortcutMode,
    search,
    brands,
    filteredBrands,
  ]);

  // =========================================================
  // LOGO URL
  // =========================================================

  const getLogoUrl = (
    logo
  ) => {
    if (!logo) {
      return "";
    }

    if (
      logo.startsWith("http")
    ) {
      return logo;
    }

    return `${API_BASE_URL}${logo}`;
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

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
            Brand Master
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Manage brands, logos and status
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={
            <AddIcon />
          }
          onClick={handleAdd}
        >
          Add Brand
        </Button>
      </Box>

      {/* =====================================================
          SHORTCUT BAR
      ====================================================== */}

      <Card
        sx={{
          mb: 2,
          border:
            shortcutMode
              ? "2px solid #1976d2"
              : undefined,
        }}
      >
        <CardContent
          sx={{
            py: 1.2,
            "&:last-child": {
              pb: 1.2,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems:
                "center",
              gap: 1,
              flexWrap:
                "wrap",
            }}
          >
            <Shortcut
              keyName="F4"
              label="Add"
            />

            <Shortcut
              keyName="F2"
              label="Modify"
            />

            <Shortcut
              keyName="F3"
              label="Delete"
            />

            <Shortcut
              keyName="F6"
              label="Clear"
            />

            <Shortcut
              keyName="Esc"
              label="Close"
            />

            {shortcutMode && (
              <Typography
                sx={{
                  ml: 1,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1976d2",
                }}
              >
                {shortcutMode ===
                "modify"
                  ? "MODIFY MODE — enter Brand Name/Code and press Enter"
                  : "DELETE MODE — enter Brand Name/Code and press Enter"}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* =====================================================
          SEARCH
      ====================================================== */}

      <Card
        sx={{
          mb: 2,
        }}
      >
        <CardContent>
          <TextField
            inputRef={
              searchInputRef
            }
            fullWidth
            size="small"
            placeholder={
              shortcutMode
                ? shortcutMode ===
                  "modify"
                  ? "Enter Brand Name or Code and press Enter to Modify..."
                  : "Enter Brand Name or Code and press Enter to Delete..."
                : "Search brand..."
            }
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            onKeyDown={
              handleSearchKeyDown
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

      {/* =====================================================
          TABLE
      ====================================================== */}

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
                "60px 90px 1.4fr 2fr 110px 120px",
              bgcolor: "#f1f5f9",
              borderBottom:
                "1px solid #e2e8f0",
              px: 2,
              py: 1.5,
              fontWeight: 700,
            }}
          >
            <Box>ID</Box>

            <Box>Logo</Box>

            <Box>Brand</Box>

            <Box>Description</Box>

            <Box>Status</Box>

            <Box>Action</Box>
          </Box>

          {/* LOADING */}

          {loading && (
            <Box
              sx={{
                p: 4,
                textAlign:
                  "center",
              }}
            >
              <Typography>
                Loading brands...
              </Typography>
            </Box>
          )}

          {/* EMPTY */}

          {!loading &&
            filteredBrands.length ===
              0 && (
              <Box
                sx={{
                  p: 5,
                  textAlign:
                    "center",
                }}
              >
                <Typography
                  color="text.secondary"
                >
                  No brands found
                </Typography>
              </Box>
            )}

          {/* ROWS */}

          {!loading &&
            filteredBrands.map(
              (brand) => (
                <Box
                  key={brand.id}
                  sx={{
                    display:
                      "grid",
                    gridTemplateColumns:
                      "60px 90px 1.4fr 2fr 110px 120px",
                    alignItems:
                      "center",
                    px: 2,
                    py: 1.2,
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
                    {brand.id}
                  </Box>

                  {/* LOGO */}

                  <Box>
                    {brand.logo ? (
                      <Box
                        component="img"
                        src={getLogoUrl(
                          brand.logo
                        )}
                        alt={
                          brand.name
                        }
                        sx={{
                          width: 48,
                          height: 48,
                          objectFit:
                            "contain",
                          border:
                            "1px solid #e2e8f0",
                          borderRadius: 1,
                          bgcolor:
                            "#fff",
                          p: 0.5,
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          border:
                            "1px solid #e2e8f0",
                          borderRadius: 1,
                          bgcolor:
                            "#f8fafc",
                        }}
                      >
                        <ImageIcon
                          color="disabled"
                        />
                      </Box>
                    )}
                  </Box>

                  {/* BRAND */}

                  <Box>
                    <Typography
                      fontWeight={600}
                    >
                      {brand.name}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Code:{" "}
                      {brand.code ||
                        "-"}
                    </Typography>
                  </Box>

                  {/* DESCRIPTION */}

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
                    {brand.description ||
                      "-"}
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
                          brand.is_active
                            ? "#dcfce7"
                            : "#fee2e2",
                        color:
                          brand.is_active
                            ? "#166534"
                            : "#991b1b",
                      }}
                    >
                      {brand.is_active
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
                            brand
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
                            brand
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

      {/* =====================================================
          ADD / EDIT DIALOG
      ====================================================== */}

      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingBrand
            ? "Edit Brand"
            : "Add Brand"}
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
            {/* BRAND NAME */}

            <TextField
              autoFocus
              label="Brand Name"
              name="name"
              value={form.name}
              onChange={
                handleChange
              }
              fullWidth
              required
            />

            {/* DESCRIPTION */}

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

            {/* LOGO URL */}

            <TextField
              label="Logo URL"
              name="logo"
              value={form.logo}
              onChange={
                handleChange
              }
              fullWidth
              placeholder="Optional logo URL"
            />

            {/* LOGO */}

            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                }}
              >
                Brand Logo
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: 2,
                  flexWrap:
                    "wrap",
                }}
              >
                {/* PREVIEW */}

                {logoPreview ? (
                  <Box
                    sx={{
                      position:
                        "relative",
                    }}
                  >
                    <Box
                      component="img"
                      src={
                        logoPreview
                      }
                      alt="Brand logo"
                      sx={{
                        width: 100,
                        height: 100,
                        objectFit:
                          "contain",
                        border:
                          "1px solid #cbd5e1",
                        borderRadius: 2,
                        bgcolor:
                          "#fff",
                        p: 1,
                      }}
                    />

                    <IconButton
                      size="small"
                      color="error"
                      onClick={
                        handleRemoveLogo
                      }
                      sx={{
                        position:
                          "absolute",
                        top: -10,
                        right: -10,
                        bgcolor:
                          "#fff",
                        boxShadow: 2,
                        "&:hover": {
                          bgcolor:
                            "#fee2e2",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      border:
                        "1px dashed #94a3b8",
                      borderRadius: 2,
                      bgcolor:
                        "#f8fafc",
                    }}
                  >
                    <ImageIcon
                      color="disabled"
                    />
                  </Box>
                )}

                {/* UPLOAD */}

                <Button
                  component="label"
                  variant="outlined"
                  startIcon={
                    <UploadIcon />
                  }
                >
                  {logoPreview
                    ? "Change Logo"
                    : "Choose Logo"}

                  <input
                    ref={
                      logoInputRef
                    }
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={
                      handleLogoSelect
                    }
                  />
                </Button>
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  mt: 1,
                }}
              >
                JPG, PNG, WEBP —
                maximum 2 MB
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
                onChange={(event) =>
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
                Active Brand
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        {/* ACTIONS */}

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
            {editingBrand
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

/* =========================================================
   SHORTCUT COMPONENT
========================================================= */

function Shortcut({
  keyName,
  label,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.7,
      }}
    >
      <Box
        sx={{
          minWidth: 34,
          px: 0.8,
          py: 0.35,
          textAlign: "center",
          border:
            "1px solid #94a3b8",
          borderRadius: 0.7,
          bgcolor: "#ffffff",
          fontSize: 12,
          fontWeight: 800,
          color: "#334155",
        }}
      >
        {keyName}
      </Box>

      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          color: "#475569",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
