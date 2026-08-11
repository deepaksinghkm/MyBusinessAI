import { useEffect, useState } from "react";

import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

const API_BASE_URL =
  "http://127.0.0.1:8000";

const EMPTY_FORM = {
  product_id: "",
  variant_id: "",
  transaction_type: "Purchase",
  qty: "",
  reference_no: "",
  remarks: "",
};

export default function StockLedgerPage() {
  const [ledger, setLedger] = useState([]);
  const [variants, setVariants] = useState([]);
  const [products, setProducts] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [stockLimit, setStockLimit] =
    useState(5);

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [form, setForm] = useState({
    ...EMPTY_FORM,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // LOAD DATA
  // =====================================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        ledgerResponse,
        variantsResponse,
        productsResponse,
        colorsResponse,
        sizesResponse,
        categoriesResponse,
      ] = await Promise.all([
        fetch(
          `${API_BASE_URL}/stock-ledger/`
        ),

        fetch(
          `${API_BASE_URL}/product-variants/`
        ),

        fetch(
          `${API_BASE_URL}/products/`
        ),

        fetch(
          `${API_BASE_URL}/colors/`
        ),

        fetch(
          `${API_BASE_URL}/sizes/`
        ),

        fetch(
          `${API_BASE_URL}/categories/`
        ),
      ]);

      const [
        ledgerData,
        variantsData,
        productsData,
        colorsData,
        sizesData,
        categoriesData,
      ] = await Promise.all([
        ledgerResponse.json(),
        variantsResponse.json(),
        productsResponse.json(),
        colorsResponse.json(),
        sizesResponse.json(),
        categoriesResponse.json(),
      ]);

      if (!ledgerResponse.ok) {
        throw new Error(
          ledgerData.detail ||
            "Failed to load stock ledger"
        );
      }

      if (!variantsResponse.ok) {
        throw new Error(
          variantsData.detail ||
            "Failed to load product variants"
        );
      }

      if (!productsResponse.ok) {
        throw new Error(
          productsData.detail ||
            "Failed to load products"
        );
      }

      if (!colorsResponse.ok) {
        throw new Error(
          colorsData.detail ||
            "Failed to load colors"
        );
      }

      if (!sizesResponse.ok) {
        throw new Error(
          sizesData.detail ||
            "Failed to load sizes"
        );
      }

      if (!categoriesResponse.ok) {
        throw new Error(
          categoriesData.detail ||
            "Failed to load categories"
        );
      }

      setLedger(
        Array.isArray(ledgerData)
          ? ledgerData
          : []
      );

      setVariants(
        Array.isArray(variantsData)
          ? variantsData
          : []
      );

      setProducts(
        Array.isArray(productsData)
          ? productsData
          : []
      );

      setColors(
        Array.isArray(colorsData)
          ? colorsData
          : []
      );

      setSizes(
        Array.isArray(sizesData)
          ? sizesData
          : []
      );

      setCategories(
        Array.isArray(categoriesData)
          ? categoriesData
          : []
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to load stock ledger"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =====================================================
  // HELPERS
  // =====================================================

  const getVariant = (variantId) => {
    return variants.find(
      (item) =>
        Number(item.id) ===
        Number(variantId)
    );
  };

  const getProduct = (productId) => {
    return products.find(
      (item) =>
        Number(item.id) ===
        Number(productId)
    );
  };

  const getProductName = (productId) => {
    const product =
      getProduct(productId);

    if (!product) {
      return "-";
    }

    return `${product.sku} - ${product.name}`;
  };

  const getColorName = (colorId) => {
    const color = colors.find(
      (item) =>
        Number(item.id) ===
        Number(colorId)
    );

    return color?.name || "-";
  };

  const getSizeName = (sizeId) => {
    const size = sizes.find(
      (item) =>
        Number(item.id) ===
        Number(sizeId)
    );

    return size?.name || "-";
  };

  const getVariantLabel = (variantId) => {
    const variant =
      getVariant(variantId);

    if (!variant) {
      return `Variant #${variantId}`;
    }

    return (
      `${getProductName(
        variant.product_id
      )} | ` +
      `${getColorName(
        variant.color_id
      )} | Size ` +
      `${getSizeName(
        variant.size_id
      )}`
    );
  };

  // =====================================================
  // PRODUCT VARIANTS
  // =====================================================

  const getProductVariants = (productId) => {
    if (!productId) {
      return [];
    }

    return variants.filter(
      (variant) =>
        Number(variant.product_id) ===
        Number(productId)
    );
  };

  // =====================================================
  // CATEGORY NAME
  // =====================================================

  const getCategoryName = () => {
    if (!selectedCategory) {
      return "All Categories";
    }

    const category =
      categories.find(
        (item) =>
          Number(item.id) ===
          Number(selectedCategory)
      );

    return (
      category?.name ||
      "All Categories"
    );
  };

  // =====================================================
  // GENERATE PDF
  // =====================================================

  const generatePdf = async () => {
    const limit =
      Number(stockLimit);

    if (
      !Number.isInteger(limit) ||
      limit < 1
    ) {
      setError(
        "Please enter a valid stock limit greater than 0."
      );

      return;
    }

    try {
      setPdfLoading(true);

      let url;

      if (selectedCategory) {
        url =
          `${API_BASE_URL}` +
          `/pdf-catalog/generate/category/` +
          `${selectedCategory}` +
          `?stock_limit=${limit}`;
      } else {
        url =
          `${API_BASE_URL}` +
          `/pdf-catalog/generate` +
          `?stock_limit=${limit}`;
      }

      const response =
        await fetch(url);

      if (!response.ok) {
        let message =
          "Failed to generate PDF.";

        try {
          const data =
            await response.json();

          message =
            data.detail ||
            message;
        } catch {
          // Ignore
        }

        throw new Error(message);
      }

      const blob =
        await response.blob();

      const blobUrl =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = blobUrl;

      const categoryName =
        getCategoryName()
          .replace(
            /\s+/g,
            "_"
          );

      link.download =
        `${categoryName}` +
        `_Stock_${limit}` +
        `_or_less.pdf`;

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        blobUrl
      );

      setSuccess(
        `${getCategoryName()} PDF generated successfully for stock ${limit} or less.`
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to generate PDF."
      );
    } finally {
      setPdfLoading(false);
    }
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

      ...(name === "product_id"
        ? {
            variant_id: "",
          }
        : {}),
    }));
  };

  // =====================================================
  // OPEN DIALOG
  // =====================================================

  const handleAdd = () => {
    setForm({
      ...EMPTY_FORM,
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

    setForm({
      ...EMPTY_FORM,
    });
  };

  // =====================================================
  // SAVE STOCK ENTRY
  // =====================================================

  const handleSave = async () => {
    if (!form.product_id) {
      setError(
        "Please select a product."
      );

      return;
    }

    if (!form.variant_id) {
      setError(
        "Please select a product variant."
      );

      return;
    }

    if (
      form.qty === "" ||
      form.qty === null ||
      form.qty === undefined
    ) {
      setError(
        "Please enter quantity."
      );

      return;
    }

    const quantity =
      Number(form.qty);

    if (
      Number.isNaN(quantity)
    ) {
      setError(
        "Quantity must be a valid number."
      );

      return;
    }

    if (quantity === 0) {
      setError(
        "Quantity cannot be zero."
      );

      return;
    }

    if (
      form.transaction_type !==
        "Adjustment" &&
      quantity < 0
    ) {
      setError(
        "Quantity must be positive for this transaction."
      );

      return;
    }

    try {
      setSaving(true);

      const payload = {
        variant_id:
          Number(
            form.variant_id
          ),

        transaction_type:
          form.transaction_type,

        qty: quantity,

        reference_no:
          form.reference_no ||
          null,

        remarks:
          form.remarks ||
          null,
      };

      const response =
        await fetch(
          `${API_BASE_URL}/stock-ledger/`,
          {
            method: "POST",

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

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail ||
            "Failed to create stock transaction"
        );
      }

      setSuccess(
        "Stock transaction saved successfully."
      );

      setDialogOpen(false);

      setForm({
        ...EMPTY_FORM,
      });

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to save transaction."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // TRANSACTION COLOR
  // =====================================================

  const getTransactionColor = (
    type
  ) => {
    switch (type) {
      case "Opening":
        return "info";

      case "Purchase":
        return "success";

      case "Sale":
        return "error";

      case "Adjustment":
        return "warning";

      default:
        return "default";
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          mb: 2,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
          >
            Stock Ledger
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Manage Opening, Purchase,
            Sale and Stock Adjustment
            transactions
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* CATEGORY */}

          <TextField
            select
            size="small"
            label="PDF Category"
            value={
              selectedCategory
            }
            onChange={(event) =>
              setSelectedCategory(
                event.target.value
              )
            }
            sx={{
              minWidth: 190,
            }}
          >
            <MenuItem value="">
              All Categories
            </MenuItem>

            {categories.map(
              (category) => (
                <MenuItem
                  key={
                    category.id
                  }
                  value={
                    category.id
                  }
                >
                  {category.name}
                </MenuItem>
              )
            )}
          </TextField>

          {/* STOCK LIMIT */}

          <TextField
            size="small"
            type="number"
            label="Stock ≤"
            value={stockLimit}
            onChange={(event) =>
              setStockLimit(
                event.target.value
              )
            }
            inputProps={{
              min: 1,
            }}
            sx={{
              width: 95,
            }}
          />

          {/* PDF */}

          <Button
            variant="outlined"
            color="error"
            startIcon={
              <PictureAsPdfIcon />
            }
            onClick={
              generatePdf
            }
            disabled={
              pdfLoading
            }
          >
            {pdfLoading
              ? "Generating..."
              : "Generate PDF"}
          </Button>

          {/* REFRESH */}

          <Button
            variant="outlined"
            startIcon={
              <RefreshIcon />
            }
            onClick={
              loadData
            }
          >
            Refresh
          </Button>

          {/* STOCK ENTRY */}

          <Button
            variant="contained"
            startIcon={
              <AddIcon />
            }
            onClick={
              handleAdd
            }
          >
            Stock Entry
          </Button>
        </Box>
      </Box>

      {/* =================================================
          STOCK RULE INFO
      ================================================= */}

      <Alert
        severity="info"
        sx={{
          mb: 2,
        }}
      >
        PDF में केवल वही variants आएंगे
        जिनका current Stock <b>1</b> से
        लेकर <b>{stockLimit || 5}</b> तक होगा।
        Stock 0 और limit से ज्यादा stock
        वाले variants PDF में नहीं आएंगे।
      </Alert>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, 1fr)",
          gap: 2,
          mb: 2,
        }}
      >
        <Card>
          <CardContent>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Transactions
            </Typography>

            <Typography
              variant="h5"
              fontWeight={700}
            >
              {ledger.length}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Variants
            </Typography>

            <Typography
              variant="h5"
              fontWeight={700}
            >
              {variants.length}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Purchase Qty
            </Typography>

            <Typography
              variant="h5"
              fontWeight={700}
            >
              {ledger
                .filter(
                  (item) =>
                    item.transaction_type ===
                    "Purchase"
                )
                .reduce(
                  (
                    sum,
                    item
                  ) =>
                    sum +
                    Number(
                      item.qty || 0
                    ),
                  0
                )}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Sale Qty
            </Typography>

            <Typography
              variant="h5"
              fontWeight={700}
            >
              {ledger
                .filter(
                  (item) =>
                    item.transaction_type ===
                    "Sale"
                )
                .reduce(
                  (
                    sum,
                    item
                  ) =>
                    sum +
                    Number(
                      item.qty || 0
                    ),
                  0
                )}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* =================================================
          LEDGER TABLE
      ================================================= */}

      <Card>
        <CardContent
          sx={{
            p: 0,
            overflowX: "auto",
            "&:last-child": {
              pb: 0,
            },
          }}
        >
          {/* HEADER */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "60px minmax(300px, 2fr) 130px 100px 150px 180px 180px",
              minWidth: 1100,
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

            <Box>Variant</Box>

            <Box>
              Transaction
            </Box>

            <Box>Qty</Box>

            <Box>Reference</Box>

            <Box>Remarks</Box>

            <Box>Date</Box>
          </Box>

          {/* LOADING */}

          {loading && (
            <Box
              sx={{
                p: 5,
                textAlign:
                  "center",
              }}
            >
              <Typography>
                Loading stock ledger...
              </Typography>
            </Box>
          )}

          {/* EMPTY */}

          {!loading &&
            ledger.length === 0 && (
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
                  No stock transactions
                  found.
                </Typography>
              </Box>
            )}

          {/* ROWS */}

          {!loading &&
            ledger.map(
              (item) => (
                <Box
                  key={
                    item.id
                  }
                  sx={{
                    display:
                      "grid",
                    gridTemplateColumns:
                      "60px minmax(300px, 2fr) 130px 100px 150px 180px 180px",
                    minWidth: 1100,
                    px: 2,
                    py: 1.5,
                    alignItems:
                      "center",
                    borderBottom:
                      "1px solid #e2e8f0",
                    "&:hover": {
                      backgroundColor:
                        "#f8fafc",
                    },
                  }}
                >
                  <Box>
                    {item.id}
                  </Box>

                  <Box
                    sx={{
                      fontWeight:
                        600,
                    }}
                  >
                    {getVariantLabel(
                      item.variant_id
                    )}
                  </Box>

                  <Box>
                    <Chip
                      size="small"
                      label={
                        item.transaction_type
                      }
                      color={
                        getTransactionColor(
                          item.transaction_type
                        )
                      }
                    />
                  </Box>

                  <Box
                    sx={{
                      fontWeight:
                        700,
                    }}
                  >
                    {item.qty}
                  </Box>

                  <Box>
                    {
                      item.reference_no ||
                      "-"
                    }
                  </Box>

                  <Box
                    sx={{
                      overflow:
                        "hidden",
                      textOverflow:
                        "ellipsis",
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {
                      item.remarks ||
                      "-"
                    }
                  </Box>

                  <Box>
                    {item.created_at
                      ? new Date(
                          item.created_at
                        ).toLocaleString(
                          "en-IN"
                        )
                      : "-"}
                  </Box>
                </Box>
              )
            )}
        </CardContent>
      </Card>

      {/* =================================================
          STOCK ENTRY DIALOG
      ================================================= */}

      <Dialog
        open={dialogOpen}
        onClose={
          handleClose
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          New Stock Transaction
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display:
                "grid",
              gap: 2,
              pt: 1,
            }}
          >
            {/* =================================================
                PRODUCT
            ================================================= */}

            <Autocomplete
              fullWidth
              options={products}
              value={
                products.find(
                  (product) =>
                    Number(
                      product.id
                    ) ===
                    Number(
                      form.product_id
                    )
                ) || null
              }
              getOptionLabel={(
                product
              ) =>
                product
                  ? `${product.sku} - ${product.name}`
                  : ""
              }
              isOptionEqualToValue={(
                option,
                value
              ) =>
                Number(
                  option.id
                ) ===
                Number(
                  value.id
                )
              }
              onChange={(
                event,
                newValue
              ) => {
                setForm(
                  (previous) => ({
                    ...previous,

                    product_id:
                      newValue?.id ||
                      "",

                    variant_id:
                      "",
                  })
                );
              }}
              renderOption={(
                props,
                product
              ) => (
                <Box
                  component="li"
                  {...props}
                  key={
                    product.id
                  }
                >
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
                      SKU:{" "}
                      {product.sku}
                      {" | "}
                      MRP: ₹
                      {product.mrp}
                    </Typography>
                  </Box>
                </Box>
              )}
              renderInput={(
                params
              ) => (
                <TextField
                  {...params}
                  label="Product"
                  placeholder="Search SKU / Product"
                  required
                />
              )}
            />

            {/* =================================================
                PRODUCT VARIANT
            ================================================= */}

            <Autocomplete
              fullWidth
              options={
                getProductVariants(
                  form.product_id
                )
              }
              value={
                getProductVariants(
                  form.product_id
                ).find(
                  (variant) =>
                    Number(
                      variant.id
                    ) ===
                    Number(
                      form.variant_id
                    )
                ) || null
              }
              disabled={
                !form.product_id
              }
              getOptionLabel={(
                variant
              ) =>
                variant
                  ? `${getColorName(
                      variant.color_id
                    )} | Size ${getSizeName(
                      variant.size_id
                    )} | Stock: ${variant.stock}`
                  : ""
              }
              isOptionEqualToValue={(
                option,
                value
              ) =>
                Number(
                  option.id
                ) ===
                Number(
                  value.id
                )
              }
              onChange={(
                event,
                newValue
              ) => {
                setForm(
                  (previous) => ({
                    ...previous,

                    variant_id:
                      newValue?.id ||
                      "",
                  })
                );
              }}
              renderOption={(
                props,
                variant
              ) => (
                <Box
                  component="li"
                  {...props}
                  key={
                    variant.id
                  }
                  sx={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    width:
                      "100%",
                  }}
                >
                  <Box>
                    <Typography
                      fontWeight={600}
                    >
                      {getColorName(
                        variant.color_id
                      )}{" "}
                      | Size{" "}
                      {getSizeName(
                        variant.size_id
                      )}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Current Stock:{" "}
                      {variant.stock}
                    </Typography>
                  </Box>
                </Box>
              )}
              renderInput={(
                params
              ) => (
                <TextField
                  {...params}
                  label="Product Variant"
                  placeholder={
                    form.product_id
                      ? "Select Color / Size"
                      : "First select product"
                  }
                  helperText={
                    !form.product_id
                      ? "First select a product"
                      : getProductVariants(
                          form.product_id
                        ).length === 0
                      ? "No variants found for this product"
                      : ""
                  }
                  required
                />
              )}
            />

            {/* =================================================
                TRANSACTION
            ================================================= */}

            <TextField
              select
              fullWidth
              label="Transaction Type"
              name="transaction_type"
              value={
                form.transaction_type
              }
              onChange={
                handleChange
              }
            >
              <MenuItem value="Opening">
                Opening
              </MenuItem>

              <MenuItem value="Purchase">
                Purchase
              </MenuItem>

              <MenuItem value="Sale">
                Sale
              </MenuItem>

              <MenuItem value="Adjustment">
                Adjustment
              </MenuItem>
            </TextField>

            {/* =================================================
                QTY
            ================================================= */}

            <TextField
              fullWidth
              type="number"
              label="Quantity"
              name="qty"
              value={
                form.qty
              }
              onChange={
                handleChange
              }
              required
              inputProps={{
                step: 1,
              }}
              helperText={
                form.transaction_type ===
                "Adjustment"
                  ? "Positive = add stock, negative = reduce stock."
                  : "Enter positive quantity."
              }
            />

            {/* =================================================
                REFERENCE
            ================================================= */}

            <TextField
              fullWidth
              label="Reference No."
              name="reference_no"
              value={
                form.reference_no
              }
              onChange={
                handleChange
              }
              placeholder="PO / Invoice / Adjustment No."
            />

            {/* =================================================
                REMARKS
            ================================================= */}

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Remarks"
              name="remarks"
              value={
                form.remarks
              }
              onChange={
                handleChange
              }
              placeholder="Enter remarks"
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={
              handleClose
            }
            disabled={
              saving
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={
              handleSave
            }
            disabled={
              saving
            }
          >
            {saving
              ? "Saving..."
              : "Save Transaction"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* =================================================
          ERROR
      ================================================= */}

      <Snackbar
        open={
          Boolean(error)
        }
        autoHideDuration={
          7000
        }
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
        >
          {error}
        </Alert>
      </Snackbar>

      {/* =================================================
          SUCCESS
      ================================================= */}

      <Snackbar
        open={
          Boolean(success)
        }
        autoHideDuration={
          5000
        }
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