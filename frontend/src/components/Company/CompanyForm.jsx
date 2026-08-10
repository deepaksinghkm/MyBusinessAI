import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  Alert,
} from "@mui/material";

import {
  createCompany,
  updateCompany,
  uploadCompanyLogo,
} from "../../api/companyApi";

const initialForm = {
  company_name: "",
  legal_name: "",
  brand_name: "",

  gst_no: "",
  pan_no: "",
  cin_no: "",
  msme_no: "",

  address1: "",
  address2: "",

  city: "",
  state: "",
  country: "India",
  pincode: "",

  contact_person: "",
  mobile: "",
  phone: "",

  email: "",
  website: "",

  business_type: "",
  financial_year: "",

  currency: "INR",
  timezone: "Asia/Kolkata",

  invoice_prefix: "INV",
  purchase_prefix: "PUR",
  sales_prefix: "SAL",

  stock_unit: "Pair",
  packing_type: "Carton",
  low_stock_limit: 5,

  bank_name: "",
  bank_account_no: "",
  ifsc_code: "",
  branch_name: "",

  upi_id: "",

  invoice_footer: "",
  terms_conditions: "",

  theme: "light",

  is_active: true,
};

function cleanFormData(data) {
  const cleaned = {
    ...data,
  };

  Object.keys(cleaned).forEach((key) => {
    if (
      typeof cleaned[key] === "string" &&
      cleaned[key].trim() === ""
    ) {
      cleaned[key] = null;
    }
  });

  cleaned.company_name =
    data.company_name.trim();

  cleaned.low_stock_limit =
    Number(data.low_stock_limit || 0);

  cleaned.is_active = Boolean(data.is_active);

  return cleaned;
}

export default function CompanyForm({
  selectedCompany,
  onSaved,
  onCancel,
}) {
  const [formData, setFormData] =
    useState(initialForm);

  const [logoFile, setLogoFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (selectedCompany) {
      setFormData({
        ...initialForm,
        ...selectedCompany,
        low_stock_limit:
          selectedCompany.low_stock_limit ?? 5,
        is_active:
          selectedCompany.is_active ?? true,
      });
    } else {
      setFormData(initialForm);
    }

    setLogoFile(null);
    setError("");
  }, [selectedCompany]);

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 150 * 1024) {
      setError(
        "Logo file must be 150 KB or smaller."
      );

      event.target.value = "";
      setLogoFile(null);

      return;
    }

    setError("");
    setLogoFile(file);
  };

  const handleSave = async () => {
    setError("");

    if (!formData.company_name.trim()) {
      setError("Company Name is required.");
      return;
    }

    try {
      setLoading(true);

      const payload =
        cleanFormData(formData);

      let savedCompany;

      if (selectedCompany) {
        savedCompany =
          await updateCompany(
            selectedCompany.id,
            payload
          );
      } else {
        savedCompany =
          await createCompany(payload);
      }

      if (logoFile && savedCompany?.id) {
        await uploadCompanyLogo(
          savedCompany.id,
          logoFile
        );
      }

      setFormData(initialForm);
      setLogoFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (onSaved) {
        onSaved();
      }
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
          "Unable to save company."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialForm);
    setLogoFile(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2.5,
        borderRadius: 2,
        border: "1px solid #e2e8f0",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 2,
        }}
      >
        {selectedCompany
          ? "Edit Company"
          : "Add New Company"}
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      <Grid
        container
        spacing={2}
      >
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            required
            label="Company Name"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Legal Name"
            name="legal_name"
            value={formData.legal_name || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Brand Name"
            name="brand_name"
            value={formData.brand_name || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="GST Number"
            name="gst_no"
            value={formData.gst_no || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="PAN Number"
            name="pan_no"
            value={formData.pan_no || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="CIN Number"
            name="cin_no"
            value={formData.cin_no || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="MSME Number"
            name="msme_no"
            value={formData.msme_no || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              mt: 1,
            }}
          >
            Address
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Address Line 1"
            name="address1"
            value={formData.address1 || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Address Line 2"
            name="address2"
            value={formData.address2 || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="State"
            name="state"
            value={formData.state || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Country"
            name="country"
            value={formData.country || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="PIN Code"
            name="pincode"
            value={formData.pincode || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              mt: 1,
            }}
          >
            Contact Information
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Contact Person"
            name="contact_person"
            value={
              formData.contact_person || ""
            }
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Mobile"
            name="mobile"
            value={formData.mobile || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Website"
            name="website"
            value={formData.website || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Business Type"
            name="business_type"
            value={
              formData.business_type || ""
            }
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Financial Year"
            name="financial_year"
            placeholder="2026-27"
            value={
              formData.financial_year || ""
            }
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              mt: 1,
            }}
          >
            Invoice & Stock Settings
          </Typography>
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Currency"
            name="currency"
            value={formData.currency || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Timezone"
            name="timezone"
            value={formData.timezone || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            label="Invoice Prefix"
            name="invoice_prefix"
            value={
              formData.invoice_prefix || ""
            }
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            label="Purchase Prefix"
            name="purchase_prefix"
            value={
              formData.purchase_prefix || ""
            }
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            label="Sales Prefix"
            name="sales_prefix"
            value={
              formData.sales_prefix || ""
            }
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Stock Unit"
            name="stock_unit"
            value={formData.stock_unit || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Packing Type"
            name="packing_type"
            value={
              formData.packing_type || ""
            }
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type="number"
            label="Low Stock Limit"
            name="low_stock_limit"
            value={
              formData.low_stock_limit ?? 5
            }
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              mt: 1,
            }}
          >
            Banking Information
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Bank Name"
            name="bank_name"
            value={formData.bank_name || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Bank Account Number"
            name="bank_account_no"
            value={
              formData.bank_account_no || ""
            }
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="IFSC Code"
            name="ifsc_code"
            value={formData.ifsc_code || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Branch Name"
            name="branch_name"
            value={
              formData.branch_name || ""
            }
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="UPI ID"
            name="upi_id"
            value={formData.upi_id || ""}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              mt: 1,
            }}
          >
            Invoice Information
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Invoice Footer"
            name="invoice_footer"
            value={
              formData.invoice_footer || ""
            }
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Terms & Conditions"
            name="terms_conditions"
            value={
              formData.terms_conditions || ""
            }
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Button
            variant="outlined"
            component="label"
            fullWidth
          >
            {logoFile
              ? logoFile.name
              : "Choose Company Logo"}
            <input
              ref={fileInputRef}
              hidden
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
            />
          </Button>

          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 0.5,
              color: "#64748b",
            }}
          >
            Maximum logo size: 150 KB
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Switch
                checked={
                  Boolean(formData.is_active)
                }
                onChange={handleChange}
                name="is_active"
              />
            }
            label="Company Active"
          />
        </Grid>
      </Grid>

      <Box
        sx={{
          mt: 3,
          display: "flex",
          gap: 1.5,
        }}
      >
        <Button
          variant="contained"
          size="large"
          disabled={loading}
          onClick={handleSave}
        >
          {loading
            ? "Saving..."
            : selectedCompany
            ? "Update Company"
            : "Save Company"}
        </Button>

        {selectedCompany && (
          <Button
            variant="outlined"
            size="large"
            disabled={loading}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        )}
      </Box>
    </Paper>
  );
}