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
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";

const API_BASE_URL = "http://127.0.0.1:8000";

const EMPTY_FORM = {
  product_id: "",
  color_id: "",
  size_id: "",
  stock: 0,
};

export default function ProductVariantPage() {
  const [variants, setVariants] = useState([]);
  const [products, setProducts] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);

  const [form, setForm] = useState({
    ...EMPTY_FORM,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // LOAD VARIANTS
  // =====================================================

  const loadVariants = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/product-variants/`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load variants"
        );
      }

      setVariants(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to load variants"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  const loadProducts = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products/`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load products"
        );
      }

      setProducts(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to load products"
      );
    }
  };

  // =====================================================
  // LOAD COLORS
  // =====================================================

  const loadColors = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/colors/`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load colors"
        );
      }

      setColors(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to load colors"
      );
    }
  };

  // =====================================================
  // LOAD SIZES
  // =====================================================

  const loadSizes = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sizes/`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load sizes"
        );
      }

      setSizes(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message || "Failed to load sizes"
      );
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadVariants();
    loadProducts();
    loadColors();
    loadSizes();
  }, []);

  // =====================================================
  // ADD VARIANT
  // =====================================================

  const handleAdd = () => {
    setEditingVariant(null);

    setForm({
      ...EMPTY_FORM,
    });

    setDialogOpen(true);
  };

  // =====================================================
  // EDIT VARIANT
  // =====================================================

  const handleEdit = (variant) => {
    setEditingVariant(variant);

    setForm({
      product_id: variant.product_id ?? "",
      color_id: variant.color_id ?? "",
      size_id: variant.size_id ?? "",
      stock: variant.stock ?? 0,
    });

    setDialogOpen(true);
  };

  // =====================================================
  // CLOSE DIALOG
  // =====================================================

  const handleClose = () => {
    if (saving) {
      return;
    }

    setDialogOpen(false);
    setEditingVariant(null);

    setForm({
      ...EMPTY_FORM,
    });
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // BACKEND ERROR
  // =====================================================

  const getBackendError = (result) => {
    if (!result) {
      return "Something went wrong.";
    }

    if (Array.isArray(result.detail)) {
      return result.detail
        .map((item) => {
          const location =
            Array.isArray(item.loc)
              ? item.loc.join(" → ")
              : "";

          return location
            ? `${location}: ${item.msg}`
            : item.msg;
        })
        .join("\n");
    }

    if (typeof result.detail === "string") {
      return result.detail;
    }

    return "Unable to save variant.";
  };

  // =====================================================
  // VALIDATE
  // =====================================================

  const validateForm = () => {
    if (!form.product_id) {
      return "Please select Product.";
    }

    if (!form.color_id) {
      return "Please select Color.";
    }

    if (!form.size_id) {
      return "Please select Size.";
    }

    if (
      form.stock === "" ||
      form.stock === null ||
      form.stock === undefined
    ) {
      return "Opening Stock is required.";
    }

    if (
      Number.isNaN(Number(form.stock)) ||
      Number(form.stock) < 0
    ) {
      return "Opening Stock must be a valid number.";
    }

    return null;
  };

  // =====================================================
  // SAVE / UPDATE VARIANT
  // =====================================================

  const handleSave = async () => {
    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);

      /*
       * Backend ProductVariantCreate:
       *
       * product_id
       * color_id
       * size_id
       * stock
       */

      const payload = {
        product_id: Number(
          form.product_id
        ),

        color_id: Number(
          form.color_id
        ),

        size_id: Number(
          form.size_id
        ),

        stock: Number(
          form.stock
        ),
      };

      console.log(
        "VARIANT PAYLOAD:",
        payload
      );

      let url;
      let method;

      if (editingVariant) {
        url =
          `${API_BASE_URL}/product-variants/` +
          `${editingVariant.id}`;

        method = "PUT";

        /*
         * Existing backend ProductVariantUpdate
         * only updates color_id and size_id.
         *
         * Therefore stock is NOT sent during edit.
         * Stock changes will be handled through
         * Stock Ledger.
         */

        const updatePayload = {
          color_id: Number(
            form.color_id
          ),

          size_id: Number(
            form.size_id
          ),
        };

        const response = await fetch(
          url,
          {
            method,
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              updatePayload
            ),
          }
        );

        const result =
          await response.json();

        console.log(
          "VARIANT UPDATE STATUS:",
          response.status
        );

        console.log(
          "VARIANT UPDATE RESPONSE:",
          result
        );

        if (!response.ok) {
          throw new Error(
            getBackendError(result)
          );
        }

        setSuccess(
          "Variant updated successfully."
        );
      } else {
        const response = await fetch(
          `${API_BASE_URL}/product-variants/`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload
            ),
          }
        );

        const result =
          await response.json();

        console.log(
          "VARIANT CREATE STATUS:",
          response.status
        );

        console.log(
          "VARIANT CREATE RESPONSE:",
          result
        );

        if (!response.ok) {
          throw new Error(
            getBackendError(result)
          );
        }

        setSuccess(
          "Variant created successfully."
        );
      }

      setDialogOpen(false);
      setEditingVariant(null);

      setForm({
        ...EMPTY_FORM,
      });

      await loadVariants();
    } catch (err) {
      console.error(
        "VARIANT SAVE ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to save variant."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (
    variant
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this variant and its stock ledger entries?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/product-variants/${variant.id}`,
        {
          method: "DELETE",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          getBackendError(result)
        );
      }

      setSuccess(
        "Variant deleted successfully."
      );

      await loadVariants();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to delete variant."
      );
    }
  };

  // =====================================================
  // PRODUCT NAME
  // =====================================================

  const getProductName = (id) => {
    const product =
      products.find(
        (item) =>
          Number(item.id) ===
          Number(id)
      );

    if (!product) {
      return "-";
    }

    return `${product.sku} - ${product.name}`;
  };

  // =====================================================
  // COLOR NAME
  // =====================================================

  const getColorName = (id) => {
    const color =
      colors.find(
        (item) =>
          Number(item.id) ===
          Number(id)
      );

    return color?.name || "-";
  };

  // =====================================================
  // SIZE NAME
  // =====================================================

  const getSizeName = (id) => {
    const size =
      sizes.find(
        (item) =>
          Number(item.id) ===
          Number(id)
      );

    return size?.name || "-";
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const searchText =
    search.trim().toLowerCase();

  const filteredVariants =
    variants.filter(
      (variant) => {
        if (!searchText) {
          return true;
        }

        const product =
          getProductName(
            variant.product_id
          ).toLowerCase();

        const color =
          getColorName(
            variant.color_id
          ).toLowerCase();

        const size =
          getSizeName(
            variant.size_id
          ).toLowerCase();

        return (
          product.includes(
            searchText
          ) ||
          color.includes(
            searchText
          ) ||
          size.includes(
            searchText
          )
        );
      }
    );

  // =====================================================
  // UI
  // =====================================================

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      {/* PAGE HEADER */}

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
            Product Variant Master
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Manage Product, Color, Size
            and Opening Stock
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Variant
        </Button>
      </Box>

      {/* SEARCH */}

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <TextField
            fullWidth
            size="small"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search Product, Color or Size..."
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
            overflowX: "auto",
          }}
        >
          {/* HEADER */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "60px minmax(250px, 1.5fr) 1fr 1fr 100px 110px",
              alignItems: "center",
              minWidth: 850,
              px: 2,
              py: 1.5,
              backgroundColor:
                "#f1f5f9",
              borderBottom:
                "1px solid #e2e8f0",
              fontWeight: 700,
            }}
          >
            <Box>ID</Box>

            <Box>Product</Box>

            <Box>Color</Box>

            <Box>Size</Box>

            <Box>Stock</Box>

            <Box>Action</Box>
          </Box>

          {/* LOADING */}

          {loading && (
            <Box
              sx={{
                p: 5,
                textAlign: "center",
              }}
            >
              <Typography>
                Loading variants...
              </Typography>
            </Box>
          )}

          {/* EMPTY */}

          {!loading &&
            filteredVariants.length ===
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
                  {searchText
                    ? "No matching variants found."
                    : "No variants found."}
                </Typography>
              </Box>
            )}

          {/* ROWS */}

          {!loading &&
            filteredVariants.map(
              (variant) => (
                <Box
                  key={variant.id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "60px minmax(250px, 1.5fr) 1fr 1fr 100px 110px",
                    alignItems: "center",
                    minWidth: 850,
                    px: 2,
                    py: 1.5,
                    borderBottom:
                      "1px solid #e2e8f0",
                    "&:hover": {
                      backgroundColor:
                        "#f8fafc",
                    },
                  }}
                >
                  <Box>
                    {variant.id}
                  </Box>

                  <Box
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {getProductName(
                      variant.product_id
                    )}
                  </Box>

                  <Box>
                    {getColorName(
                      variant.color_id
                    )}
                  </Box>

                  <Box>
                    {getSizeName(
                      variant.size_id
                    )}
                  </Box>

                  <Box
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {variant.stock ?? 0}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    <Tooltip title="Edit Variant">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() =>
                          handleEdit(
                            variant
                          )
                        }
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Variant">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                          handleDelete(
                            variant
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
          {editingVariant
            ? "Edit Product Variant"
            : "Add Product Variant"}
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              pt: 1,
            }}
          >
            {/* PRODUCT */}

            <TextField
              select
              fullWidth
              label="Product"
              name="product_id"
              value={
                form.product_id
              }
              onChange={
                handleChange
              }
              required
            >
              <MenuItem value="">
                Select Product
              </MenuItem>

              {products.map(
                (product) => (
                  <MenuItem
                    key={product.id}
                    value={product.id}
                  >
                    {product.sku} -{" "}
                    {product.name}
                  </MenuItem>
                )
              )}
            </TextField>

            {/* COLOR */}

            <TextField
              select
              fullWidth
              label="Color"
              name="color_id"
              value={
                form.color_id
              }
              onChange={
                handleChange
              }
              required
            >
              <MenuItem value="">
                Select Color
              </MenuItem>

              {colors.map(
                (color) => (
                  <MenuItem
                    key={color.id}
                    value={color.id}
                  >
                    {color.code} -{" "}
                    {color.name}
                  </MenuItem>
                )
              )}
            </TextField>

            {/* SIZE */}

            <TextField
              select
              fullWidth
              label="Size"
              name="size_id"
              value={
                form.size_id
              }
              onChange={
                handleChange
              }
              required
            >
              <MenuItem value="">
                Select Size
              </MenuItem>

              {sizes.map(
                (size) => (
                  <MenuItem
                    key={size.id}
                    value={size.id}
                  >
                    {size.code} -{" "}
                    {size.name}
                  </MenuItem>
                )
              )}
            </TextField>

            {/* OPENING STOCK */}

            <TextField
              label="Opening Stock"
              name="stock"
              type="number"
              value={form.stock}
              onChange={
                handleChange
              }
              fullWidth
              required
              inputProps={{
                min: 0,
                step: 1,
              }}
              helperText="Opening stock will be recorded in Stock Ledger."
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingVariant
              ? "Update Variant"
              : "Save Variant"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ERROR */}

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={7000}
        onClose={() =>
          setError("")
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity="error"
          onClose={() =>
            setError("")
          }
          sx={{
            whiteSpace: "pre-line",
          }}
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
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
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