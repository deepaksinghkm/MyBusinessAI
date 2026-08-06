import { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Divider,
  Box,
  MenuItem,
} from "@mui/material";
import { createCompany } from "../../api/companyApi";

const businessTypes = [
  "Manufacturer",
  "Wholesaler",
  "Distributor",
  "Retailer",
  "Importer",
  "Exporter",
];

const initialFormData = {
  company_name: "",
  legal_name: "",
  brand_name: "",
  gst_no: "",
  pan_no: "",
  contact_person: "",
  mobile: "",
  email: "",
  website: "",
  address1: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
  business_type: "Manufacturer",
  financial_year: "2026-27",
  currency: "INR",
};

export default function CompanyForm({ onSaved }) {
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      const payload = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          value === "" ? null : value,
        ])
      );

      await createCompany(payload);

      alert("Company Saved Successfully");

      setFormData(initialFormData);

      if (onSaved) {
        onSaved();
      }
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Unable to save company");
    }
  };

  return (
    <>
      <Typography variant="h5" fontWeight="bold">
        Company Master
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Company Name"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Legal Name"
            name="legal_name"
            value={formData.legal_name}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Brand Name"
            name="brand_name"
            value={formData.brand_name}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="GST Number"
            name="gst_no"
            value={formData.gst_no}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="PAN Number"
            name="pan_no"
            value={formData.pan_no}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Contact Person"
            name="contact_person"
            value={formData.contact_person}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="email"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Website"
            name="website"
            value={formData.website}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Address"
            name="address1"
            value={formData.address1}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            fullWidth
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            fullWidth
            label="PIN Code"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            select
            fullWidth
            label="Business Type"
            name="business_type"
            value={formData.business_type}
            onChange={handleChange}
          >
            {businessTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={3}>
          <TextField
            fullWidth
            label="Financial Year"
            name="financial_year"
            value={formData.financial_year}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={3}>
          <TextField
            fullWidth
            label="Currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
        >
          Save Company
        </Button>
      </Box>
    </>
  );
}