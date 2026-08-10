import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";


const API_BASE_URL = "http://127.0.0.1:8000";


const emptyForm = {
  supplier_code: "",
  supplier_name: "",
  legal_name: "",
  gst_no: "",
  pan_no: "",
  contact_person: "",
  mobile: "",
  phone: "",
  email: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
  payment_terms: "",
  credit_limit: 0,
  bank_name: "",
  bank_account_no: "",
  ifsc_code: "",
  branch_name: "",
  upi_id: "",
  remarks: "",
  is_active: true,
};


export default function SupplierPage() {

  const [suppliers, setSuppliers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] =
    useState(emptyForm);


  // =====================================================
  // LOAD SUPPLIERS
  // =====================================================

  const loadSuppliers = async () => {

    setLoading(true);

    setError("");

    try {

      const response = await fetch(
        `${API_BASE_URL}/suppliers/`
      );

      if (!response.ok) {

        throw new Error(
          "Failed to load suppliers"
        );
      }

      const data =
        await response.json();

      setSuppliers(data);

    } catch (err) {

      setError(
        err.message ||
        "Unable to load suppliers"
      );

    } finally {

      setLoading(false);
    }
  };


  useEffect(() => {

    loadSuppliers();

  }, []);


  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (event) => {

    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };


  // =====================================================
  // OPEN ADD
  // =====================================================

  const openAdd = () => {

    setEditingId(null);

    setForm({
      ...emptyForm,
    });

    setError("");

    setDialogOpen(true);
  };


  // =====================================================
  // OPEN EDIT
  // =====================================================

  const openEdit = (supplier) => {

    setEditingId(
      supplier.id
    );

    setForm({

      supplier_code:
        supplier.supplier_code || "",

      supplier_name:
        supplier.supplier_name || "",

      legal_name:
        supplier.legal_name || "",

      gst_no:
        supplier.gst_no || "",

      pan_no:
        supplier.pan_no || "",

      contact_person:
        supplier.contact_person || "",

      mobile:
        supplier.mobile || "",

      phone:
        supplier.phone || "",

      email:
        supplier.email || "",

      address1:
        supplier.address1 || "",

      address2:
        supplier.address2 || "",

      city:
        supplier.city || "",

      state:
        supplier.state || "",

      country:
        supplier.country || "India",

      pincode:
        supplier.pincode || "",

      payment_terms:
        supplier.payment_terms || "",

      credit_limit:
        supplier.credit_limit ?? 0,

      bank_name:
        supplier.bank_name || "",

      bank_account_no:
        supplier.bank_account_no || "",

      ifsc_code:
        supplier.ifsc_code || "",

      branch_name:
        supplier.branch_name || "",

      upi_id:
        supplier.upi_id || "",

      remarks:
        supplier.remarks || "",

      is_active:
        supplier.is_active ?? true,
    });

    setError("");

    setDialogOpen(true);
  };


  // =====================================================
  // CLOSE DIALOG
  // =====================================================

  const closeDialog = () => {

    if (saving) {
      return;
    }

    setDialogOpen(false);

    setEditingId(null);

    setForm({
      ...emptyForm,
    });
  };


  // =====================================================
  // SAVE
  // =====================================================

  const handleSave = async () => {

    setError("");

    if (
      !form.supplier_code.trim()
    ) {

      setError(
        "Supplier Code is required."
      );

      return;
    }

    if (
      !form.supplier_name.trim()
    ) {

      setError(
        "Supplier Name is required."
      );

      return;
    }


    setSaving(true);

    try {

      const url = editingId
        ? `${API_BASE_URL}/suppliers/${editingId}`
        : `${API_BASE_URL}/suppliers/`;

      const method = editingId
        ? "PUT"
        : "POST";


      const payload = {

        ...form,

        supplier_code:
          form.supplier_code.trim(),

        supplier_name:
          form.supplier_name.trim(),

        credit_limit:
          Number(form.credit_limit) || 0,
      };


      const response = await fetch(
        url,
        {
          method,

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            payload
          ),
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        let message =
          "Unable to save supplier.";

        if (
          data &&
          data.detail
        ) {

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


      setDialogOpen(false);

      setEditingId(null);

      setForm({
        ...emptyForm,
      });

      await loadSuppliers();

    } catch (err) {

      setError(
        err.message ||
        "Unable to save supplier."
      );

    } finally {

      setSaving(false);
    }
  };


  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (
    supplier
  ) => {

    const confirmed =
      window.confirm(
        `Delete supplier "${supplier.supplier_name}"?`
      );

    if (!confirmed) {
      return;
    }


    try {

      const response =
        await fetch(
          `${API_BASE_URL}/suppliers/${supplier.id}`,
          {
            method: "DELETE",
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.detail ||
          "Unable to delete supplier."
        );
      }


      await loadSuppliers();

    } catch (err) {

      setError(
        err.message ||
        "Unable to delete supplier."
      );
    }
  };


  // =====================================================
  // SEARCH
  // =====================================================

  const filteredSuppliers =
    useMemo(() => {

      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) {
        return suppliers;
      }

      return suppliers.filter(
        (supplier) => {

          const values = [

            supplier.supplier_code,

            supplier.supplier_name,

            supplier.contact_person,

            supplier.mobile,

            supplier.email,

            supplier.gst_no,

            supplier.city,

            supplier.state,
          ];

          return values.some(
            (value) =>
              String(
                value || ""
              )
                .toLowerCase()
                .includes(keyword)
          );
        }
      );

    }, [
      suppliers,
      search,
    ]);


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

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
            Supplier Master
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              mt: 0.5,
            }}
          >
            Manage supplier information,
            contact details, GST and banking
            information.
          </Typography>

        </Box>


        <Button
          variant="contained"
          startIcon={
            <AddIcon />
          }
          onClick={openAdd}
        >
          Add Supplier
        </Button>

      </Box>


      <Divider
        sx={{
          mb: 2,
        }}
      />


      {/* ================================================= */}
      {/* ERROR */}
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


      {/* ================================================= */}
      {/* SEARCH */}
      {/* ================================================= */}

      <TextField
        fullWidth
        size="small"
        placeholder="Search supplier, code, GST, mobile, city..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        sx={{
          mb: 2,
          maxWidth: 650,
        }}
        InputProps={{
          startAdornment: (

            <InputAdornment
              position="start"
            >
              <SearchIcon />
            </InputAdornment>

          ),
        }}
      />


      {/* ================================================= */}
      {/* TABLE */}
      {/* ================================================= */}

      <Card
        elevation={2}
      >

        <CardContent
          sx={{
            p: 0,
            "&:last-child": {
              pb: 0,
            },
          }}
        >

          <Box
            sx={{
              overflowX: "auto",
            }}
          >

            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
              }}
            >

              <thead>

                <tr
                  style={{
                    background:
                      "#f1f5f9",
                  }}
                >

                  {[
                    "Code",
                    "Supplier Name",
                    "Contact Person",
                    "Mobile",
                    "GST No.",
                    "City",
                    "State",
                    "Status",
                    "Actions",
                  ].map(
                    (heading) => (

                      <th
                        key={heading}
                        style={{
                          padding:
                            "12px 10px",
                          textAlign:
                            "left",
                          fontSize:
                            "13px",
                          color:
                            "#334155",
                          borderBottom:
                            "1px solid #e2e8f0",
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {heading}
                      </th>

                    )
                  )}

                </tr>

              </thead>


              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan={9}
                      style={{
                        padding:
                          "30px",
                        textAlign:
                          "center",
                        color:
                          "#64748b",
                      }}
                    >
                      Loading suppliers...
                    </td>

                  </tr>

                ) : filteredSuppliers.length === 0 ? (

                  <tr>

                    <td
                      colSpan={9}
                      style={{
                        padding:
                          "40px",
                        textAlign:
                          "center",
                        color:
                          "#64748b",
                      }}
                    >
                      No suppliers found.
                    </td>

                  </tr>

                ) : (

                  filteredSuppliers.map(
                    (supplier) => (

                      <tr
                        key={
                          supplier.id
                        }
                        style={{
                          borderBottom:
                            "1px solid #e2e8f0",
                        }}
                      >

                        <td
                          style={{
                            padding:
                              "11px 10px",
                            fontWeight:
                              600,
                          }}
                        >
                          {
                            supplier.supplier_code
                          }
                        </td>


                        <td
                          style={{
                            padding:
                              "11px 10px",
                            fontWeight:
                              600,
                          }}
                        >
                          {
                            supplier.supplier_name
                          }
                        </td>


                        <td
                          style={{
                            padding:
                              "11px 10px",
                          }}
                        >
                          {
                            supplier.contact_person ||
                            "-"
                          }
                        </td>


                        <td
                          style={{
                            padding:
                              "11px 10px",
                          }}
                        >
                          {
                            supplier.mobile ||
                            "-"
                          }
                        </td>


                        <td
                          style={{
                            padding:
                              "11px 10px",
                          }}
                        >
                          {
                            supplier.gst_no ||
                            "-"
                          }
                        </td>


                        <td
                          style={{
                            padding:
                              "11px 10px",
                          }}
                        >
                          {
                            supplier.city ||
                            "-"
                          }
                        </td>


                        <td
                          style={{
                            padding:
                              "11px 10px",
                          }}
                        >
                          {
                            supplier.state ||
                            "-"
                          }
                        </td>


                        <td
                          style={{
                            padding:
                              "11px 10px",
                          }}
                        >

                          <Box
                            component="span"
                            sx={{
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              fontSize:
                                "12px",
                              fontWeight: 600,

                              backgroundColor:
                                supplier.is_active
                                  ? "#dcfce7"
                                  : "#fee2e2",

                              color:
                                supplier.is_active
                                  ? "#166534"
                                  : "#991b1b",
                            }}
                          >
                            {
                              supplier.is_active
                                ? "Active"
                                : "Inactive"
                            }
                          </Box>

                        </td>


                        <td
                          style={{
                            padding:
                              "7px 10px",
                            whiteSpace:
                              "nowrap",
                          }}
                        >

                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              openEdit(
                                supplier
                              )
                            }
                          >
                            <EditIcon
                              fontSize="small"
                            />
                          </IconButton>


                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleDelete(
                                supplier
                              )
                            }
                          >
                            <DeleteIcon
                              fontSize="small"
                            />
                          </IconButton>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </Box>

        </CardContent>

      </Card>


      {/* ================================================= */}
      {/* ADD / EDIT DIALOG */}
      {/* ================================================= */}

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="lg"
      >

        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            fontWeight: 700,
          }}
        >

          {editingId
            ? "Edit Supplier"
            : "Add Supplier"}

          <IconButton
            onClick={closeDialog}
            disabled={saving}
          >
            <CloseIcon />
          </IconButton>

        </DialogTitle>


        <DialogContent
          dividers
        >

          <Grid
            container
            spacing={2}
          >

            {/* =========================================== */}
            {/* BASIC */}
            {/* =========================================== */}

            <Grid
              item
              xs={12}
            >

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: "#173b68",
                  mb: 1,
                }}
              >
                Basic Information
              </Typography>

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <TextField
                fullWidth
                required
                label="Supplier Code"
                name="supplier_code"
                value={
                  form.supplier_code
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <TextField
                fullWidth
                required
                label="Supplier Name"
                name="supplier_name"
                value={
                  form.supplier_name
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <TextField
                fullWidth
                label="Legal Name"
                name="legal_name"
                value={
                  form.legal_name
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <TextField
                fullWidth
                label="GST Number"
                name="gst_no"
                value={
                  form.gst_no
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <TextField
                fullWidth
                label="PAN Number"
                name="pan_no"
                value={
                  form.pan_no
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <TextField
                fullWidth
                label="Contact Person"
                name="contact_person"
                value={
                  form.contact_person
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            {/* =========================================== */}
            {/* CONTACT */}
            {/* =========================================== */}

            <Grid
              item
              xs={12}
            >

              <Divider
                sx={{
                  mt: 1,
                  mb: 1,
                }}
              />

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: "#173b68",
                  mb: 1,
                }}
              >
                Contact Information
              </Typography>

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <TextField
                fullWidth
                label="Mobile"
                name="mobile"
                value={
                  form.mobile
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={
                  form.phone
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={
                  form.email
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            {/* =========================================== */}
            {/* ADDRESS */}
            {/* =========================================== */}

            <Grid
              item
              xs={12}
            >

              <Divider
                sx={{
                  mt: 1,
                  mb: 1,
                }}
              />

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: "#173b68",
                  mb: 1,
                }}
              >
                Address
              </Typography>

            </Grid>


            <Grid
              item
              xs={12}
              md={6}
            >

              <TextField
                fullWidth
                label="Address Line 1"
                name="address1"
                value={
                  form.address1
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={6}
            >

              <TextField
                fullWidth
                label="Address Line 2"
                name="address2"
                value={
                  form.address2
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={3}
            >

              <TextField
                fullWidth
                label="City"
                name="city"
                value={
                  form.city
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={3}
            >

              <TextField
                fullWidth
                label="State"
                name="state"
                value={
                  form.state
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={3}
            >

              <TextField
                fullWidth
                label="Country"
                name="country"
                value={
                  form.country
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={3}
            >

              <TextField
                fullWidth
                label="Pincode"
                name="pincode"
                value={
                  form.pincode
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            {/* =========================================== */}
            {/* PAYMENT */}
            {/* =========================================== */}

            <Grid
              item
              xs={12}
            >

              <Divider
                sx={{
                  mt: 1,
                  mb: 1,
                }}
              />

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: "#173b68",
                  mb: 1,
                }}
              >
                Payment Information
              </Typography>

            </Grid>


            <Grid
              item
              xs={12}
              md={6}
            >

              <TextField
                fullWidth
                label="Payment Terms"
                name="payment_terms"
                placeholder="e.g. 30 Days"
                value={
                  form.payment_terms
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={6}
            >

              <TextField
                fullWidth
                label="Credit Limit"
                name="credit_limit"
                type="number"
                value={
                  form.credit_limit
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            {/* =========================================== */}
            {/* BANK */}
            {/* =========================================== */}

            <Grid
              item
              xs={12}
            >

              <Divider
                sx={{
                  mt: 1,
                  mb: 1,
                }}
              />

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: "#173b68",
                  mb: 1,
                }}
              >
                Banking Information
              </Typography>

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <TextField
                fullWidth
                label="Bank Name"
                name="bank_name"
                value={
                  form.bank_name
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <TextField
                fullWidth
                label="Account Number"
                name="bank_account_no"
                value={
                  form.bank_account_no
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <TextField
                fullWidth
                label="IFSC Code"
                name="ifsc_code"
                value={
                  form.ifsc_code
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <TextField
                fullWidth
                label="Branch Name"
                name="branch_name"
                value={
                  form.branch_name
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <TextField
                fullWidth
                label="UPI ID"
                name="upi_id"
                value={
                  form.upi_id
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            <Grid
              item
              xs={12}
            >

              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Remarks"
                name="remarks"
                value={
                  form.remarks
                }
                onChange={
                  handleChange
                }
              />

            </Grid>


            <Grid
              item
              xs={12}
            >

              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      form.is_active
                    }
                    onChange={
                      handleChange
                    }
                    name="is_active"
                  />
                }
                label="Active Supplier"
              />

            </Grid>

          </Grid>

        </DialogContent>


        <DialogActions
          sx={{
            p: 2,
          }}
        >

          <Button
            onClick={
              closeDialog
            }
            disabled={saving}
          >
            Cancel
          </Button>


          <Button
            variant="contained"
            onClick={
              handleSave
            }
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Supplier"
                : "Save Supplier"}
          </Button>

        </DialogActions>

      </Dialog>

    </Box>
  );
}
