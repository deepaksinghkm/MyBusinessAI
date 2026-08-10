import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  deleteCompany,
  getCompanies,
} from "../../api/companyApi";

export default function CompanyTable({
  refreshKey,
  onEdit,
}) {
  const [companies, setCompanies] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getCompanies();

      setCompanies(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
          "Unable to load companies."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, [refreshKey]);

  const filteredCompanies =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return companies;
      }

      return companies.filter(
        (company) =>
          [
            company.company_name,
            company.legal_name,
            company.brand_name,
            company.gst_no,
            company.pan_no,
            company.city,
            company.state,
            company.mobile,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(query)
      );
    }, [companies, search]);

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this company?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteCompany(id);

      await loadCompanies();
    } catch (err) {
      console.error(err);

      setError(
        err?.message ||
          "Unable to delete company."
      );
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          gap: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
          }}
        >
          Companies
        </Typography>

        <TextField
          size="small"
          label="Search Company"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          sx={{
            width: {
              xs: "100%",
              md: 320,
            },
          }}
        />
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      <TableContainer
        component={Paper}
        variant="outlined"
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>ID</strong>
              </TableCell>

              <TableCell>
                <strong>Company</strong>
              </TableCell>

              <TableCell>
                <strong>Brand</strong>
              </TableCell>

              <TableCell>
                <strong>GST</strong>
              </TableCell>

              <TableCell>
                <strong>City</strong>
              </TableCell>

              <TableCell>
                <strong>Mobile</strong>
              </TableCell>

              <TableCell align="right">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                >
                  Loading companies...
                </TableCell>
              </TableRow>
            ) : filteredCompanies.length ===
              0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                >
                  No companies found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCompanies.map(
                (company) => (
                  <TableRow
                    key={company.id}
                    hover
                  >
                    <TableCell>
                      {company.id}
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {company.company_name}
                      </Typography>

                      {company.legal_name && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {company.legal_name}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      {company.brand_name ||
                        "-"}
                    </TableCell>

                    <TableCell>
                      {company.gst_no || "-"}
                    </TableCell>

                    <TableCell>
                      {company.city || "-"}
                    </TableCell>

                    <TableCell>
                      {company.mobile || "-"}
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          onEdit(company)
                        }
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() =>
                          handleDelete(
                            company.id
                          )
                        }
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}