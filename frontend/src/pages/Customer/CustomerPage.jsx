import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";


const API_BASE_URL = "http://127.0.0.1:8000";


const emptyForm = {
  customer_code: "",
  customer_name: "",
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
  remarks: "",
  is_active: true,
};


export default function CustomerPage() {

  const [customers, setCustomers] =
    useState([]);

  const [form, setForm] =
    useState(emptyForm);

  const [editingId, setEditingId] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [search, setSearch] =
    useState("");


  // =====================================================
  // LOAD CUSTOMERS
  // =====================================================

  useEffect(() => {
    loadCustomers();
  }, []);


  const loadCustomers = async () => {

    setLoading(true);
    setError("");

    try {

      const response =
        await fetch(
          `${API_BASE_URL}/customers/`
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.detail ||
          "Unable to load customers."
        );

      }


      setCustomers(data);

    } catch (err) {

      setError(
        err.message ||
        "Unable to load customers."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (
    field,
    value
  ) => {

    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

  };


  // =====================================================
  // SAVE / UPDATE
  // =====================================================

  const handleSubmit = async () => {

    setError("");
    setSuccess("");


    if (!form.customer_code.trim()) {

      setError(
        "Customer Code is required."
      );

      return;

    }


    if (!form.customer_name.trim()) {

      setError(
        "Customer Name is required."
      );

      return;

    }


    setSaving(true);


    try {

      const isEdit =
        editingId !== null;


      const url = isEdit
        ? `${API_BASE_URL}/customers/${editingId}`
        : `${API_BASE_URL}/customers/`;


      const method =
        isEdit ? "PUT" : "POST";


      const payload = {

        customer_code:
          form.customer_code.trim(),

        customer_name:
          form.customer_name.trim(),

        legal_name:
          form.legal_name.trim() ||
          null,

        gst_no:
          form.gst_no.trim() ||
          null,

        pan_no:
          form.pan_no.trim() ||
          null,

        contact_person:
          form.contact_person.trim() ||
          null,

        mobile:
          form.mobile.trim() ||
          null,

        phone:
          form.phone.trim() ||
          null,

        email:
          form.email.trim() ||
          null,

        address1:
          form.address1.trim() ||
          null,

        address2:
          form.address2.trim() ||
          null,

        city:
          form.city.trim() ||
          null,

        state:
          form.state.trim() ||
          null,

        country:
          form.country.trim() ||
          "India",

        pincode:
          form.pincode.trim() ||
          null,

        payment_terms:
          form.payment_terms.trim() ||
          null,

        credit_limit:
          Number(form.credit_limit) ||
          0,

        remarks:
          form.remarks.trim() ||
          null,

        is_active:
          form.is_active,
      };


      const response =
        await fetch(
          url,
          {
            method,

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

        throw new Error(
          data.detail ||
          "Unable to save customer."
        );

      }


      setSuccess(
        isEdit
          ? "Customer updated successfully."
          : "Customer created successfully."
      );


      clearForm();

      await loadCustomers();

    } catch (err) {

      setError(
        err.message ||
        "Unable to save customer."
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (
    customer
  ) => {

    setEditingId(
      customer.id
    );


    setForm({

      customer_code:
        customer.customer_code ||
        "",

      customer_name:
        customer.customer_name ||
        "",

      legal_name:
        customer.legal_name ||
        "",

      gst_no:
        customer.gst_no ||
        "",

      pan_no:
        customer.pan_no ||
        "",

      contact_person:
        customer.contact_person ||
        "",

      mobile:
        customer.mobile ||
        "",

      phone:
        customer.phone ||
        "",

      email:
        customer.email ||
        "",

      address1:
        customer.address1 ||
        "",

      address2:
        customer.address2 ||
        "",

      city:
        customer.city ||
        "",

      state:
        customer.state ||
        "",

      country:
        customer.country ||
        "India",

      pincode:
        customer.pincode ||
        "",

      payment_terms:
        customer.payment_terms ||
        "",

      credit_limit:
        customer.credit_limit ||
        0,

      remarks:
        customer.remarks ||
        "",

      is_active:
        customer.is_active !== false,

    });


    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (
    customer
  ) => {

    const confirmed =
      window.confirm(
        `Delete customer "${customer.customer_name}"?`
      );


    if (!confirmed) {
      return;
    }


    setError("");
    setSuccess("");


    try {

      const response =
        await fetch(
          `${API_BASE_URL}/customers/${customer.id}`,
          {
            method: "DELETE",
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.detail ||
          "Unable to delete customer."
        );

      }


      setSuccess(
        "Customer deleted successfully."
      );


      if (
        editingId === customer.id
      ) {

        clearForm();

      }


      await loadCustomers();

    } catch (err) {

      setError(
        err.message ||
        "Unable to delete customer."
      );

    }

  };


  // =====================================================
  // CLEAR FORM
  // =====================================================

  const clearForm = () => {

    setForm({
      ...emptyForm,
    });

    setEditingId(null);

  };


  // =====================================================
  // SEARCH
  // =====================================================

  const filteredCustomers =
    customers.filter(
      (customer) => {

        const query =
          search
            .trim()
            .toLowerCase();


        if (!query) {
          return true;
        }


        const code =
          String(
            customer.customer_code ||
            ""
          ).toLowerCase();


        const name =
          String(
            customer.customer_name ||
            ""
          ).toLowerCase();


        const mobile =
          String(
            customer.mobile ||
            ""
          ).toLowerCase();


        const gst =
          String(
            customer.gst_no ||
            ""
          ).toLowerCase();


        return (
          code.includes(query) ||
          name.includes(query) ||
          mobile.includes(query) ||
          gst.includes(query)
        );

      }
    );


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
          mb: 2,
          gap: 2,
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
            Customer Master
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
            }}
          >
            Manage customers, contact,
            GST and payment details.
          </Typography>

        </Box>


        <Button
          variant="outlined"
          startIcon={
            <AddIcon />
          }
          onClick={
            clearForm
          }
        >
          New Customer
        </Button>

      </Box>


      {/* ================================================= */}
      {/* ALERTS */}
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
      {/* FORM */}
      {/* ================================================= */}

      <Card
        sx={{
          mb: 3,
          width: "100%",
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
            {editingId
              ? "Edit Customer"
              : "Customer Information"}
          </Typography>


          <Grid
            container
            spacing={2}
          >

            {/* CUSTOMER CODE */}

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >

              <TextField
                fullWidth
                required
                label="Customer Code"
                value={
                  form.customer_code
                }
                onChange={(e) =>
                  handleChange(
                    "customer_code",
                    e.target.value
                  )
                }
              />

            </Grid>


            {/* CUSTOMER NAME */}

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >

              <TextField
                fullWidth
                required
                label="Customer Name"
                value={
                  form.customer_name
                }
                onChange={(e) =>
                  handleChange(
                    "customer_name",
                    e.target.value
                  )
                }
              />

            </Grid>


            {/* LEGAL NAME */}

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >

              <TextField
                fullWidth
                label="Legal Name"
                value={
                  form.legal_name
                }
                onChange={(e) =>
                  handleChange(
                    "legal_name",
                    e.target.value
                  )
                }
              />

            </Grid>


            {/* CONTACT PERSON */}

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >

              <TextField
                fullWidth
                label="Contact Person"
                value={
                  form.contact_person
                }
                onChange={(e) =>
                  handleChange(
                    "contact_person",
                    e.target.value
                  )
                }
              />

            </Grid>


            {/* MOBILE */}

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >

              <TextField
                fullWidth
                label="Mobile"
                value={
                  form.mobile
                }
                onChange={(e) =>
                  handleChange(
                    "mobile",
                    e.target.value
                  )
                }
              />

            </Grid>


            {/* PHONE */}

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >

              <TextField
                fullWidth
                label="Phone"
                value={
                  form.phone
                }
                onChange={(e) =>
                  handleChange(
                    "phone",
                    e.target.value
                  )
                }
              />

            </Grid>


            {/* EMAIL */}

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >

              <TextField
                fullWidth
                type="email"
                label="Email"
                value={
                  form.email
                }
                onChange={(e) =>
                  handleChange(
                    "email",
                    e.target.value
                  )
                }
              />

            </Grid>


            {/* GST */}

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >

              <TextField
                fullWidth
                label="GST No."
                value={
                  form.gst_no
                }
                onChange={(e) =>
                  handleChange(
                    "gst_no",
                    e.target.value
                  )
                }
              />

            </Grid>


            {/* PAN */}

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >

              <TextField
                fullWidth
                label="PAN No."
                value={
                  form.pan_no
                }
                onChange={(e) =>
                  handleChange(
                    "pan_no",
                    e.target.value
                  )
                }
              />

            </Grid>


            {/* ADDRESS 1 */}

            <Grid
              item
              xs={12}
              md={6}
            >

              <TextField
                fullWidth
                label="Address 1"
                value={
                  form.address1
                }
                onChange={(e) =>
                  handleChange(
                    "address1",
                    e.target.value
                  )
                }
              />

            </Grid>


            {/* ADDRESS 2 */}

            <Grid
              item
              xs={12}
              md={6}
            >

              <TextField
                fullWidth
                label="Address 2"
                value={
                  form.address2
                }
                onChange={(e) =>
                  handleChange(
                    "address2",
                    e.target.value
                  )
                }
              />

            </Grid>


            {/* CITY */}

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >

              <TextField
                fullWidth
                label="City"
                value={
                  form.city
                }
                onChange={(e) =>
                  handleChange(
                    "city",
                    e.target.value
                  )
                }
              />

            </Grid>


            {/* STATE */}

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >

              <TextField
                fullWidth
                label="State"
                value={
                  form.state
                }
                onChange={(e) =>
                  handleChange(
                    "state",
                    e.target.value
                  )
                }
              />

            </Grid>


            {/* PINCODE */}

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >

              <TextField
                fullWidth
                label="Pincode"
                value={
                  form.pincode
                }
                onChange={(e) =>
                  handleChange(
                    "pincode",
                    e.target.value
                  )
                }
              />

            </Grid>


            {/* COUNTRY */}

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >

              <TextField
                fullWidth
                label="Country"
                value={
                  form.country
                }
                onChange={(e) =>
                  handleChange(
                    "country",
                    e.target.value
                  )
                }
              />

            </Grid>


            {/* PAYMENT TERMS */}

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >

              <TextField
                fullWidth
                label="Payment Terms"
                placeholder="Cash / 30 Days"
                value={
                  form.payment_terms
                }
                onChange={(e) =>
                  handleChange(
                    "payment_terms",
                    e.target.value
                  )
                }
              />

            </Grid>


            {/* CREDIT LIMIT */}

            <Grid
              item
              xs={12}
              sm={6}
              md={3}
            >

              <TextField
                fullWidth
                type="number"
                label="Credit Limit"
                value={
                  form.credit_limit
                }
                onChange={(e) =>
                  handleChange(
                    "credit_limit",
                    e.target.value
                  )
                }
                inputProps={{
                  min: 0,
                }}
              />

            </Grid>


            {/* REMARKS */}

            <Grid
              item
              xs={12}
              md={6}
            >

              <TextField
                fullWidth
                label="Remarks"
                value={
                  form.remarks
                }
                onChange={(e) =>
                  handleChange(
                    "remarks",
                    e.target.value
                  )
                }
              />

            </Grid>


            {/* ACTIVE */}

            <Grid
              item
              xs={12}
              md={3}
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >

              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      form.is_active
                    }
                    onChange={(e) =>
                      handleChange(
                        "is_active",
                        e.target.checked
                      )
                    }
                  />
                }
                label="Active Customer"
              />

            </Grid>

          </Grid>


          <Divider
            sx={{
              my: 3,
            }}
          />


          {/* BUTTONS */}

          <Box
            sx={{
              display: "flex",
              justifyContent:
                "flex-end",
              gap: 1,
            }}
          >

            <Button
              variant="outlined"
              startIcon={
                <ClearIcon />
              }
              onClick={
                clearForm
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
                handleSubmit
              }
              disabled={
                saving
              }
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Customer"
                : "Save Customer"}
            </Button>

          </Box>

        </CardContent>

      </Card>


      {/* ================================================= */}
      {/* CUSTOMER LIST */}
      {/* ================================================= */}

      <Card
        sx={{
          width: "100%",
        }}
      >

        <CardContent>

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

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              Customers
            </Typography>


            <TextField
              size="small"
              label="Search Customer"
              placeholder="Code / Name / Mobile / GST"
              value={
                search
              }
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              sx={{
                width: {
                  xs: "100%",
                  sm: 320,
                },
              }}
            />

          </Box>


          <TableContainer>

            <Table
              size="small"
              stickyHeader
            >

              <TableHead>

                <TableRow>

                  <TableCell>
                    <strong>
                      Code
                    </strong>
                  </TableCell>

                  <TableCell>
                    <strong>
                      Customer
                    </strong>
                  </TableCell>

                  <TableCell>
                    <strong>
                      Contact
                    </strong>
                  </TableCell>

                  <TableCell>
                    <strong>
                      GST
                    </strong>
                  </TableCell>

                  <TableCell>
                    <strong>
                      City
                    </strong>
                  </TableCell>

                  <TableCell>
                    <strong>
                      Payment
                    </strong>
                  </TableCell>

                  <TableCell>
                    <strong>
                      Credit Limit
                    </strong>
                  </TableCell>

                  <TableCell>
                    <strong>
                      Status
                    </strong>
                  </TableCell>

                  <TableCell
                    align="right"
                  >
                    <strong>
                      Action
                    </strong>
                  </TableCell>

                </TableRow>

              </TableHead>


              <TableBody>

                {filteredCustomers.length ===
                0 ? (

                  <TableRow>

                    <TableCell
                      colSpan={9}
                      align="center"
                    >

                      <Typography
                        sx={{
                          py: 3,
                          color:
                            "#64748b",
                        }}
                      >
                        {loading
                          ? "Loading customers..."
                          : "No customers found."}
                      </Typography>

                    </TableCell>

                  </TableRow>

                ) : (

                  filteredCustomers.map(
                    (customer) => (

                      <TableRow
                        key={
                          customer.id
                        }
                        hover
                      >

                        <TableCell>
                          {
                            customer.customer_code
                          }
                        </TableCell>


                        <TableCell>

                          <Typography
                            sx={{
                              fontWeight:
                                600,
                            }}
                          >
                            {
                              customer.customer_name
                            }
                          </Typography>


                          {customer
                            .legal_name && (

                            <Typography
                              variant="caption"
                              sx={{
                                color:
                                  "#64748b",
                              }}
                            >
                              {
                                customer.legal_name
                              }
                            </Typography>

                          )}

                        </TableCell>


                        <TableCell>

                          {
                            customer.mobile ||
                            customer.phone ||
                            "-"
                          }

                        </TableCell>


                        <TableCell>
                          {
                            customer.gst_no ||
                            "-"
                          }
                        </TableCell>


                        <TableCell>
                          {
                            customer.city ||
                            "-"
                          }
                        </TableCell>


                        <TableCell>
                          {
                            customer.payment_terms ||
                            "-"
                          }
                        </TableCell>


                        <TableCell>
                          ₹{" "}
                          {Number(
                            customer.credit_limit ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </TableCell>


                        <TableCell>

                          <Typography
                            component="span"
                            sx={{
                              fontSize:
                                13,
                              fontWeight:
                                600,
                              color:
                                customer.is_active
                                  ? "success.main"
                                  : "error.main",
                            }}
                          >
                            {customer.is_active
                              ? "Active"
                              : "Inactive"}
                          </Typography>

                        </TableCell>


                        <TableCell
                          align="right"
                        >

                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              handleEdit(
                                customer
                              )
                            }
                          >
                            <EditIcon />
                          </IconButton>


                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleDelete(
                                customer
                              )
                            }
                          >
                            <DeleteIcon />
                          </IconButton>

                        </TableCell>

                      </TableRow>

                    )
                  )

                )}

              </TableBody>

            </Table>

          </TableContainer>

        </CardContent>

      </Card>

    </Box>

  );

}
