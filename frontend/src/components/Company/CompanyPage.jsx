import { useState } from "react";

import {
  Box,
  Typography,
  Divider,
} from "@mui/material";

import CompanyForm from "./CompanyForm";
import CompanyTable from "./CompanyTable";

export default function CompanyPage() {
  const [selectedCompany, setSelectedCompany] =
    useState(null);

  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = () => {
    setSelectedCompany(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleEdit = (company) => {
    setSelectedCompany(company);
  };

  const handleCancelEdit = () => {
    setSelectedCompany(null);
  };

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: "#1e293b",
          mb: 1,
        }}
      >
        Company Master
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "#64748b",
          mb: 2,
        }}
      >
        Manage company information, contact details,
        banking information and invoice settings.
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <CompanyForm
        selectedCompany={selectedCompany}
        onSaved={handleSaved}
        onCancel={handleCancelEdit}
      />

      <Divider sx={{ my: 4 }} />

      <CompanyTable
        refreshKey={refreshKey}
        onEdit={handleEdit}
      />
    </Box>
  );
}