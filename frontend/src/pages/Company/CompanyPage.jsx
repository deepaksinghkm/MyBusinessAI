import { useState } from "react";
import { Box, Paper } from "@mui/material";

import CompanyForm from "./CompanyForm";
import CompanyTable from "./CompanyTable";

export default function CompanyPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const handleSaved = () => {
    setRefreshKey((prev) => prev + 1);
    setSelectedCompany(null);
  };

  const handleEdit = (company) => {
    setSelectedCompany(company);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
        }}
      >
        <CompanyForm
          selectedCompany={selectedCompany}
          onSaved={handleSaved}
        />
      </Paper>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
        }}
      >
        <CompanyTable
          refreshKey={refreshKey}
          onEdit={handleEdit}
        />
      </Paper>
    </Box>
  );
}