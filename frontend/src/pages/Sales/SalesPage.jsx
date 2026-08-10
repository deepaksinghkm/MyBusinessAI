import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import SaveIcon from "@mui/icons-material/Save";

import { createSale } from "../../api/salesApi";

const API_BASE_URL = "http://127.0.0.1:8000";

const EMPTY_ITEM = {
  product_id: "",
  variant_id: "",
  qty: 1,
  rate: "",
  discount_percent: 0,
  tax_percent: 0,
};

export default function SalesPage() {
  // =====================================================
  // MASTER DATA
  // =====================================================

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  // =====================================================
  // CUSTOMER
  // =====================================================

  const [billToCustomer, setBillToCustomer] =
    useState(null);

  const [shipToCustomer, setShipToCustomer] =
    useState(null);

  // =====================================================
  // SALE DETAILS
  // =====================================================

  const [saleDate, setSaleDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [taxType, setTaxType] =
    useState("GST");

  const [taxPercent, setTaxPercent] =
    useState(18);

  // =====================================================
  // ITEM
  // =====================================================

  const [item, setItem] = useState({
    ...EMPTY_ITEM,
  });

  const [items, setItems] = useState([]);

  // =====================================================
  // STATUS
  // =====================================================

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =====================================================
  // LOAD MASTER DATA
  // =====================================================

  useEffect(() => {
    loadMasterData();
  }, []);

  const loadMasterData = async () => {
    try {
      const [
        customersResponse,
        productsResponse,
        variantsResponse,
        colorsResponse,
        sizesResponse,
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/customers/`),
        fetch(`${API_BASE_URL}/products/`),
        fetch(`${API_BASE_URL}/product-variants/`),
        fetch(`${API_BASE_URL}/colors/`),
        fetch(`${API_BASE_URL}/sizes/`),
      ]);

      const customersData =
        await customersResponse.json();

      const productsData =
        await productsResponse.json();

      const variantsData =
        await variantsResponse.json();

      const colorsData =
        await colorsResponse.json();

      const sizesData =
        await sizesResponse.json();

      if (!customersResponse.ok) {
        throw new Error(
          customersData.detail ||
            "Failed to load customers"
        );
      }

      if (!productsResponse.ok) {
        throw new Error(
          productsData.detail ||
            "Failed to load products"
        );
      }

      if (!variantsResponse.ok) {
        throw new Error(
          variantsData.detail ||
            "Failed to load variants"
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

      setCustomers(
        Array.isArray(customersData)
          ? customersData
          : []
      );

      setProducts(
        Array.isArray(productsData)
          ? productsData
          : []
      );

      setVariants(
        Array.isArray(variantsData)
          ? variantsData
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
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to load master data"
      );
    }
  };

  // =====================================================
  // CUSTOMER ADDRESS
  // =====================================================

  const getCustomerAddress = (customer) => {
    if (!customer) {
      return "-";
    }

    const parts = [
      customer.address1,
      customer.address2,
      customer.city,
      customer.state,
      customer.country,
      customer.pincode,
    ].filter(Boolean);

    return parts.length
      ? parts.join(", ")
      : "-";
  };

  // =====================================================
  // PRODUCT VARIANTS
  // =====================================================

  const productVariants = useMemo(() => {
    if (!item.product_id) {
      return [];
    }

    return variants.filter(
      (variant) =>
        Number(variant.product_id) ===
        Number(item.product_id)
    );
  }, [
    variants,
    item.product_id,
  ]);

  // =====================================================
  // SELECTED PRODUCT
  // =====================================================

  const selectedProduct = useMemo(() => {
    return products.find(
      (product) =>
        Number(product.id) ===
        Number(item.product_id)
    );
  }, [
    products,
    item.product_id,
  ]);

  // =====================================================
  // SELECTED VARIANT
  // =====================================================

  const selectedVariant = useMemo(() => {
    return variants.find(
      (variant) =>
        Number(variant.id) ===
        Number(item.variant_id)
    );
  }, [
    variants,
    item.variant_id,
  ]);

  // =====================================================
  // ITEM CALCULATION
  // =====================================================

  const calculateItem = () => {
    const qty =
      Number(item.qty) || 0;

    const rate =
      Number(item.rate) || 0;

    const discountPercent =
      Number(
        item.discount_percent
      ) || 0;

    const tax =
      Number(item.tax_percent) || 0;

    const gross =
      qty * rate;

    const discountAmount =
      gross *
      discountPercent /
      100;

    const taxableAmount =
      Math.max(
        gross - discountAmount,
        0
      );

    const taxAmount =
      taxableAmount *
      tax /
      100;

    const finalAmount =
      taxableAmount +
      taxAmount;

    return {
      gross,
      discountAmount,
      taxableAmount,
      taxAmount,
      finalAmount,
    };
  };

  // =====================================================
  // ADD ITEM
  // =====================================================

  const handleAddItem = () => {
    if (!item.product_id) {
      setError(
        "Please select Product."
      );
      return;
    }

    if (!item.variant_id) {
      setError(
        "Please select Variant."
      );
      return;
    }

    if (
      !item.qty ||
      Number(item.qty) <= 0
    ) {
      setError(
        "Quantity must be greater than zero."
      );
      return;
    }

    if (
      selectedVariant &&
      Number(item.qty) >
        Number(
          selectedVariant.stock || 0
        )
    ) {
      setError(
        `Insufficient stock. Available stock: ${
          selectedVariant.stock || 0
        }`
      );
      return;
    }

    if (
      item.rate === "" ||
      Number(item.rate) < 0
    ) {
      setError(
        "Please enter a valid rate."
      );
      return;
    }

    const color =
      colors.find(
        (value) =>
          Number(value.id) ===
          Number(
            selectedVariant.color_id
          )
      );

    const size =
      sizes.find(
        (value) =>
          Number(value.id) ===
          Number(
            selectedVariant.size_id
          )
      );

    const calculation =
      calculateItem();

    const newItem = {
      product_id:
        item.product_id,

      variant_id:
        item.variant_id,

      qty:
        Number(item.qty),

      rate:
        Number(item.rate),

      discount_percent:
        Number(
          item.discount_percent
        ) || 0,

      discount_amount:
        calculation.discountAmount,

      tax_percent:
        Number(item.tax_percent) ||
        0,

      tax_amount:
        calculation.taxAmount,

      product_name:
        selectedProduct?.name ||
        selectedProduct?.product_name ||
        "-",

      sku:
        selectedProduct?.sku ||
        selectedProduct?.product_code ||
        "-",

      color_name:
        color?.name || "-",

      size_name:
        size?.name || "-",

      stock:
        selectedVariant?.stock || 0,

      taxable_amount:
        calculation.taxableAmount,

      amount:
        calculation.finalAmount,
    };

    setItems((previous) => [
      ...previous,
      newItem,
    ]);

    setItem({
      ...EMPTY_ITEM,
      tax_percent:
        Number(taxPercent) || 0,
    });
  };

  // =====================================================
  // REMOVE ITEM
  // =====================================================

  const handleRemoveItem = (
    index
  ) => {
    setItems((previous) =>
      previous.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  };

  // =====================================================
  // TOTALS
  // =====================================================

  const subtotal = items.reduce(
    (total, currentItem) =>
      total +
      Number(
        currentItem.taxable_amount ||
          0
      ),
    0
  );

  const totalDiscount =
    items.reduce(
      (total, currentItem) =>
        total +
        Number(
          currentItem.discount_amount ||
            0
        ),
      0
    );

  const totalTax =
    items.reduce(
      (total, currentItem) =>
        total +
        Number(
          currentItem.tax_amount ||
            0
        ),
      0
    );

  const grandTotal =
    subtotal + totalTax;

  // =====================================================
  // SAVE SALE
  // =====================================================

  const handleSaveSale = async () => {
    if (!billToCustomer) {
      setError(
        "Please select Bill To customer."
      );
      return;
    }

    if (!shipToCustomer) {
      setError(
        "Please select Ship To customer."
      );
      return;
    }

    if (items.length === 0) {
      setError(
        "Please add at least one item."
      );
      return;
    }

    try {
      setSaving(true);

      const saleNo =
        `SAL-${Date.now()}`;

      const payload = {
        sale_no: saleNo,

        sale_date: saleDate,

        customer_name:
          billToCustomer.customer_name,

        customer_mobile:
          billToCustomer.mobile ||
          null,

        invoice_no: null,

        remarks:
          `Bill To: ${
            billToCustomer.customer_name
          } | Ship To: ${
            shipToCustomer.customer_name
          } | Tax: ${taxType} ${
            Number(taxPercent)
          }%`,

        // Backend expects discount amount.
        // Item discount is already calculated
        // as amount, so sale-level discount = 0.
        discount: 0,

        // Tax is already calculated at item level
        // using tax_percent.
        tax: 0,

        items: items.map(
          (currentItem) => ({
            variant_id:
              Number(
                currentItem.variant_id
              ),

            qty:
              Number(
                currentItem.qty
              ),

            rate:
              Number(
                currentItem.rate
              ),

            discount:
              Number(
                currentItem.discount_amount ||
                  0
              ),

            tax_percent:
              Number(
                currentItem.tax_percent ||
                  0
              ),
          })
        ),
      };

      console.log(
        "SALE PAYLOAD:",
        payload
      );

      const result =
        await createSale(
          payload
        );

      console.log(
        "SALE RESPONSE:",
        result
      );

      setSuccess(
        `Sale ${
          result.sale_no
        } saved successfully.`
      );

      setItems([]);

      setBillToCustomer(null);
      setShipToCustomer(null);

      setItem({
        ...EMPTY_ITEM,
        tax_percent:
          Number(taxPercent) || 0,
      });

      await loadMasterData();
    } catch (err) {
      console.error(
        "SALE SAVE ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to save sale."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
      }}
    >
      {/* HEADER */}

      <Typography
        variant="h5"
        fontWeight={700}
        sx={{ mb: 0.5 }}
      >
        Sales
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Create sales invoice and
        manage stock deduction.
      </Typography>

      {/* =================================================
          SALE + CUSTOMER DETAILS
      ================================================= */}

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 2 }}
          >
            Sale Details
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr 1fr",
              },
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              type="date"
              label="Sale Date"
              value={saleDate}
              onChange={(event) =>
                setSaleDate(
                  event.target.value
                )
              }
              InputLabelProps={{
                shrink: true,
              }}
            />

            {/* BILL TO */}

            <Autocomplete
              fullWidth
              options={customers}
              value={billToCustomer}
              onChange={(
                _event,
                newValue
              ) => {
                setBillToCustomer(
                  newValue
                );

                if (
                  newValue &&
                  !shipToCustomer
                ) {
                  setShipToCustomer(
                    newValue
                  );
                }
              }}
              getOptionLabel={(
                customer
              ) =>
                customer
                  ? `${customer.customer_code} - ${customer.customer_name}`
                  : ""
              }
              isOptionEqualToValue={(
                option,
                value
              ) =>
                Number(option.id) ===
                Number(value.id)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Bill To Customer"
                  placeholder="Search customer..."
                />
              )}
            />

            {/* SHIP TO */}

            <Autocomplete
              fullWidth
              options={customers}
              value={shipToCustomer}
              onChange={(
                _event,
                newValue
              ) =>
                setShipToCustomer(
                  newValue
                )
              }
              getOptionLabel={(
                customer
              ) =>
                customer
                  ? `${customer.customer_code} - ${customer.customer_name}`
                  : ""
              }
              isOptionEqualToValue={(
                option,
                value
              ) =>
                Number(option.id) ===
                Number(value.id)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Ship To Customer"
                  placeholder="Search customer..."
                />
              )}
            />

            {/* TAX TYPE */}

            <TextField
              select
              fullWidth
              label="Tax Type"
              value={taxType}
              onChange={(event) => {
                const value =
                  event.target.value;

                setTaxType(value);

                if (
                  value ===
                  "Exempt"
                ) {
                  setTaxPercent(0);
                }
              }}
            >
              <MenuItem value="GST">
                GST
              </MenuItem>

              <MenuItem value="CGST + SGST">
                CGST + SGST
              </MenuItem>

              <MenuItem value="IGST">
                IGST
              </MenuItem>

              <MenuItem value="Exempt">
                Exempt
              </MenuItem>
            </TextField>

            {/* TAX % */}

            <TextField
              fullWidth
              type="number"
              label="Tax %"
              value={taxPercent}
              onChange={(event) => {
                const value =
                  event.target.value;

                setTaxPercent(value);

                setItem(
                  (previous) => ({
                    ...previous,
                    tax_percent:
                      value,
                  })
                );
              }}
              disabled={
                taxType === "Exempt"
              }
              inputProps={{
                min: 0,
                max: 100,
                step: 0.01,
              }}
            />

            {/* CUSTOMER MOBILE */}

            <TextField
              fullWidth
              label="Customer Mobile"
              value={
                billToCustomer?.mobile ||
                ""
              }
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>

          {/* BILL / SHIP ADDRESS */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
              gap: 2,
              mt: 2,
            }}
          >
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography
                fontWeight={700}
                sx={{ mb: 1 }}
              >
                Bill To
              </Typography>

              <Typography>
                {billToCustomer
                  ?.customer_name ||
                  "-"}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                GST:{" "}
                {billToCustomer?.gst_no ||
                  "-"}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {getCustomerAddress(
                  billToCustomer
                )}
              </Typography>
            </Box>

            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography
                fontWeight={700}
                sx={{ mb: 1 }}
              >
                Ship To
              </Typography>

              <Typography>
                {shipToCustomer
                  ?.customer_name ||
                  "-"}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                GST:{" "}
                {shipToCustomer?.gst_no ||
                  "-"}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {getCustomerAddress(
                  shipToCustomer
                )}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* =================================================
          ADD PRODUCT
      ================================================= */}

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 2 }}
          >
            Add Product
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                lg: "2fr 2fr 1fr",
              },
              gap: 2,
            }}
          >
            {/* PRODUCT */}

            <Autocomplete
              fullWidth
              options={products}
              value={
                selectedProduct || null
              }
              onChange={(
                _event,
                newValue
              ) => {
                setItem({
                  ...EMPTY_ITEM,
                  product_id:
                    newValue?.id || "",
                  tax_percent:
                    Number(
                      taxPercent
                    ) || 0,
                });
              }}
              getOptionLabel={(
                product
              ) =>
                product
                  ? `${
                      product.sku ||
                      product.product_code ||
                      ""
                    } - ${
                      product.name ||
                      product.product_name ||
                      ""
                    }`
                  : ""
              }
              isOptionEqualToValue={(
                option,
                value
              ) =>
                Number(option.id) ===
                Number(value.id)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Product"
                  placeholder="Search product..."
                />
              )}
            />

            {/* VARIANT */}

            <Autocomplete
              fullWidth
              disabled={
                !item.product_id
              }
              options={productVariants}
              value={
                selectedVariant ||
                null
              }
              onChange={(
                _event,
                newValue
              ) => {
                setItem(
                  (previous) => ({
                    ...previous,
                    variant_id:
                      newValue?.id ||
                      "",
                    rate:
                      selectedProduct?.mrp ??
                      "",
                  })
                );
              }}
              getOptionLabel={(
                variant
              ) => {
                const color =
                  colors.find(
                    (value) =>
                      Number(
                        value.id
                      ) ===
                      Number(
                        variant.color_id
                      )
                  );

                const size =
                  sizes.find(
                    (value) =>
                      Number(
                        value.id
                      ) ===
                      Number(
                        variant.size_id
                      )
                  );

                return `${color?.name || "-"} / ${
                  size?.name || "-"
                } / Stock: ${
                  variant.stock ?? 0
                }`;
              }}
              isOptionEqualToValue={(
                option,
                value
              ) =>
                Number(option.id) ===
                Number(value.id)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Variant / Color / Size"
                  placeholder="Select variant..."
                />
              )}
            />

            {/* STOCK */}

            <TextField
              fullWidth
              label="Available Stock"
              value={
                selectedVariant?.stock ??
                ""
              }
              InputProps={{
                readOnly: true,
              }}
            />

            {/* QUANTITY */}

            <TextField
              fullWidth
              type="number"
              label="Quantity"
              value={item.qty}
              onChange={(event) =>
                setItem(
                  (previous) => ({
                    ...previous,
                    qty:
                      event.target.value,
                  })
                )
              }
              inputProps={{
                min: 1,
                step: 1,
              }}
            />

            {/* RATE */}

            <TextField
              fullWidth
              type="number"
              label="Rate"
              value={item.rate}
              onChange={(event) =>
                setItem(
                  (previous) => ({
                    ...previous,
                    rate:
                      event.target.value,
                  })
                )
              }
              inputProps={{
                min: 0,
                step: 0.01,
              }}
            />

            {/* DISCOUNT % */}

            <TextField
              fullWidth
              type="number"
              label="Discount %"
              value={
                item.discount_percent
              }
              onChange={(event) =>
                setItem(
                  (previous) => ({
                    ...previous,
                    discount_percent:
                      event.target.value,
                  })
                )
              }
              inputProps={{
                min: 0,
                max: 100,
                step: 0.01,
              }}
            />

            {/* ITEM TAX % */}

            <TextField
              fullWidth
              type="number"
              label="Tax %"
              value={
                item.tax_percent
              }
              onChange={(event) =>
                setItem(
                  (previous) => ({
                    ...previous,
                    tax_percent:
                      event.target.value,
                  })
                )
              }
              inputProps={{
                min: 0,
                max: 100,
                step: 0.01,
              }}
            />

            {/* ADD BUTTON */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={
                  <AddShoppingCartIcon />
                }
                onClick={
                  handleAddItem
                }
              >
                Add Item
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* =================================================
          SALE ITEMS
      ================================================= */}

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 2 }}
          >
            Sale Items
          </Typography>

          {items.length === 0 ? (
            <Typography
              color="text.secondary"
            >
              No items added.
            </Typography>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection:
                  "column",
                gap: 1,
              }}
            >
              {items.map(
                (
                  currentItem,
                  index
                ) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      border:
                        "1px solid",
                      borderColor:
                        "divider",
                      borderRadius: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display:
                          "grid",
                        gridTemplateColumns:
                          {
                            xs: "1fr",
                            md:
                              "2fr 1fr 1fr 1fr 1fr 1fr auto",
                          },
                        gap: 2,
                        alignItems:
                          "center",
                      }}
                    >
                      <Box>
                        <Typography
                          fontWeight={
                            700
                          }
                        >
                          {
                            currentItem.product_name
                          }
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          SKU:{" "}
                          {
                            currentItem.sku
                          }
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {
                            currentItem.color_name
                          }{" "}
                          /{" "}
                          {
                            currentItem.size_name
                          }
                        </Typography>
                      </Box>

                      <Typography>
                        Qty:{" "}
                        {
                          currentItem.qty
                        }
                      </Typography>

                      <Typography>
                        Rate: ₹
                        {Number(
                          currentItem.rate
                        ).toFixed(
                          2
                        )}
                      </Typography>

                      <Typography>
                        Discount:{" "}
                        {Number(
                          currentItem.discount_percent
                        ).toFixed(
                          2
                        )}
                        %
                      </Typography>

                      <Typography>
                        Tax:{" "}
                        {Number(
                          currentItem.tax_percent
                        ).toFixed(
                          2
                        )}
                        %
                      </Typography>

                      <Typography
                        fontWeight={700}
                      >
                        ₹
                        {Number(
                          currentItem.amount
                        ).toFixed(
                          2
                        )}
                      </Typography>

                      <Button
                        color="error"
                        size="small"
                        onClick={() =>
                          handleRemoveItem(
                            index
                          )
                        }
                      >
                        Remove
                      </Button>
                    </Box>
                  </Box>
                )
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <Card>
        <CardContent>
          <Box
            sx={{
              maxWidth: 500,
              ml: "auto",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ mb: 2 }}
            >
              Summary
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                mb: 1,
              }}
            >
              <Typography>
                Subtotal
              </Typography>

              <Typography fontWeight={700}>
                ₹
                {subtotal.toFixed(
                  2
                )}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                mb: 1,
              }}
            >
              <Typography>
                Discount
              </Typography>

              <Typography>
                ₹
                {totalDiscount.toFixed(
                  2
                )}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                mb: 1,
              }}
            >
              <Typography>
                {taxType}{" "}
                {Number(
                  taxPercent
                ).toFixed(2)}
                %
              </Typography>

              <Typography>
                ₹
                {totalTax.toFixed(
                  2
                )}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
              >
                Grand Total
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
              >
                ₹
                {grandTotal.toFixed(
                  2
                )}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={
                <SaveIcon />
              }
              onClick={
                handleSaveSale
              }
              disabled={
                saving ||
                items.length === 0
              }
              sx={{ mt: 2 }}
            >
              {saving
                ? "Saving..."
                : "Save Sale"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* =================================================
          ERROR
      ================================================= */}

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
        >
          {error}
        </Alert>
      </Snackbar>

      {/* =================================================
          SUCCESS
      ================================================= */}

      <Snackbar
        open={Boolean(success)}
        autoHideDuration={5000}
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