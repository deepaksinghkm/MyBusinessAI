import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";

import jsPDF from "jspdf";

import { getSales } from "../../api/salesApi";

export default function SalesRegisterPage() {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadSales = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getSales();

      setSales(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err?.message ||
          "Unable to load sales register"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, []);

  const filteredSales = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    if (!value) {
      return sales;
    }

    return sales.filter((sale) => {
      return (
        String(sale.sale_no || "")
          .toLowerCase()
          .includes(value) ||
        String(sale.invoice_no || "")
          .toLowerCase()
          .includes(value) ||
        String(sale.customer_name || "")
          .toLowerCase()
          .includes(value) ||
        String(sale.customer_mobile || "")
          .toLowerCase()
          .includes(value)
      );
    });
  }, [sales, search]);

  const money = (value) => {
    const number = Number(value || 0);

    return `₹${number.toFixed(2)}`;
  };

  const printInvoice = (sale) => {
    const items = sale.items || [];

    const itemRows = items
      .map(
        (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>Variant #${item.variant_id}</td>
            <td>${item.qty}</td>
            <td>₹${Number(
              item.rate || 0
            ).toFixed(2)}</td>
            <td>₹${Number(
              item.discount || 0
            ).toFixed(2)}</td>
            <td>${Number(
              item.tax_percent || 0
            ).toFixed(2)}%</td>
            <td>₹${Number(
              item.amount || 0
            ).toFixed(2)}</td>
          </tr>
        `
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>
          Invoice ${sale.invoice_no || sale.sale_no}
        </title>

        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 35px;
            color: #111827;
          }

          h1 {
            margin: 0;
            font-size: 25px;
          }

          .header {
            display: flex;
            justify-content: space-between;
            border-bottom: 2px solid #111827;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }

          .customer {
            margin-bottom: 20px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th,
          td {
            border: 1px solid #d1d5db;
            padding: 8px;
            text-align: left;
          }

          th {
            background: #f3f4f6;
          }

          .total {
            margin-top: 20px;
            margin-left: auto;
            width: 300px;
          }

          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
          }

          .grand {
            border-top: 2px solid #111827;
            font-weight: bold;
            font-size: 18px;
          }
        </style>
      </head>

      <body>

        <div class="header">
          <div>
            <h1>SALES INVOICE</h1>
            <div>
              Invoice No:
              <strong>
                ${sale.invoice_no || "-"}
              </strong>
            </div>
          </div>

          <div>
            <div>
              Sale No:
              ${sale.sale_no || "-"}
            </div>

            <div>
              Date:
              ${sale.sale_date || "-"}
            </div>
          </div>
        </div>

        <div class="customer">
          <strong>Bill To:</strong>
          ${sale.customer_name || "-"}
          <br />

          <strong>Mobile:</strong>
          ${sale.customer_mobile || "-"}
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Discount</th>
              <th>Tax</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            ${itemRows}
          </tbody>
        </table>

        <div class="total">

          <div class="total-row">
            <span>Subtotal</span>
            <span>
              ₹${Number(
                sale.subtotal || 0
              ).toFixed(2)}
            </span>
          </div>

          <div class="total-row">
            <span>Discount</span>
            <span>
              ₹${Number(
                sale.discount || 0
              ).toFixed(2)}
            </span>
          </div>

          <div class="total-row">
            <span>Tax</span>
            <span>
              ₹${Number(
                sale.tax || 0
              ).toFixed(2)}
            </span>
          </div>

          <div class="total-row grand">
            <span>Grand Total</span>
            <span>
              ₹${Number(
                sale.grand_total || 0
              ).toFixed(2)}
            </span>
          </div>

        </div>

        ${
          sale.remarks
            ? `<p><strong>Remarks:</strong> ${sale.remarks}</p>`
            : ""
        }

      </body>
      </html>
    `;

    const popup = window.open(
      "",
      "_blank",
      "width=1000,height=800"
    );

    if (!popup) {
      alert(
        "Please allow popups to print the invoice."
      );
      return;
    }

    popup.document.open();
    popup.document.write(html);
    popup.document.close();

    popup.onload = () => {
      popup.focus();
      popup.print();
    };
  };

  const downloadInvoice = (sale) => {
    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(18);
    doc.text("SALES INVOICE", 20, y);

    y += 10;

    doc.setFontSize(11);

    doc.text(
      `Invoice No: ${
        sale.invoice_no || "-"
      }`,
      20,
      y
    );

    doc.text(
      `Sale No: ${sale.sale_no || "-"}`,
      120,
      y
    );

    y += 8;

    doc.text(
      `Date: ${sale.sale_date || "-"}`,
      20,
      y
    );

    y += 12;

    doc.text(
      `Customer: ${
        sale.customer_name || "-"
      }`,
      20,
      y
    );

    y += 7;

    doc.text(
      `Mobile: ${
        sale.customer_mobile || "-"
      }`,
      20,
      y
    );

    y += 12;

    doc.line(20, y, 190, y);

    y += 8;

    doc.text("Item", 20, y);
    doc.text("Qty", 100, y);
    doc.text("Rate", 125, y);
    doc.text("Amount", 165, y);

    y += 6;

    doc.line(20, y, 190, y);

    y += 8;

    (sale.items || []).forEach(
      (item, index) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }

        doc.text(
          `Variant #${item.variant_id}`,
          20,
          y
        );

        doc.text(
          String(item.qty || 0),
          100,
          y
        );

        doc.text(
          `₹${Number(
            item.rate || 0
          ).toFixed(2)}`,
          125,
          y
        );

        doc.text(
          `₹${Number(
            item.amount || 0
          ).toFixed(2)}`,
          165,
          y
        );

        y += 8;
      }
    );

    y += 5;

    doc.line(110, y, 190, y);

    y += 9;

    doc.text(
      `Subtotal: ${money(
        sale.subtotal
      )}`,
      120,
      y
    );

    y += 7;

    doc.text(
      `Discount: ${money(
        sale.discount
      )}`,
      120,
      y
    );

    y += 7;

    doc.text(
      `Tax: ${money(sale.tax)}`,
      120,
      y
    );

    y += 9;

    doc.setFontSize(13);

    doc.text(
      `Grand Total: ${money(
        sale.grand_total
      )}`,
      120,
      y
    );

    const filename =
      sale.invoice_no ||
      sale.sale_no ||
      "invoice";

    doc.save(
      `${filename}.pdf`
    );
  };

  return (
    <Box
      sx={{
        p: 2.5,
        height: "100%",
        background: "#f8fafc",
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Sales Register
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
            }}
          >
            Sales invoice transaction register
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadSales}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
        }}
      >
        <TextField
          fullWidth
          size="small"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search Invoice No, Sale No, Customer or Mobile..."
          InputProps={{
            startAdornment: (
              <SearchIcon
                sx={{
                  mr: 1,
                  color: "#64748b",
                }}
              />
            ),
          }}
        />
      </Paper>

      {error && (
        <Paper
          sx={{
            p: 2,
            mb: 2,
            color: "#b91c1c",
            background: "#fef2f2",
          }}
        >
          {error}
        </Paper>
      )}

      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {loading ? (
          <Box
            sx={{
              p: 5,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{
                  background: "#0f172a",
                }}
              >
                <TableCell sx={{ color: "#fff" }}>
                  #
                </TableCell>

                <TableCell sx={{ color: "#fff" }}>
                  Invoice No
                </TableCell>

                <TableCell sx={{ color: "#fff" }}>
                  Sale No
                </TableCell>

                <TableCell sx={{ color: "#fff" }}>
                  Date
                </TableCell>

                <TableCell sx={{ color: "#fff" }}>
                  Customer
                </TableCell>

                <TableCell
                  align="right"
                  sx={{ color: "#fff" }}
                >
                  Amount
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ color: "#fff" }}
                >
                  Items
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ color: "#fff" }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredSales.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    sx={{
                      py: 5,
                      color: "#64748b",
                    }}
                  >
                    No sales found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSales.map(
                  (sale, index) => (
                    <TableRow
                      key={sale.id}
                      hover
                    >
                      <TableCell>
                        {index + 1}
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={
                            sale.invoice_no ||
                            "Not Assigned"
                          }
                          color={
                            sale.invoice_no
                              ? "primary"
                              : "default"
                          }
                        />
                      </TableCell>

                      <TableCell>
                        {sale.sale_no}
                      </TableCell>

                      <TableCell>
                        {sale.sale_date}
                      </TableCell>

                      <TableCell>
                        <Typography
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          {sale.customer_name ||
                            "-"}
                        </Typography>

                        {sale.customer_mobile && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#64748b",
                            }}
                          >
                            {
                              sale.customer_mobile
                            }
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell align="right">
                        <Typography
                          sx={{
                            fontWeight: 700,
                          }}
                        >
                          {money(
                            sale.grand_total
                          )}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        {sale.items?.length || 0}
                      </TableCell>

                      <TableCell align="center">
                        <Tooltip title="Print Invoice">
                          <IconButton
                            color="primary"
                            onClick={() =>
                              printInvoice(
                                sale
                              )
                            }
                          >
                            <PrintIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Download PDF">
                          <IconButton
                            color="success"
                            onClick={() =>
                              downloadInvoice(
                                sale
                              )
                            }
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
}