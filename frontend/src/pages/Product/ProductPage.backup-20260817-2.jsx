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
  Divider,
  IconButton,
  MenuItem,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
import Inventory2Icon from "@mui/icons-material/Inventory2";

const API_BASE_URL = "http://127.0.0.1:8000";

const EMPTY_FORM = {
  name: "",
  brand_id: "",
  category_id: "",
  discount_percent: "0",
  image: "",
  packing_qty: "",
  packing_type: "Carton",
  description: "",
};

const EMPTY_VARIANT = {
  id: null,
  color_id: "",
  size_id: "",
  unit_id: "",
  mrp: "",
  rate: "",
  stock: 0,
};

export default function ProductPage() {
  const [products, setProducts] = useState([]);

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [units, setUnits] = useState([]);

  const [variants, setVariants] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    ...EMPTY_FORM,
  });

  const [variantForm, setVariantForm] = useState({
    ...EMPTY_VARIANT,
  });

  const [variantSaving, setVariantSaving] = useState(false);

  const [variantEditId, setVariantEditId] = useState(null);

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
          data.detail ||
            "Failed to load products"
        );
      }

      setProducts(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to load products"
      );
    }
  };

  // =====================================================
  // LOAD MASTER DATA
  // =====================================================

  const loadMasters = async () => {
    try {
      const [
        brandResponse,
        categoryResponse,
        colorResponse,
        sizeResponse,
        unitResponse,
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/brands/`),
        fetch(`${API_BASE_URL}/categories/`),
        fetch(`${API_BASE_URL}/colors/`),
        fetch(`${API_BASE_URL}/sizes/`),
        fetch(`${API_BASE_URL}/units/`),
      ]);

      const [
        brandData,
        categoryData,
        colorData,
        sizeData,
        unitData,
      ] = await Promise.all([
        brandResponse.json(),
        categoryResponse.json(),
        colorResponse.json(),
        sizeResponse.json(),
        unitResponse.json(),
      ]);

      if (!brandResponse.ok) {
        throw new Error(
          brandData.detail ||
            "Failed to load brands"
        );
      }

      if (!categoryResponse.ok) {
        throw new Error(
          categoryData.detail ||
            "Failed to load categories"
        );
      }

      if (!colorResponse.ok) {
        throw new Error(
          colorData.detail ||
            "Failed to load colors"
        );
      }

      if (!sizeResponse.ok) {
        throw new Error(
          sizeData.detail ||
            "Failed to load sizes"
        );
      }

      if (!unitResponse.ok) {
        throw new Error(
          unitData.detail ||
            "Failed to load units"
        );
      }

      setBrands(
        Array.isArray(brandData)
          ? brandData
          : []
      );

      setCategories(
        Array.isArray(categoryData)
          ? categoryData
          : []
      );

      setColors(
        Array.isArray(colorData)
          ? colorData
          : []
      );

      setSizes(
        Array.isArray(sizeData)
          ? sizeData
          : []
      );

      setUnits(
        Array.isArray(unitData)
          ? unitData
          : []
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to load master data"
      );
    }
  };

  // =====================================================
  // LOAD VARIANTS
  // =====================================================

  const loadVariants = async (productId) => {
    if (!productId) {
      setVariants([]);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/product-variants/`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to load variants"
        );
      }

      const productVariants =
        Array.isArray(data)
          ? data.filter(
              (variant) =>
                Number(
                  variant.product_id
                ) === Number(productId)
            )
          : [];

      setVariants(productVariants);
    } catch (err) {
      setError(
        err.message ||
          "Failed to load variants"
      );

      setVariants([]);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      await Promise.all([
        loadProducts(),
        loadMasters(),
      ]);

      setLoading(false);
    };

    load();
  }, []);

  // =====================================================
  // OPEN ADD
  // =====================================================

  const handleAdd = () => {
    setEditingProduct(null);

    setForm({
      ...EMPTY_FORM,
    });

    setVariants([]);

    setVariantForm({
      ...EMPTY_VARIANT,
    });

    setVariantEditId(null);

    setDialogOpen(true);
  };

  // =====================================================
  // OPEN EDIT
  // =====================================================

  const handleEdit = async (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name ?? "",
      brand_id: product.brand_id ?? "",
      category_id:
        product.category_id ?? "",
      discount_percent:
        product.discount_percent ?? "0",
      image: product.image ?? "",
      packing_qty:
        product.packing_qty ?? "",
      packing_type:
        product.packing_type ?? "Carton",
      description:
        product.description ?? "",
    });

    setVariantForm({
      ...EMPTY_VARIANT,
    });

    setVariantEditId(null);

    setDialogOpen(true);

    await loadVariants(product.id);
  };

  // =====================================================
  // CLOSE
  // =====================================================

  const handleClose = () => {
    if (
      saving ||
      uploadingImage ||
      variantSaving
    ) {
      return;
    }

    setDialogOpen(false);

    setEditingProduct(null);

    setForm({
      ...EMPTY_FORM,
    });

    setVariants([]);

    setVariantForm({
      ...EMPTY_VARIANT,
    });

    setVariantEditId(null);
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
  // VARIANT FORM CHANGE
  // =====================================================

  const handleVariantChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setVariantForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  // =====================================================
  // IMAGE UPLOAD
  // =====================================================

  const handleImageUpload = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 150 * 1024) {
      setError(
        "Image must be under 150 KB."
      );

      event.target.value = "";

      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setError(
        "Only JPG, JPEG and PNG images are allowed."
      );

      event.target.value = "";

      return;
    }

    try {
      setUploadingImage(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const response =
        await fetch(
          `${API_BASE_URL}/product-images/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
            "Image upload failed"
        );
      }

      setForm(
        (previous) => ({
          ...previous,
          image:
            result.path || "",
        })
      );

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

  // =====================================================
  // PRODUCT VALIDATION
  // =====================================================

  const validateProduct = () => {
    if (!form.name.trim()) {
      return "Product Name is required.";
    }

    if (!form.brand_id) {
      return "Please select Brand.";
    }

    if (!form.category_id) {
      return "Please select Category.";
    }

    const discount =
      Number(
        form.discount_percent
      );

    if (
      Number.isNaN(discount) ||
      discount < 0 ||
      discount > 100
    ) {
      return "Discount must be between 0 and 100.";
    }

    if (
      form.packing_qty !== "" &&
      Number(form.packing_qty) < 0
    ) {
      return "Packing Quantity cannot be negative.";
    }

    if (!form.image) {
      return "Please upload Product Image.";
    }

    return "";
  };

  // =====================================================
  // SAVE PRODUCT
  // =====================================================

  const handleSaveProduct = async () => {
    const validation =
      validateProduct();

    if (validation) {
      setError(validation);
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),

        brand_id:
          Number(form.brand_id),

        category_id:
          Number(form.category_id),

        discount_percent:
          Number(
            form.discount_percent
          ),

        image:
          form.image.trim(),

        packing_qty:
          Number(
            form.packing_qty || 0
          ),

        packing_type:
          form.packing_type.trim() ||
          "Carton",

        description:
          form.description.trim() ||
          null,
      };

      const url = editingProduct
        ? `${API_BASE_URL}/products/${editingProduct.id}`
        : `${API_BASE_URL}/products/`;

      const method = editingProduct
        ? "PUT"
        : "POST";

      const response =
        await fetch(url, {
          method,
          headers: {
            "Content-Type":
              "application/json",
          },
          body:
            JSON.stringify(
              payload
            ),
        });

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
            "Failed to save product"
        );
      }

      if (editingProduct) {
        setEditingProduct(result);

        await loadVariants(
          result.id
        );
      } else {
        setEditingProduct(result);

        await loadVariants(
          result.id
        );
      }

      await loadProducts();

      setSuccess(
        editingProduct
          ? "Product updated successfully."
          : "Product created successfully."
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to save product"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // RESET VARIANT
  // =====================================================

  const resetVariantForm = () => {
    setVariantForm({
      ...EMPTY_VARIANT,
    });

    setVariantEditId(null);
  };

  // =====================================================
  // VALIDATE VARIANT
  // =====================================================

  const validateVariant = () => {
    if (!editingProduct?.id) {
      return "Please save the product first.";
    }

    if (!variantForm.color_id) {
      return "Please select Colour.";
    }

    if (!variantForm.size_id) {
      return "Please select Size.";
    }

    if (!variantForm.unit_id) {
      return "Please select Unit.";
    }

    const mrp =
      Number(
        variantForm.mrp
      );

    const rate =
      Number(
        variantForm.rate
      );

    if (
      Number.isNaN(mrp) ||
      mrp < 0
    ) {
      return "Enter a valid MRP.";
    }

    if (
      Number.isNaN(rate) ||
      rate < 0
    ) {
      return "Enter a valid Rate.";
    }

    if (rate > mrp) {
      return "Rate cannot be greater than MRP.";
    }

    if (
      !variantEditId &&
      Number(variantForm.stock) < 0
    ) {
      return "Stock cannot be negative.";
    }

    return "";
  };

  // =====================================================
  // ADD / UPDATE VARIANT
  // =====================================================

  const handleSaveVariant = async () => {
    const validation =
      validateVariant();

    if (validation) {
      setError(validation);
      return;
    }

    try {
      setVariantSaving(true);

      const payload = {
        product_id:
          Number(
            editingProduct.id
          ),

        color_id:
          Number(
            variantForm.color_id
          ),

        size_id:
          Number(
            variantForm.size_id
          ),

        unit_id:
          Number(
            variantForm.unit_id
          ),

        mrp:
          Number(
            variantForm.mrp
          ),

        rate:
          Number(
            variantForm.rate
          ),
      };

      let response;

      if (variantEditId) {
        response =
          await fetch(
            `${API_BASE_URL}/product-variants/${variantEditId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body:
                JSON.stringify(
                  payload
                ),
            }
          );
      } else {
        response =
          await fetch(
            `${API_BASE_URL}/product-variants/`,
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body:
                JSON.stringify({
                  ...payload,
                  stock:
                    Number(
                      variantForm.stock ||
                        0
                    ),
                }),
            }
          );
      }

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
            "Failed to save variant"
        );
      }

      await loadVariants(
        editingProduct.id
      );

      resetVariantForm();

      setSuccess(
        variantEditId
          ? "Variant updated successfully."
          : "Variant added successfully."
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to save variant"
      );
    } finally {
      setVariantSaving(false);
    }
  };

  // =====================================================
  // EDIT VARIANT
  // =====================================================

  const handleEditVariant = (
    variant
  ) => {
    setVariantEditId(
      variant.id
    );

    setVariantForm({
      id: variant.id,

      color_id:
        variant.color_id ?? "",

      size_id:
        variant.size_id ?? "",

      unit_id:
        variant.unit_id ?? "",

      mrp:
        variant.mrp ?? "",

      rate:
        variant.rate ?? "",

      stock:
        variant.stock ?? 0,
    });
  };

  // =====================================================
  // DELETE VARIANT
  // =====================================================

  const handleDeleteVariant = async (
    variant
  ) => {
    const confirmed =
      window.confirm(
        "Delete this variant?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await fetch(
          `${API_BASE_URL}/product-variants/${variant.id}`,
          {
            method: "DELETE",
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
            "Failed to delete variant"
        );
      }

      await loadVariants(
        editingProduct.id
      );

      if (
        variantEditId ===
        variant.id
      ) {
        resetVariantForm();
      }

      setSuccess(
        "Variant deleted successfully."
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to delete variant"
      );
    }
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const handleDeleteProduct = async (
    product
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${product.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await fetch(
          `${API_BASE_URL}/products/${product.id}`,
          {
            method: "DELETE",
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
            "Failed to delete product"
        );
      }

      await loadProducts();

      setSuccess(
        "Product deleted successfully."
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to delete product"
      );
    }
  };

  // =====================================================
  // LABEL HELPERS
  // =====================================================

  const getBrandName = (
    brandId
  ) => {
    const brand =
      brands.find(
        (item) =>
          Number(item.id) ===
          Number(brandId)
      );

    return (
      brand?.name ||
      brand?.brand_name ||
      "-"
    );
  };

  const getCategoryName = (
    categoryId
  ) => {
    const category =
      categories.find(
        (item) =>
          Number(item.id) ===
          Number(categoryId)
      );

    return (
      category?.name ||
      category?.category_name ||
      "-"
    );
  };

  const getColorName = (
    colorId
  ) => {
    const color =
      colors.find(
        (item) =>
          Number(item.id) ===
          Number(colorId)
      );

    return (
      color?.name ||
      color?.code ||
      "-"
    );
  };

  const getSizeName = (
    sizeId
  ) => {
    const size =
      sizes.find(
        (item) =>
          Number(item.id) ===
          Number(sizeId)
      );

    return (
      size?.name ||
      size?.code ||
      "-"
    );
  };

  const getUnitName = (
    unitId
  ) => {
    const unit =
      units.find(
        (item) =>
          Number(item.id) ===
          Number(unitId)
      );

    return (
      unit?.name ||
      unit?.short_name ||
      unit?.code ||
      "-"
    );
  };

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (
    image
  ) => {
    if (!image) {
      return "";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${API_BASE_URL}/${image.replace(
      /^\//,
      ""
    )}`;
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredProducts =
    products.filter(
      (product) => {
        const searchText =
          search
            .trim()
            .toLowerCase();

        if (!searchText) {
          return true;
        }

        const name =
          String(
            product.name || ""
          ).toLowerCase();

        const brand =
          getBrandName(
            product.brand_id
          ).toLowerCase();

        const category =
          getCategoryName(
            product.category_id
          ).toLowerCase();

        return (
          name.includes(
            searchText
          ) ||
          brand.includes(
            searchText
          ) ||
          category.includes(
            searchText
          )
        );
      }
    );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        p: 2,
        bgcolor: "#f8fafc",
      }}
    >
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <Card
        elevation={0}
        sx={{
          border:
            "1px solid #e2e8f0",
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
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
                sx={{ mt: 0.5 }}
              >
                Manage products and their
                colour, size, unit,
                MRP, rate and stock
                variants.
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={
                <AddIcon />
              }
              onClick={
                handleAdd
              }
            >
              Add Product
            </Button>
          </Box>

          <TextField
            fullWidth
            size="small"
            label="Search Product"
            placeholder="Product / Brand / Category"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            sx={{
              mt: 2,
              maxWidth: 500,
            }}
          />
        </CardContent>
      </Card>

      {/* ================================================= */}
      {/* PRODUCT TABLE */}
      {/* ================================================= */}

      <Card
        elevation={0}
        sx={{
          mt: 2,
          border:
            "1px solid #e2e8f0",
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "70px 90px 2fr 1fr 1fr 100px 180px",
              gap: 1,
              alignItems: "center",
              px: 1,
              py: 1.5,
              bgcolor: "#f1f5f9",
              borderRadius: 1,
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            <Box>ID</Box>
            <Box>Image</Box>
            <Box>Product</Box>
            <Box>Brand</Box>
            <Box>Category</Box>
            <Box>Discount</Box>
            <Box>Action</Box>
          </Box>

          {loading ? (
            <Box
              sx={{
                py: 5,
                textAlign: "center",
              }}
            >
              <Typography>
                Loading products...
              </Typography>
            </Box>
          ) : filteredProducts.length ===
            0 ? (
            <Box
              sx={{
                py: 5,
                textAlign: "center",
              }}
            >
              <Inventory2Icon
                sx={{
                  fontSize: 45,
                  color: "#94a3b8",
                }}
              />

              <Typography
                sx={{
                  mt: 1,
                  color: "#64748b",
                }}
              >
                No products found.
              </Typography>
            </Box>
          ) : (
            filteredProducts.map(
              (product) => (
                <Box
                  key={product.id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "70px 90px 2fr 1fr 1fr 100px 180px",
                    gap: 1,
                    alignItems:
                      "center",
                    px: 1,
                    py: 1,
                    borderBottom:
                      "1px solid #e2e8f0",
                    fontSize: 13,
                  }}
                >
                  <Box>
                    {product.id}
                  </Box>

                  <Box>
                    {product.image ? (
                      <Box
                        component="img"
                        src={getImageUrl(
                          product.image
                        )}
                        sx={{
                          width: 55,
                          height: 55,
                          objectFit:
                            "contain",
                          border:
                            "1px solid #e2e8f0",
                          borderRadius: 1,
                          bgcolor:
                            "#fff",
                        }}
                      />
                    ) : (
                      <ImageIcon
                        sx={{
                          color:
                            "#94a3b8",
                        }}
                      />
                    )}
                  </Box>

                  <Box>
                    <Typography
                      fontWeight={600}
                    >
                      {product.name}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Packing:{" "}
                      {
                        product.packing_qty ||
                        0
                      }{" "}
                      {
                        product.packing_type ||
                        "Carton"
                      }
                    </Typography>
                  </Box>

                  <Box>
                    {getBrandName(
                      product.brand_id
                    )}
                  </Box>

                  <Box>
                    {getCategoryName(
                      product.category_id
                    )}
                  </Box>

                  <Box
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {Number(
                      product.discount_percent ||
                        0
                    ).toFixed(2)}
                    %
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 0.5,
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
                          handleDeleteProduct(
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
            )
          )}
        </CardContent>
      </Card>

      {/* ================================================= */}
      {/* PRODUCT DIALOG */}
      {/* ================================================= */}

      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
          }}
        >
          {editingProduct
            ? "Edit Product"
            : "Add Product"}
        </DialogTitle>

        <DialogContent dividers>
          {/* ================================================= */}
          {/* PRODUCT INFORMATION */}
          {/* ================================================= */}

          <Typography
            fontWeight={700}
            sx={{ mb: 2 }}
          >
            Product Information
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
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
                    {brand.name ||
                      brand.brand_name}
                  </MenuItem>
                )
              )}
            </TextField>

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
                    value={category.id}
                  >
                    {category.name ||
                      category.category_name}
                  </MenuItem>
                )
              )}
            </TextField>

            <TextField
              label="Discount %"
              name="discount_percent"
              type="number"
              value={
                form.discount_percent
              }
              onChange={
                handleChange
              }
              fullWidth
              required
              inputProps={{
                min: 0,
                max: 100,
                step: 0.01,
              }}
              helperText="Same discount will apply to all variants."
            />

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
              inputProps={{
                min: 0,
              }}
            />

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
              minRows={3}
              sx={{
                gridColumn: {
                  md: "span 2",
                },
              }}
            />

            <Box
              sx={{
                border:
                  "1px dashed #cbd5e1",
                borderRadius: 1,
                p: 1.5,
                minHeight: 100,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Product Image
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: 1.5,
                  mt: 1,
                }}
              >
                {form.image ? (
                  <Box
                    component="img"
                    src={getImageUrl(
                      form.image
                    )}
                    sx={{
                      width: 70,
                      height: 70,
                      objectFit:
                        "contain",
                      border:
                        "1px solid #e2e8f0",
                      borderRadius: 1,
                    }}
                  />
                ) : (
                  <ImageIcon
                    sx={{
                      fontSize: 45,
                      color:
                        "#94a3b8",
                    }}
                  />
                )}

                <Button
                  component="label"
                  variant="outlined"
                  disabled={
                    uploadingImage
                  }
                >
                  {uploadingImage
                    ? "Uploading..."
                    : form.image
                    ? "Change Image"
                    : "Upload Image"}

                  <input
                    hidden
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={
                      handleImageUpload
                    }
                  />
                </Button>
              </Box>
            </Box>
          </Box>

          {/* ================================================= */}
          {/* SAVE PRODUCT */}
          {/* ================================================= */}

          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent:
                "flex-end",
            }}
          >
            <Button
              variant="contained"
              onClick={
                handleSaveProduct
              }
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
          </Box>

          {/* ================================================= */}
          {/* VARIANTS */}
          {/* ================================================= */}

          {editingProduct && (
            <>
              <Divider
                sx={{ my: 3 }}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography
                    fontWeight={700}
                  >
                    Product Variants
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Add multiple Colour,
                    Size and Unit
                    combinations with
                    different MRP and
                    Rate.
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  startIcon={
                    <AddIcon />
                  }
                  onClick={
                    resetVariantForm
                  }
                >
                  New Variant
                </Button>
              </Box>

              {/* VARIANT FORM */}

              <Box
                sx={{
                  p: 2,
                  border:
                    "1px solid #e2e8f0",
                  borderRadius: 2,
                  bgcolor: "#f8fafc",
                }}
              >
                <Typography
                  fontWeight={600}
                  sx={{ mb: 2 }}
                >
                  {variantEditId
                    ? "Edit Variant"
                    : "Add Variant"}
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "repeat(6, 1fr)",
                    },
                    gap: 1.5,
                  }}
                >
                  <TextField
                    select
                    size="small"
                    label="Colour"
                    name="color_id"
                    value={
                      variantForm.color_id
                    }
                    onChange={
                      handleVariantChange
                    }
                    fullWidth
                  >
                    <MenuItem value="">
                      Select Colour
                    </MenuItem>

                    {colors.map(
                      (color) => (
                        <MenuItem
                          key={color.id}
                          value={color.id}
                        >
                          {color.name ||
                            color.code}
                        </MenuItem>
                      )
                    )}
                  </TextField>

                  <TextField
                    select
                    size="small"
                    label="Size"
                    name="size_id"
                    value={
                      variantForm.size_id
                    }
                    onChange={
                      handleVariantChange
                    }
                    fullWidth
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
                          {size.name ||
                            size.code}
                        </MenuItem>
                      )
                    )}
                  </TextField>

                  <TextField
                    select
                    size="small"
                    label="Unit"
                    name="unit_id"
                    value={
                      variantForm.unit_id
                    }
                    onChange={
                      handleVariantChange
                    }
                    fullWidth
                  >
                    <MenuItem value="">
                      Select Unit
                    </MenuItem>

                    {units.map(
                      (unit) => (
                        <MenuItem
                          key={unit.id}
                          value={unit.id}
                        >
                          {unit.name ||
                            unit.short_name ||
                            unit.code}
                        </MenuItem>
                      )
                    )}
                  </TextField>

                  <TextField
                    size="small"
                    label="MRP"
                    name="mrp"
                    type="number"
                    value={
                      variantForm.mrp
                    }
                    onChange={
                      handleVariantChange
                    }
                    fullWidth
                    inputProps={{
                      min: 0,
                      step: 0.01,
                    }}
                  />

                  <TextField
                    size="small"
                    label="Rate"
                    name="rate"
                    type="number"
                    value={
                      variantForm.rate
                    }
                    onChange={
                      handleVariantChange
                    }
                    fullWidth
                    inputProps={{
                      min: 0,
                      step: 0.01,
                    }}
                  />

                  {!variantEditId && (
                    <TextField
                      size="small"
                      label="Opening Stock"
                      name="stock"
                      type="number"
                      value={
                        variantForm.stock
                      }
                      onChange={
                        handleVariantChange
                      }
                      fullWidth
                      inputProps={{
                        min: 0,
                      }}
                    />
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "flex-end",
                    gap: 1,
                    mt: 2,
                  }}
                >
                  {variantEditId && (
                    <Button
                      variant="outlined"
                      onClick={
                        resetVariantForm
                      }
                    >
                      Cancel
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    startIcon={
                      <AddIcon />
                    }
                    onClick={
                      handleSaveVariant
                    }
                    disabled={
                      variantSaving
                    }
                  >
                    {variantSaving
                      ? "Saving..."
                      : variantEditId
                      ? "Update Variant"
                      : "Add Variant"}
                  </Button>
                </Box>
              </Box>

              {/* VARIANT TABLE */}

              <Box
                sx={{
                  mt: 2,
                  overflowX: "auto",
                }}
              >
                <Box
                  sx={{
                    minWidth: 850,
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "1.2fr 1fr 1fr 1fr 1fr 1fr 110px",
                      gap: 1,
                      alignItems:
                        "center",
                      px: 1,
                      py: 1.2,
                      bgcolor:
                        "#e2e8f0",
                      borderRadius: 1,
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    <Box>
                      Colour
                    </Box>

                    <Box>
                      Size
                    </Box>

                    <Box>
                      Unit
                    </Box>

                    <Box>
                      MRP
                    </Box>

                    <Box>
                      Rate
                    </Box>

                    <Box>
                      Stock
                    </Box>

                    <Box>
                      Action
                    </Box>
                  </Box>

                  {variants.length ===
                  0 ? (
                    <Box
                      sx={{
                        textAlign:
                          "center",
                        py: 4,
                        color:
                          "#64748b",
                      }}
                    >
                      No variants added.
                    </Box>
                  ) : (
                    variants.map(
                      (variant) => (
                        <Box
                          key={
                            variant.id
                          }
                          sx={{
                            display:
                              "grid",
                            gridTemplateColumns:
                              "1.2fr 1fr 1fr 1fr 1fr 1fr 110px",
                            gap: 1,
                            alignItems:
                              "center",
                            px: 1,
                            py: 1,
                            borderBottom:
                              "1px solid #e2e8f0",
                            fontSize: 13,
                          }}
                        >
                          <Box>
                            {
                              getColorName(
                                variant.color_id
                              )
                            }
                          </Box>

                          <Box>
                            {
                              getSizeName(
                                variant.size_id
                              )
                            }
                          </Box>

                          <Box>
                            {
                              getUnitName(
                                variant.unit_id
                              )
                            }
                          </Box>

                          <Box>
                            ₹
                            {Number(
                              variant.mrp ||
                                0
                            ).toFixed(2)}
                          </Box>

                          <Box>
                            ₹
                            {Number(
                              variant.rate ||
                                0
                            ).toFixed(2)}
                          </Box>

                          <Box>
                            {variant.stock ??
                              0}
                          </Box>

                          <Box
                            sx={{
                              display:
                                "flex",
                              gap: 0.25,
                            }}
                          >
                            <Tooltip title="Edit Variant">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() =>
                                  handleEditVariant(
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
                                  handleDeleteVariant(
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
                    )
                  )}
                </Box>
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={
              handleClose
            }
            disabled={
              saving ||
              uploadingImage ||
              variantSaving
            }
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={5000}
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

      {/* ================================================= */}
      {/* SUCCESS */}
      {/* ================================================= */}

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