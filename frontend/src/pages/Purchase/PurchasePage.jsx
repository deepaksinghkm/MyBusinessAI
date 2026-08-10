import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";


const API_BASE_URL = "http://127.0.0.1:8000";

const today = new Date()
  .toISOString()
  .split("T")[0];


const emptyItem = {
  product_id: "",
  variant_id: "",
  qty: 1,
  rate: "",
  discount: 0,
  tax_percent: 0,
};


export default function PurchasePage() {

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [purchaseNo, setPurchaseNo] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(today);

  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");

  const [supplierId, setSupplierId] = useState("");

  const [remarks, setRemarks] = useState("");

  const [items, setItems] = useState([
    {
      ...emptyItem,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // =====================================================
  // LOAD MASTER DATA
  // =====================================================

  useEffect(() => {
    loadMasterData();
  }, []);


  const loadMasterData = async () => {

    setLoading(true);
    setError("");

    try {

      const [
        supplierResponse,
        productResponse,
        variantResponse,
        colorResponse,
        sizeResponse,
      ] = await Promise.all([

        fetch(
          `${API_BASE_URL}/suppliers/`
        ),

        fetch(
          `${API_BASE_URL}/products/`
        ),

        fetch(
          `${API_BASE_URL}/product-variants/`
        ),

        fetch(
          `${API_BASE_URL}/colors/`
        ),

        fetch(
          `${API_BASE_URL}/sizes/`
        ),

      ]);


      if (
        !supplierResponse.ok ||
        !productResponse.ok ||
        !variantResponse.ok ||
        !colorResponse.ok ||
        !sizeResponse.ok
      ) {

        throw new Error(
          "Unable to load purchase master data."
        );
      }


      const supplierData =
        await supplierResponse.json();

      const productData =
        await productResponse.json();

      const variantData =
        await variantResponse.json();

      const colorData =
        await colorResponse.json();

      const sizeData =
        await sizeResponse.json();


      setSuppliers(
        supplierData
      );

      setProducts(
        productData
      );

      setVariants(
        variantData
      );

      setColors(
        colorData
      );

      setSizes(
        sizeData
      );


    } catch (err) {

      setError(
        err.message ||
        "Unable to load master data."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // COLOR MAP
  // =====================================================

  const colorMap = useMemo(() => {

    const map = {};

    colors.forEach(
      (color) => {
        map[color.id] = color;
      }
    );

    return map;

  }, [colors]);


  // =====================================================
  // SIZE MAP
  // =====================================================

  const sizeMap = useMemo(() => {

    const map = {};

    sizes.forEach(
      (size) => {
        map[size.id] = size;
      }
    );

    return map;

  }, [sizes]);


  // =====================================================
  // SUPPLIER LABEL
  // =====================================================

  const getSupplierLabel = (
    supplier
  ) => {

    if (!supplier) {
      return "";
    }

    const code =
      supplier.supplier_code || "";

    const name =
      supplier.supplier_name || "";


    if (code && name) {

      return `${code} - ${name}`;

    }


    return name || code;

  };


  // =====================================================
  // PRODUCT LABEL
  // =====================================================

  const getProductLabel = (
    product
  ) => {

    if (!product) {
      return "";
    }

    const sku =
      product.sku || "";

    const name =
      product.name || "";


    if (sku && name) {

      return `${sku} - ${name}`;

    }


    return name || sku;

  };


  // =====================================================
  // VARIANT LABEL
  // =====================================================

  const getVariantLabel = (
    variant
  ) => {

    if (!variant) {
      return "";
    }

    const color =
      colorMap[variant.color_id];

    const size =
      sizeMap[variant.size_id];


    const colorName =
      color?.name || "Color";

    const sizeName =
      size?.name || "Size";

    const stock =
      variant.stock ?? 0;


    return (
      `${colorName} / ${sizeName} | Stock: ${stock}`
    );

  };


  // =====================================================
  // PRODUCT VARIANTS
  // =====================================================

  const getProductVariants = (
    productId
  ) => {

    if (!productId) {
      return [];
    }

    return variants.filter(
      (variant) =>
        Number(
          variant.product_id
        ) === Number(productId)
    );

  };


  // =====================================================
  // UPDATE ITEM
  // =====================================================

  const updateItem = (
    index,
    field,
    value
  ) => {

    setItems((previous) => {

      const updated = [
        ...previous,
      ];


      updated[index] = {
        ...updated[index],
        [field]: value,
      };


      if (
        field === "product_id"
      ) {

        updated[index].variant_id =
          "";

      }


      return updated;

    });

  };


  // =====================================================
  // ADD ITEM
  // =====================================================

  const addItem = () => {

    setItems((previous) => [

      ...previous,

      {
        ...emptyItem,
      },

    ]);

  };


  // =====================================================
  // REMOVE ITEM
  // =====================================================

  const removeItem = (
    index
  ) => {

    if (
      items.length === 1
    ) {

      return;

    }


    setItems((previous) =>
      previous.filter(
        (_, i) =>
          i !== index
      )
    );

  };


  // =====================================================
  // ITEM CALCULATION
  // =====================================================

  const calculateItem = (
    item
  ) => {

    const qty =
      Number(item.qty) || 0;

    const rate =
      Number(item.rate) || 0;

    const discount =
      Number(item.discount) || 0;

    const taxPercent =
      Number(item.tax_percent) || 0;


    const gross =
      qty * rate;


    const taxable =
      Math.max(
        0,
        gross - discount
      );


    const tax =
      (
        taxable *
        taxPercent
      ) / 100;


    const total =
      taxable + tax;


    return {
      gross,
      taxable,
      tax,
      total,
    };

  };


  // =====================================================
  // TOTALS
  // =====================================================

  const totals = useMemo(() => {

    let subtotal = 0;
    let tax = 0;
    let grandTotal = 0;


    items.forEach(
      (item) => {

        const result =
          calculateItem(item);


        subtotal +=
          result.taxable;


        tax +=
          result.tax;


        grandTotal +=
          result.total;

      }
    );


    return {
      subtotal,
      tax,
      grandTotal,
    };

  }, [items]);


  // =====================================================
  // SAVE PURCHASE
  // =====================================================

  const savePurchase = async () => {

    setError("");
    setSuccess("");


    if (
      !purchaseNo.trim()
    ) {

      setError(
        "Purchase No. is required."
      );

      return;

    }


    if (!purchaseDate) {

      setError(
        "Purchase Date is required."
      );

      return;

    }


    if (!supplierId) {

      setError(
        "Please select supplier."
      );

      return;

    }


    if (!items.length) {

      setError(
        "Please add at least one item."
      );

      return;

    }


    for (
      let index = 0;
      index < items.length;
      index++
    ) {

      const item =
        items[index];


      if (!item.product_id) {

        setError(
          `Please select Product in row ${
            index + 1
          }.`
        );

        return;

      }


      if (!item.variant_id) {

        setError(
          `Please select Variant in row ${
            index + 1
          }.`
        );

        return;

      }


      if (
        Number(item.qty) <= 0
      ) {

        setError(
          `Quantity must be greater than 0 in row ${
            index + 1
          }.`
        );

        return;

      }


      if (
        item.rate === "" ||
        Number(item.rate) < 0
      ) {

        setError(
          `Please enter valid rate in row ${
            index + 1
          }.`
        );

        return;

      }

    }


    setSaving(true);


    try {

      const payload = {

        purchase_no:
          purchaseNo.trim(),

        purchase_date:
          purchaseDate,

        supplier_id:
          Number(supplierId),

        invoice_no:
          invoiceNo.trim() ||
          null,

        invoice_date:
          invoiceDate ||
          null,

        remarks:
          remarks.trim() ||
          null,

        discount: 0,

        tax: 0,

        items:
          items.map(
            (item) => ({

              variant_id:
                Number(
                  item.variant_id
                ),

              qty:
                Number(
                  item.qty
                ),

              rate:
                Number(
                  item.rate
                ),

              discount:
                Number(
                  item.discount
                ) || 0,

              tax_percent:
                Number(
                  item.tax_percent
                ) || 0,

            })
          ),

      };


      const response =
        await fetch(
          `${API_BASE_URL}/purchases/`,
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


      const data =
        await response.json();


      if (!response.ok) {

        let message =
          "Unable to save purchase.";


        if (data.detail) {

          if (
            Array.isArray(
              data.detail
            )
          ) {

            message =
              data.detail
                .map(
                  (item) =>
                    item.msg
                )
                .join(", ");

          } else {

            message =
              data.detail;

          }

        }


        throw new Error(
          message
        );

      }


      setSuccess(
        `Purchase ${purchaseNo} saved successfully. Stock updated automatically.`
      );


      setPurchaseNo("");
      setPurchaseDate(today);
      setInvoiceNo("");
      setInvoiceDate("");
      setSupplierId("");
      setRemarks("");


      setItems([
        {
          ...emptyItem,
        },
      ]);


      await loadMasterData();


    } catch (err) {

      setError(
        err.message ||
        "Unable to save purchase."
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // RESET
  // =====================================================

  const resetPurchase = () => {

    setPurchaseNo("");
    setPurchaseDate(today);

    setInvoiceNo("");
    setInvoiceDate("");

    setSupplierId("");

    setRemarks("");


    setItems([
      {
        ...emptyItem,
      },
    ]);


    setError("");
    setSuccess("");

  };


  // =====================================================
  // SELECTED SUPPLIER
  // =====================================================

  const selectedSupplier =
    suppliers.find(
      (supplier) =>
        Number(supplier.id) ===
        Number(supplierId)
    ) || null;


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        p: 2,
        boxSizing: "border-box",
      }}
    >

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: 2,
          mb: 2,
        }}
      >

        <Box>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#1e293b",
            }}
          >
            Purchase Entry
          </Typography>


          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
            }}
          >
            Create purchase entry and
            automatically update stock.
          </Typography>

        </Box>


        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexShrink: 0,
          }}
        >

          <Button
            variant="outlined"
            onClick={
              resetPurchase
            }
          >
            Clear
          </Button>


          <Button
            variant="contained"
            startIcon={
              <SaveIcon />
            }
            onClick={
              savePurchase
            }
            disabled={
              saving ||
              loading
            }
          >
            {saving
              ? "Saving..."
              : "Save Purchase"}
          </Button>

        </Box>

      </Box>


      {/* ================================================= */}
      {/* ALERT */}
      {/* ================================================= */}

      {error && (

        <Alert
          severity="error"
          sx={{
            mb: 2,
          }}
          onClose={() =>
            setError("")
          }
        >
          {error}
        </Alert>

      )}


      {success && (

        <Alert
          severity="success"
          sx={{
            mb: 2,
          }}
          onClose={() =>
            setSuccess("")
          }
        >
          {success}
        </Alert>

      )}


      {/* ================================================= */}
      {/* PURCHASE INFORMATION */}
      {/* ================================================= */}

      <Card
        sx={{
          mb: 2,
          width: "100%",
          overflow: "visible",
        }}
      >

        <CardContent>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Purchase Information
          </Typography>


          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md:
                  "1fr 1fr 1.5fr 1fr",
              },

              gap: 2,

              width: "100%",
            }}
          >

            {/* PURCHASE NO */}

            <TextField
              fullWidth
              required
              label="Purchase No."
              value={
                purchaseNo
              }
              onChange={(e) =>
                setPurchaseNo(
                  e.target.value
                )
              }
            />


            {/* PURCHASE DATE */}

            <TextField
              fullWidth
              required
              type="date"
              label="Purchase Date"
              value={
                purchaseDate
              }
              onChange={(e) =>
                setPurchaseDate(
                  e.target.value
                )
              }
              InputLabelProps={{
                shrink: true,
              }}
            />


            {/* SUPPLIER */}

            <Autocomplete
              fullWidth
              options={
                suppliers
              }
              value={
                selectedSupplier
              }
              loading={
                loading
              }
              onChange={(
                event,
                newValue
              ) => {

                setSupplierId(
                  newValue
                    ? newValue.id
                    : ""
                );

              }}
              getOptionLabel={
                getSupplierLabel
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
              filterOptions={(
                options,
                state
              ) => {

                const search =
                  state.inputValue
                    .trim()
                    .toLowerCase();


                if (!search) {
                  return options;
                }


                return options.filter(
                  (supplier) => {

                    const code =
                      String(
                        supplier.supplier_code ||
                          ""
                      ).toLowerCase();


                    const name =
                      String(
                        supplier.supplier_name ||
                          ""
                      ).toLowerCase();


                    return (
                      code.includes(
                        search
                      ) ||
                      name.includes(
                        search
                      )
                    );

                  }
                );

              }}
              renderOption={(
                props,
                supplier
              ) => (

                <Box
                  component="li"
                  {...props}
                  key={
                    supplier.id
                  }
                >

                  <Box>

                    <Typography
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {
                        supplier.supplier_name
                      }
                    </Typography>


                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          "#64748b",
                      }}
                    >
                      Code:{" "}
                      {
                        supplier.supplier_code
                      }
                    </Typography>

                  </Box>

                </Box>

              )}
              renderInput={(
                params
              ) => (

                <TextField
                  {...params}
                  fullWidth
                  required
                  label="Supplier"
                  placeholder="Search supplier..."
                />

              )}
              sx={{
                width: "100%",
                minWidth: 0,
              }}
            />


            {/* SUPPLIER INVOICE NO */}

            <TextField
              fullWidth
              label="Supplier Invoice No."
              value={
                invoiceNo
              }
              onChange={(e) =>
                setInvoiceNo(
                  e.target.value
                )
              }
            />


            {/* INVOICE DATE */}

            <TextField
              fullWidth
              type="date"
              label="Supplier Invoice Date"
              value={
                invoiceDate
              }
              onChange={(e) =>
                setInvoiceDate(
                  e.target.value
                )
              }
              InputLabelProps={{
                shrink: true,
              }}
            />


            {/* REMARKS */}

            <Box
              sx={{
                gridColumn: {
                  xs: "auto",
                  sm: "1 / -1",
                  md: "2 / -1",
                },
              }}
            >

              <TextField
                fullWidth
                label="Remarks"
                value={
                  remarks
                }
                onChange={(e) =>
                  setRemarks(
                    e.target.value
                  )
                }
              />

            </Box>

          </Box>

        </CardContent>

      </Card>


      {/* ================================================= */}
      {/* PURCHASE ITEMS */}
      {/* ================================================= */}

      <Card
        sx={{
          width: "100%",
          overflow: "visible",
        }}
      >

        <CardContent>

          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              Purchase Items
            </Typography>


            <Button
              variant="outlined"
              startIcon={
                <AddIcon />
              }
              onClick={
                addItem
              }
            >
              Add Item
            </Button>

          </Box>


          <Divider
            sx={{
              mb: 2,
            }}
          />


          {/* ================================================= */}
          {/* ITEM HEADER */}
          {/* ================================================= */}

          <Box
            sx={{
              display: {
                xs: "none",
                md: "grid",
              },

              gridTemplateColumns:
                "2fr 2fr 0.8fr 1fr 0.9fr 0.8fr 0.9fr 0.5fr",

              gap: 1,

              background:
                "#f1f5f9",

              p: 1,

              borderRadius: 1,

              mb: 1,
            }}
          >

            <Typography
              fontWeight={700}
              fontSize={13}
            >
              Product
            </Typography>


            <Typography
              fontWeight={700}
              fontSize={13}
            >
              Variant
            </Typography>


            <Typography
              fontWeight={700}
              fontSize={13}
            >
              Qty
            </Typography>


            <Typography
              fontWeight={700}
              fontSize={13}
            >
              Rate
            </Typography>


            <Typography
              fontWeight={700}
              fontSize={13}
            >
              Discount
            </Typography>


            <Typography
              fontWeight={700}
              fontSize={13}
            >
              GST %
            </Typography>


            <Typography
              fontWeight={700}
              fontSize={13}
            >
              Amount
            </Typography>


            <Typography
              fontWeight={700}
              fontSize={13}
            >
              Action
            </Typography>

          </Box>


          {/* ================================================= */}
          {/* ITEM ROWS */}
          {/* ================================================= */}

          {items.map(
            (item, index) => {

              const productVariants =
                getProductVariants(
                  item.product_id
                );


              const selectedProduct =
                products.find(
                  (product) =>
                    Number(
                      product.id
                    ) ===
                    Number(
                      item.product_id
                    )
                ) || null;


              const selectedVariant =
                productVariants.find(
                  (variant) =>
                    Number(
                      variant.id
                    ) ===
                    Number(
                      item.variant_id
                    )
                ) || null;


              const amount =
                calculateItem(
                  item
                );


              return (

                <Box
                  key={index}
                  sx={{
                    display: "grid",

                    gridTemplateColumns: {
                      xs: "1fr",
                      md:
                        "2fr 2fr 0.8fr 1fr 0.9fr 0.8fr 0.9fr 0.5fr",
                    },

                    gap: 1,

                    alignItems:
                      "center",

                    mb: 1,

                    p: 1,

                    border:
                      "1px solid #e2e8f0",

                    borderRadius: 1,

                    overflow:
                      "visible",
                  }}
                >

                  {/* ================================================= */}
                  {/* PRODUCT SEARCH */}
                  {/* ================================================= */}

                  <Autocomplete
                    fullWidth
                    size="small"
                    options={
                      products
                    }
                    value={
                      selectedProduct
                    }
                    loading={
                      loading
                    }
                    onChange={(
                      event,
                      newValue
                    ) => {

                      updateItem(
                        index,
                        "product_id",
                        newValue
                          ? newValue.id
                          : ""
                      );

                    }}
                    getOptionLabel={
                      getProductLabel
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
                    filterOptions={(
                      options,
                      state
                    ) => {

                      const search =
                        state.inputValue
                          .trim()
                          .toLowerCase();


                      if (!search) {
                        return options;
                      }


                      return options.filter(
                        (product) => {

                          const sku =
                            String(
                              product.sku ||
                                ""
                            ).toLowerCase();


                          const name =
                            String(
                              product.name ||
                                ""
                            ).toLowerCase();


                          return (
                            sku.includes(
                              search
                            ) ||
                            name.includes(
                              search
                            )
                          );

                        }
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
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            {
                              product.name
                            }
                          </Typography>


                          <Typography
                            variant="caption"
                            sx={{
                              color:
                                "#64748b",
                            }}
                          >
                            SKU:{" "}
                            {
                              product.sku
                            }

                            {" | "}

                            MRP: ₹
                            {
                              product.mrp
                            }
                          </Typography>

                        </Box>

                      </Box>

                    )}
                    renderInput={(
                      params
                    ) => (

                      <TextField
                        {...params}
                        label="Search Product"
                        placeholder="SKU / Product"
                      />

                    )}
                  />


                  {/* ================================================= */}
                  {/* VARIANT SEARCH */}
                  {/* ================================================= */}

                  <Autocomplete
                    fullWidth
                    size="small"
                    options={
                      productVariants
                    }
                    value={
                      selectedVariant
                    }
                    disabled={
                      !item.product_id
                    }
                    loading={
                      loading
                    }
                    onChange={(
                      event,
                      newValue
                    ) => {

                      updateItem(
                        index,
                        "variant_id",
                        newValue
                          ? newValue.id
                          : ""
                      );

                    }}
                    getOptionLabel={
                      getVariantLabel
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
                    filterOptions={(
                      options,
                      state
                    ) => {

                      const search =
                        state.inputValue
                          .trim()
                          .toLowerCase();


                      if (!search) {
                        return options;
                      }


                      return options.filter(
                        (variant) => {

                          const color =
                            colorMap[
                              variant.color_id
                            ];


                          const size =
                            sizeMap[
                              variant.size_id
                            ];


                          const colorName =
                            String(
                              color?.name ||
                                ""
                            ).toLowerCase();


                          const sizeName =
                            String(
                              size?.name ||
                                ""
                            ).toLowerCase();


                          return (
                            colorName.includes(
                              search
                            ) ||
                            sizeName.includes(
                              search
                            )
                          );

                        }
                      );

                    }}
                    renderOption={(
                      props,
                      variant
                    ) => {

                      const color =
                        colorMap[
                          variant.color_id
                        ];


                      const size =
                        sizeMap[
                          variant.size_id
                        ];


                      return (

                        <Box
                          component="li"
                          {...props}
                          key={
                            variant.id
                          }
                        >

                          <Box
                            sx={{
                              width:
                                "100%",

                              display:
                                "flex",

                              justifyContent:
                                "space-between",

                              gap: 1,
                            }}
                          >

                            <Typography
                              sx={{
                                fontWeight:
                                  600,
                              }}
                            >
                              {
                                color?.name ||
                                "Color"
                              }

                              {" / "}

                              {
                                size?.name ||
                                "Size"
                              }
                            </Typography>


                            <Typography
                              variant="caption"
                              sx={{
                                color:
                                  variant.stock >
                                  0
                                    ? "green"
                                    : "red",

                                fontWeight:
                                  600,
                              }}
                            >
                              Stock:{" "}
                              {
                                variant.stock ??
                                0
                              }
                            </Typography>

                          </Box>

                        </Box>

                      );

                    }}
                    renderInput={(
                      params
                    ) => (

                      <TextField
                        {...params}
                        label="Search Variant"
                        placeholder="Color / Size"
                      />

                    )}
                  />


                  {/* ================================================= */}
                  {/* QTY */}
                  {/* ================================================= */}

                  <TextField
                    size="small"
                    type="number"
                    label="Qty"
                    value={
                      item.qty
                    }
                    onChange={(e) =>
                      updateItem(
                        index,
                        "qty",
                        e.target.value
                      )
                    }
                    inputProps={{
                      min: 1,
                    }}
                  />


                  {/* ================================================= */}
                  {/* RATE */}
                  {/* ================================================= */}

                  <TextField
                    size="small"
                    type="number"
                    label="Rate"
                    value={
                      item.rate
                    }
                    onChange={(e) =>
                      updateItem(
                        index,
                        "rate",
                        e.target.value
                      )
                    }
                    inputProps={{
                      min: 0,
                      step: "0.01",
                    }}
                  />


                  {/* ================================================= */}
                  {/* DISCOUNT */}
                  {/* ================================================= */}

                  <TextField
                    size="small"
                    type="number"
                    label="Discount"
                    value={
                      item.discount
                    }
                    onChange={(e) =>
                      updateItem(
                        index,
                        "discount",
                        e.target.value
                      )
                    }
                    inputProps={{
                      min: 0,
                      step: "0.01",
                    }}
                  />


                  {/* ================================================= */}
                  {/* GST */}
                  {/* ================================================= */}

                  <TextField
                    size="small"
                    type="number"
                    label="GST %"
                    value={
                      item.tax_percent
                    }
                    onChange={(e) =>
                      updateItem(
                        index,
                        "tax_percent",
                        e.target.value
                      )
                    }
                    inputProps={{
                      min: 0,
                      step: "0.01",
                    }}
                  />


                  {/* ================================================= */}
                  {/* AMOUNT */}
                  {/* ================================================= */}

                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize:
                        "14px",
                    }}
                  >
                    ₹
                    {amount.total.toFixed(
                      2
                    )}
                  </Typography>


                  {/* ================================================= */}
                  {/* DELETE */}
                  {/* ================================================= */}

                  <IconButton
                    color="error"
                    onClick={() =>
                      removeItem(
                        index
                      )
                    }
                    disabled={
                      items.length === 1
                    }
                  >
                    <DeleteIcon />
                  </IconButton>

                </Box>

              );

            }
          )}


          {/* ================================================= */}
          {/* TOTALS */}
          {/* ================================================= */}

          <Box
            sx={{
              display: "flex",
              justifyContent:
                "flex-end",
              mt: 3,
            }}
          >

            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: 350,
                },
              }}
            >

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


                <Typography
                  fontWeight={600}
                >
                  ₹
                  {
                    totals.subtotal.toFixed(
                      2
                    )
                  }
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
                  GST
                </Typography>


                <Typography
                  fontWeight={600}
                >
                  ₹
                  {
                    totals.tax.toFixed(
                      2
                    )
                  }
                </Typography>

              </Box>


              <Divider
                sx={{
                  my: 1,
                }}
              />


              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "space-between",
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
                  color="primary"
                >
                  ₹
                  {
                    totals.grandTotal.toFixed(
                      2
                    )
                  }
                </Typography>

              </Box>

            </Box>

          </Box>

        </CardContent>

      </Card>

    </Box>

  );

}