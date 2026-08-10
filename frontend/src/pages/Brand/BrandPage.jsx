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

const API_BASE_URL =
  "http://127.0.0.1:8000";

export default function BrandPage() {
  const [brands, setBrands] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [editingBrand, setEditingBrand] =
    useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    logo: "",
    is_active: true,
  });

  const [selectedLogo, setSelectedLogo] =
    useState(null);

  const [logoPreview, setLogoPreview] =
    useState("");

  const logoInputRef = useRef(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /*
   * Load brands
   */
  const loadBrands = async () => {
    try {
      setLoading(true);

      const data = await getBrands();

      setBrands(data);
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

  /*
   * Open Add
   */
  const handleAdd = () => {
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

  /*
   * Open Edit
   */
  const handleEdit = (brand) => {
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

  /*
   * Close dialog
   */
  const handleClose = () => {
    setDialogOpen(false);

    setEditingBrand(null);

    setSelectedLogo(null);
    setLogoPreview("");

    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  /*
   * Form change
   */
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

  /*
   * Select logo
   */
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

  /*
   * Save brand
   */
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
              name: form.name,
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
            name: form.name,
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

      /*
       * Upload selected logo after
       * brand has an ID.
       */
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

  /*
   * Delete brand
   */
  const handleDelete = async (
    brand
  ) => {
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

      await loadBrands();
    } catch (err) {
      setError(
        err.message ||
          "Failed to delete brand."
      );
    }
  };

  /*
   * Remove logo
   */
  const handleRemoveLogo = async () => {
    /*
     * If a new logo has been selected
     * but not uploaded yet, just remove
     * the preview.
     */
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

    /*
     * Existing logo
     */
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

  /*
   * Filter brands
   */
  const filteredBrands =
    brands.filter((brand) => {
      const text =
        search.toLowerCase();

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

  /*
   * Logo URL
   */
  const getLogoUrl = (logo) => {
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

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      {/* =====================================
          HEADER
      ====================================== */}

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
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Brand
        </Button>
      </Box>

      {/* =====================================
          SEARCH
      ====================================== */}

      <Card
        sx={{
          mb: 2,
        }}
      >
        <CardContent>
          <TextField
            fullWidth
            size="small"
            placeholder="Search brand..."
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

      {/* =====================================
          TABLE
      ====================================== */}

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
                textAlign: "center",
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
                  textAlign: "center",
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
                    display: "grid",

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
                          display: "flex",
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

      {/* =====================================
          ADD / EDIT DIALOG
      ====================================== */}

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
                        boxShadow:
                          2,
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
                      display: "flex",
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
                JPG, PNG, WEBP — maximum
                2 MB
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