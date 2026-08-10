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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const API_BASE_URL = "http://127.0.0.1:8000";

const IMAGE_BASE_URL = "http://127.0.0.1:8000";

const EMPTY_FORM = {
  sku: "",
  name: "",
  brand_id: "",
  category_id: "",
  mrp: "",
  image: "",
  packing_qty: "",
  packing_type: "Carton",
  description: "",
};

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // LOAD PRODUCTS
  // =========================================================

  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/products/`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load products"
        );
      }

      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.message || "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD BRANDS
  // =========================================================

  const loadBrands = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/brands/`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load brands"
        );
      }

      setBrands(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.message || "Failed to load brands"
      );
    }
  };

  // =========================================================
  // LOAD CATEGORIES
  // =========================================================

  const loadCategories = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/categories/`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load categories"
        );
      }

      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.message || "Failed to load categories"
      );
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadProducts();
    loadBrands();
    loadCategories();
  }, []);

  // =========================================================
  // OPEN ADD
  // =========================================================

  const handleAdd = () => {
    setEditingProduct(null);

    setForm({
      ...EMPTY_FORM,
    });

    setDialogOpen(true);
  };

  // =========================================================
  // OPEN EDIT
  // =========================================================

  const handleEdit = (product) => {
    setEditingProduct(product);

    setForm({
      sku: product.sku ?? "",
      name: product.name ?? "",
      brand_id: product.brand_id ?? "",
      category_id: product.category_id ?? "",
      mrp: product.mrp ?? "",
      image: product.image ?? "",
      packing_qty: product.packing_qty ?? "",
      packing_type:
        product.packing_type ?? "Carton",
      description: product.description ?? "",
    });

    setDialogOpen(true);
  };

  // =========================================================
  // CLOSE DIALOG
  // =========================================================

  const handleClose = () => {
    if (saving || uploadingImage) {
      return;
    }

    setDialogOpen(false);
    setEditingProduct(null);
    setForm({
      ...EMPTY_FORM,
    });
  };

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // IMAGE UPLOAD
  // =========================================================

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // 150 KB check
    if (file.size > 150 * 1024) {
      setError(
        "Image must be under 150 KB."
      );

      event.target.value = "";
      return;
    }

    // File type check
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, JPEG and PNG images are allowed."
      );

      event.target.value = "";
      return;
    }

    try {
      setUploadingImage(true);

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        `${API_BASE_URL}/product-images/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
            "Image upload failed"
        );
      }

      /*
       * Backend returns:
       * {
       *   filename: "...",
       *   path: "/uploads/products/..."
       * }
       */

      setForm((previous) => ({
        ...previous,
        image: result.path || "",
      }));

      setSuccess(
        "Product image uploaded successfully."
      );
    } catch (err) {
      setError(
        err.message ||
          "Image upload failed"
      );
    } finally {
      setUploadingImage(false);

      event.target.value = "";
    }
  };

  // =========================================================
  // VALIDATE FORM
  // =========================================================

  const validateForm = () => {
    if (!form.sku.trim()) {
      return "SKU is required.";
    }

    if (!form.name.trim()) {
      return "Product Name is required.";
    }

    if (!form.brand_id) {
      return "Please select Brand.";
    }

    if (!form.category_id) {
      return "Please select Category.";
    }

    if (
      form.mrp === "" ||
      form.mrp === null ||
      form.mrp === undefined
    ) {
      return "MRP is required.";
    }

    if (
      Number.isNaN(Number(form.mrp)) ||
      Number(form.mrp) < 0
    ) {
      return "MRP must be a valid number.";
    }

    if (!form.image.trim()) {
      return "Please upload Product Image.";
    }

    if (
      form.packing_qty === "" ||
      form.packing_qty === null ||
      form.packing_qty === undefined
    ) {
      return "Packing Quantity is required.";
    }

    if (
      Number.isNaN(Number(form.packing_qty)) ||
      Number(form.packing_qty) < 0
    ) {
      return "Packing Quantity must be a valid number.";
    }

    if (!form.packing_type.trim()) {
      return "Packing Type is required.";
    }

    return null;
  };

  // =========================================================
  // FORMAT BACKEND ERROR
  // =========================================================

  const getBackendError = (result) => {
    if (!result) {
      return "Something went wrong.";
    }

    if (Array.isArray(result.detail)) {
      return result.detail
        .map((item) => {
          const location = Array.isArray(item.loc)
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

    return "Unable to save product.";
  };

  // =========================================================
  // SAVE / UPDATE PRODUCT
  // =========================================================

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
       * IMPORTANT:
       * ProductCreate backend expects:
       *
       * sku: str
       * name: str
       * brand_id: int
       * category_id: int
       * mrp: int
       * image: str
       * packing_qty: int
       * packing_type: str
       * description: str | None
       */

      const payload = {
        sku: String(form.sku).trim(),

        name: String(form.name).trim(),

        brand_id: Number(form.brand_id),

        category_id: Number(form.category_id),

        mrp: Number(form.mrp),

        image: String(form.image).trim(),

        packing_qty: Number(
          form.packing_qty
        ),

        packing_type:
          String(form.packing_type).trim(),

        description:
          form.description &&
          String(form.description).trim()
            ? String(form.description).trim()
            : null,
      };

      console.log(
        "PRODUCT PAYLOAD:",
        payload
      );

      const url = editingProduct
        ? `${API_BASE_URL}/products/${editingProduct.id}`
        : `${API_BASE_URL}/products/`;

      const method = editingProduct
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(payload),
      });

      const result = await response.json();

      console.log(
        "PRODUCT API STATUS:",
        response.status
      );

      console.log(
        "PRODUCT API RESPONSE:",
        result
      );

      if (!response.ok) {
        throw new Error(
          getBackendError(result)
        );
      }

      setSuccess(
        editingProduct
          ? "Product updated successfully."
          : "Product created successfully."
      );

      setDialogOpen(false);
      setEditingProduct(null);

      setForm({
        ...EMPTY_FORM,
      });

      await loadProducts();
    } catch (err) {
      console.error(
        "PRODUCT SAVE ERROR:",
        err
      );

      setError(
        err.message ||
          "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE PRODUCT
  // =========================================================

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/products/${product.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          getBackendError(result)
        );
      }

      setSuccess(
        "Product deleted successfully."
      );

      await loadProducts();
    } catch (err) {
      setError(
        err.message ||
          "Failed to delete product."
      );
    }
  };

  // =========================================================
  // BRAND NAME
  // =========================================================

  const getBrandName = (brandId) => {
    const brand = brands.find(
      (item) =>
        Number(item.id) === Number(brandId)
    );

    return brand?.name || "-";
  };

  // =========================================================
  // CATEGORY NAME
  // =========================================================

  const getCategoryName = (categoryId) => {
    const category =
      categories.find(
        (item) =>
          Number(item.id) ===
          Number(categoryId)
      );

    return category?.name || "-";
  };

  // =========================================================
  // IMAGE URL
  // =========================================================

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    if (image.startsWith("/")) {
      return `${IMAGE_BASE_URL}${image}`;
    }

    return `${IMAGE_BASE_URL}/${image}`;
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const searchText =
    search.trim().toLowerCase();

  const filteredProducts =
    products.filter((product) => {
      if (!searchText) {
        return true;
      }

      const sku =
        product.sku?.toLowerCase() || "";

      const name =
        product.name?.toLowerCase() || "";

      const brand =
        getBrandName(
          product.brand_id
        ).toLowerCase();

      const category =
        getCategoryName(
          product.category_id
        ).toLowerCase();

      return (
        sku.includes(searchText) ||
        name.includes(searchText) ||
        brand.includes(searchText) ||
        category.includes(searchText)
      );
    });

  // =========================================================
  // UI
  // =========================================================

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      {/* =====================================================
          PAGE HEADER
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
            Product Master
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Manage products, pricing,
            packing and images
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Product
        </Button>
      </Box>

      {/* =====================================================
          SEARCH
      ====================================================== */}

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
            placeholder="Search SKU, Product, Brand or Category..."
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
          PRODUCT TABLE
      ====================================================== */}

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
          {/* TABLE HEADER */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "60px 80px 120px minmax(180px, 1.5fr) minmax(120px, 1fr) minmax(120px, 1fr) 100px 110px",
              alignItems: "center",
              minWidth: 1050,
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
            <Box>Image</Box>
            <Box>SKU</Box>
            <Box>Product</Box>
            <Box>Brand</Box>
            <Box>Category</Box>
            <Box>MRP</Box>
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
                Loading products...
              </Typography>
            </Box>
          )}

          {/* EMPTY */}

          {!loading &&
            filteredProducts.length ===
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
                    ? "No matching products found."
                    : "No products found."}
                </Typography>
              </Box>
            )}

          {/* PRODUCT ROWS */}

          {!loading &&
            filteredProducts.map(
              (product) => (
                <Box
                  key={product.id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "60px 80px 120px minmax(180px, 1.5fr) minmax(120px, 1fr) minmax(120px, 1fr) 100px 110px",
                    alignItems: "center",
                    minWidth: 1050,
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
                    {product.id}
                  </Box>

                  {/* IMAGE */}

                  <Box>
                    {product.image ? (
                      <Box
                        component="img"
                        src={getImageUrl(
                          product.image
                        )}
                        alt={
                          product.name ||
                          "Product"
                        }
                        sx={{
                          width: 50,
                          height: 50,
                          objectFit:
                            "contain",
                          border:
                            "1px solid #e2e8f0",
                          borderRadius: 1,
                          backgroundColor:
                            "#fff",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          backgroundColor:
                            "#f1f5f9",
                          borderRadius: 1,
                          color: "#64748b",
                        }}
                      >
                        —
                      </Box>
                    )}
                  </Box>

                  {/* SKU */}

                  <Box
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {product.sku}
                  </Box>

                  {/* NAME */}

                  <Box
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {product.name}
                  </Box>

                  {/* BRAND */}

                  <Box>
                    {getBrandName(
                      product.brand_id
                    )}
                  </Box>

                  {/* CATEGORY */}

                  <Box>
                    {getCategoryName(
                      product.category_id
                    )}
                  </Box>

                  {/* MRP */}

                  <Box
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    ₹
                    {Number(
                      product.mrp
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </Box>

                  {/* ACTION */}

                  <Box
                    sx={{
                      display: "flex",
                    }}
                  >
                    <Tooltip title="Edit Product">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() =>
                          handleEdit(
                            product
                          )
                        }
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Product">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() =>
                          handleDelete(
                            product
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
        maxWidth="md"
      >
        <DialogTitle>
          {editingProduct
            ? "Edit Product"
            : "Add Product"}
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: 2,
              pt: 1,
            }}
          >
            {/* SKU */}

            <TextField
              label="SKU"
              name="sku"
              value={form.sku}
              onChange={
                handleChange
              }
              fullWidth
              required
            />

            {/* PRODUCT NAME */}

            <TextField
              label="Product Name"
              name="name"
              value={form.name}
              onChange={
                handleChange
              }
              fullWidth
              required
            />

            {/* BRAND */}

            <TextField
              select
              label="Brand"
              name="brand_id"
              value={
                form.brand_id
              }
              onChange={
                handleChange
              }
              fullWidth
              required
            >
              <MenuItem value="">
                Select Brand
              </MenuItem>

              {brands.map(
                (brand) => (
                  <MenuItem
                    key={brand.id}
                    value={brand.id}
                  >
                    {brand.name}
                  </MenuItem>
                )
              )}
            </TextField>

            {/* CATEGORY */}

            <TextField
              select
              label="Category"
              name="category_id"
              value={
                form.category_id
              }
              onChange={
                handleChange
              }
              fullWidth
              required
            >
              <MenuItem value="">
                Select Category
              </MenuItem>

              {categories.map(
                (category) => (
                  <MenuItem
                    key={category.id}
                    value={
                      category.id
                    }
                  >
                    {category.name}
                  </MenuItem>
                )
              )}
            </TextField>

            {/* MRP */}

            <TextField
              label="MRP"
              name="mrp"
              type="number"
              value={form.mrp}
              onChange={
                handleChange
              }
              fullWidth
              required
              inputProps={{
                min: 0,
              }}
            />

            {/* PACKING QTY */}

            <TextField
              label="Packing Quantity"
              name="packing_qty"
              type="number"
              value={
                form.packing_qty
              }
              onChange={
                handleChange
              }
              fullWidth
              required
              inputProps={{
                min: 0,
              }}
            />

            {/* PACKING TYPE */}

            <TextField
              select
              label="Packing Type"
              name="packing_type"
              value={
                form.packing_type
              }
              onChange={
                handleChange
              }
              fullWidth
              required
            >
              <MenuItem value="Carton">
                Carton
              </MenuItem>

              <MenuItem value="Box">
                Box
              </MenuItem>

              <MenuItem value="Pair">
                Pair
              </MenuItem>

              <MenuItem value="Piece">
                Piece
              </MenuItem>
            </TextField>

            {/* IMAGE UPLOAD */}

            <Box>
              <Button
                component="label"
                variant="outlined"
                startIcon={
                  <CloudUploadIcon />
                }
                disabled={
                  uploadingImage
                }
                fullWidth
                sx={{
                  height: 56,
                }}
              >
                {uploadingImage
                  ? "Uploading..."
                  : "Upload Product Image"}

                <input
                  hidden
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={
                    handleImageUpload
                  }
                />
              </Button>

              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{
                  mt: 0.5,
                }}
              >
                JPG / JPEG / PNG — Maximum
                150 KB
              </Typography>

              {/* IMAGE PREVIEW */}

              {form.image && (
                <Box
                  sx={{
                    mt: 1.5,
                    display: "flex",
                    alignItems:
                      "center",
                    gap: 2,
                  }}
                >
                  <Box
                    component="img"
                    src={getImageUrl(
                      form.image
                    )}
                    alt="Preview"
                    sx={{
                      width: 80,
                      height: 80,
                      objectFit:
                        "contain",
                      border:
                        "1px solid #ddd",
                      borderRadius: 1,
                      backgroundColor:
                        "#fff",
                    }}
                  />

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      wordBreak:
                        "break-all",
                    }}
                  >
                    Image uploaded
                  </Typography>
                </Box>
              )}
            </Box>

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
              rows={4}
              sx={{
                gridColumn:
                  "1 / -1",
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            disabled={
              saving ||
              uploadingImage
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={
              saving ||
              uploadingImage
            }
          >
            {saving
              ? "Saving..."
              : editingProduct
              ? "Update Product"
              : "Save Product"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* =====================================================
          ERROR SNACKBAR
      ====================================================== */}

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

      {/* =====================================================
          SUCCESS SNACKBAR
      ====================================================== */}

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