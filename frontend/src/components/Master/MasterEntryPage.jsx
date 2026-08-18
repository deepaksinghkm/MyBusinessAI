import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";

export default function MasterEntryPage({
  title,
  fields = [],
  emptyForm = {},
  onCreate,
  onUpdate,
  onDelete,
  onFind,
}) {
  const [mode, setMode] = useState("new");
  const [form, setForm] = useState(emptyForm);
  const [searchValue, setSearchValue] = useState("");
  const [currentId, setCurrentId] = useState(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const firstInputRef = useRef(null);

  const resetForm = () => {
    setForm({ ...emptyForm });
    setCurrentId(null);
    setSearchValue("");
  };

  const focusFirst = () => {
    setTimeout(() => {
      firstInputRef.current?.focus();
    }, 50);
  };

  const startNew = () => {
    setMode("new");
    resetForm();
    focusFirst();
  };

  const startModify = () => {
    setMode("modify");
    resetForm();
    focusFirst();
  };

  const startDelete = () => {
    setMode("delete");
    resetForm();
    focusFirst();
  };

  const clearLine = () => {
    resetForm();
    focusFirst();
  };

  const cancelOperation = () => {
    setMode("new");
    resetForm();
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const findRecord = async () => {
    if (!searchValue.trim()) {
      setError("Please enter a name/code.");
      return;
    }

    if (!onFind) {
      setError("Find function is not configured.");
      return;
    }

    try {
      const record = await onFind(searchValue.trim());

      if (!record) {
        setError("Record not found.");
        return;
      }

      setCurrentId(record.id);
      setForm((prev) => ({
        ...prev,
        ...record,
      }));

      setSuccess("Record loaded.");
      focusFirst();
    } catch (err) {
      setError(err.message || "Unable to find record.");
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      let result;

      if (mode === "new") {
        if (!onCreate) {
          throw new Error("Create function is not configured.");
        }

        result = await onCreate(form);
        setSuccess("Record created successfully.");
      }

      if (mode === "modify") {
        if (!currentId) {
          throw new Error("First find the record to modify.");
        }

        if (!onUpdate) {
          throw new Error("Update function is not configured.");
        }

        result = await onUpdate(currentId, form);
        setSuccess("Record updated successfully.");
      }

      if (mode === "delete") {
        if (!currentId) {
          throw new Error("First find the record to delete.");
        }

        if (!onDelete) {
          throw new Error("Delete function is not configured.");
        }

        await onDelete(currentId);
        setSuccess("Record deleted successfully.");
      }

      if (result) {
        setCurrentId(result.id ?? currentId);
      }

      if (mode === "delete") {
        resetForm();
        setMode("new");
      }
    } catch (err) {
      setError(err.message || "Operation failed.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const handleKeyboard = (event) => {
      /*
       * Don't trigger shortcuts while typing in
       * browser/system controls unless function key
       * is explicitly pressed.
       */

      if (event.key === "F2") {
        event.preventDefault();
        startModify();
        return;
      }

      if (event.key === "F3") {
        event.preventDefault();
        startDelete();
        return;
      }

      if (event.key === "F4") {
        event.preventDefault();
        startNew();
        return;
      }

      if (event.key === "F6") {
        event.preventDefault();
        clearLine();
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        cancelOperation();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard
      );
    };
  }, []);

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      findRecord();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      cancelOperation();
    }
  };

  const handleFieldKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (mode === "modify" || mode === "delete") {
        findRecord();
        return;
      }

      handleSave();
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "#f8fafc",
        p: 2,
        overflow: "auto",
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1.5,
        }}
      >
        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 700,
            color: "#172033",
          }}
        >
          {title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 0.7,
            flexWrap: "wrap",
          }}
        >
          <Button
            size="small"
            variant={mode === "new" ? "contained" : "outlined"}
            startIcon={<AddIcon />}
            onClick={startNew}
          >
            F4 New
          </Button>

          <Button
            size="small"
            variant={mode === "modify" ? "contained" : "outlined"}
            startIcon={<EditIcon />}
            onClick={startModify}
          >
            F2 Modify
          </Button>

          <Button
            size="small"
            color="error"
            variant={mode === "delete" ? "contained" : "outlined"}
            startIcon={<DeleteIcon />}
            onClick={startDelete}
          >
            F3 Delete
          </Button>

          <Button
            size="small"
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={clearLine}
          >
            F6 Clear
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* MODE */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            color:
              mode === "delete"
                ? "#dc2626"
                : mode === "modify"
                ? "#d97706"
                : "#2563eb",
          }}
        >
          {mode === "new"
            ? "NEW ENTRY"
            : mode === "modify"
            ? "MODIFY ENTRY"
            : "DELETE ENTRY"}
        </Typography>

        {(mode === "modify" || mode === "delete") && (
          <TextField
            size="small"
            label="Enter Name / Code"
            value={searchValue}
            onChange={(event) =>
              setSearchValue(event.target.value)
            }
            onKeyDown={handleSearchKeyDown}
            sx={{ width: 300 }}
            autoFocus
          />
        )}

        {(mode === "modify" || mode === "delete") && (
          <Button
            variant="outlined"
            onClick={findRecord}
          >
            FIND
          </Button>
        )}
      </Box>

      {/* FORM */}

      <Box
        sx={{
          bgcolor: "#ffffff",
          border: "1px solid #dbe2ea",
          borderRadius: 2,
          p: 2.5,
          boxShadow:
            "0 2px 8px rgba(15,23,42,0.06)",
          maxWidth: 1200,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(260px,1fr))",
            gap: 2,
          }}
        >
          {fields.map((field, index) => {
            const value =
              form[field.name] ??
              field.defaultValue ??
              "";

            if (field.type === "textarea") {
              return (
                <TextField
                  key={field.name}
                  inputRef={
                    index === 0
                      ? firstInputRef
                      : undefined
                  }
                  fullWidth
                  multiline
                  minRows={3}
                  label={field.label}
                  name={field.name}
                  value={value}
                  onChange={handleChange}
                  onKeyDown={handleFieldKeyDown}
                  disabled={mode === "delete"}
                  required={field.required}
                />
              );
            }

            if (field.type === "select") {
              return (
                <TextField
                  key={field.name}
                  select
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={value}
                  onChange={handleChange}
                  disabled={mode === "delete"}
                  required={field.required}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">
                    Select {field.label}
                  </option>

                  {(field.options || []).map(
                    (option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    )
                  )}
                </TextField>
              );
            }

            return (
              <TextField
                key={field.name}
                inputRef={
                  index === 0
                    ? firstInputRef
                    : undefined
                }
                fullWidth
                type={field.type || "text"}
                label={field.label}
                name={field.name}
                value={value}
                onChange={handleChange}
                onKeyDown={handleFieldKeyDown}
                disabled={mode === "delete"}
                required={field.required}
                multiline={field.multiline}
              />
            );
          })}
        </Box>

        {/* DELETE INFORMATION */}

        {mode === "delete" && (
          <Alert
            severity="warning"
            sx={{ mt: 2 }}
          >
            Record loaded होने के बाद DELETE दबाकर
            record permanently delete होगा.
          </Alert>
        )}

        {/* ACTIONS */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            mt: 3,
          }}
        >
          <Button
            variant="outlined"
            onClick={clearLine}
            startIcon={<ClearIcon />}
          >
            CLEAR
          </Button>

          <Button
            variant="contained"
            color={
              mode === "delete"
                ? "error"
                : "primary"
            }
            onClick={handleSave}
            disabled={saving}
            startIcon={
              mode === "delete"
                ? <DeleteIcon />
                : <SaveIcon />
            }
          >
            {saving
              ? "Processing..."
              : mode === "new"
              ? "SAVE"
              : mode === "modify"
              ? "UPDATE"
              : "DELETE"}
          </Button>
        </Box>
      </Box>

      {/* SHORTCUT HELP */}

      <Box
        sx={{
          mt: 2,
          color: "#64748b",
          fontSize: 13,
        }}
      >
        F4 = New &nbsp; | &nbsp;
        F2 = Modify &nbsp; | &nbsp;
        F3 = Delete &nbsp; | &nbsp;
        F6 = Clear &nbsp; | &nbsp;
        Esc = Cancel
      </Box>

      {/* MESSAGES */}

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={4000}
        onClose={() => setError("")}
      >
        <Alert
          severity="error"
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(success)}
        autoHideDuration={3000}
        onClose={() => setSuccess("")}
      >
        <Alert
          severity="success"
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}
