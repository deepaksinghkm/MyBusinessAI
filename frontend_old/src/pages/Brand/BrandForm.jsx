import { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Divider,
  Box,
  Switch,
  FormControlLabel,
} from "@mui/material";

import {
  createBrand,
  updateBrand,
} from "../../api/brandApi";

const initialFormData = {
  name: "",
  description: "",
  is_active: true,
};

export default function BrandForm({
  onSaved,
  selectedBrand,
}) {
  const [formData, setFormData] =
    useState(initialFormData);

  useEffect(() => {
    if (selectedBrand) {
      setFormData({
        ...initialFormData,
        ...selectedBrand,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [selectedBrand]);

  const handleChange = (e) => {
    const { name, value, checked, type } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSave = async () => {
    try {
      if (selectedBrand) {
        await updateBrand(
          selectedBrand.id,
          formData
        );

        alert("Brand Updated");
      } else {
        await createBrand(formData);

        alert("Brand Saved");
      }

      setFormData(initialFormData);

      if (onSaved) {
        onSaved();
      }
    } catch (err) {
      console.error(err);

      alert("Unable to save brand");
    }
  };

  return (
    <>
      <Typography
        variant="h5"
        fontWeight="bold"
      >
        Brand Master
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Brand Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.is_active}
                onChange={handleChange}
                name="is_active"
              />
            }
            label="Active"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleSave}
        >
          {selectedBrand
            ? "Update Brand"
            : "Save Brand"}
        </Button>
      </Box>
    </>
  );
}