import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Divider,
} from "@mui/material";

import {
  createCompany,
  updateCompany,
} from "../../api/companyApi";

const initialForm = {
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
};

export default function CompanyForm({
  selectedCompany,
  onSaved,
}) {
  const [formData, setFormData] =
    useState(initialForm);

  useEffect(() => {
    if (selectedCompany) {
      setFormData({
        ...initialForm,
        ...selectedCompany,
      });
    } else {
      setFormData(initialForm);
    }
  }, [selectedCompany]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (selectedCompany) {
        await updateCompany(
          selectedCompany.id,
          formData
        );
        alert("Company Updated Successfully");
      } else {
        await createCompany(formData);
        alert("Company Saved Successfully");
      }

      setFormData(initialForm);

      if (onSaved) {
        onSaved();
      }
    } catch (err) {
      console.error(err);
      alert("Unable to save company");
    }
  };

  return (
    <Box>

      <Typography
        variant="h5"
        fontWeight="bold"
      >
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
            rows={3}
            label="Address"
            name="address1"
            value={formData.address1}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="PIN Code"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
          />
        </Grid>

      </Grid>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
        >
          {selectedCompany
            ? "Update Company"
            : "Save Company"}
        </Button>
      </Box>

    </Box>
  );
}