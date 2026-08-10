import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  Typography,
} from "@mui/material";

const STORAGE_KEY = "mybusinessai_dashboard_background";

export default function DashboardPage() {
  const [background, setBackground] =
    useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedBackground =
      localStorage.getItem(STORAGE_KEY);

    if (savedBackground) {
      setBackground(savedBackground);
    }
  }, []);

  const handleBackgroundChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;

      localStorage.setItem(
        STORAGE_KEY,
        imageData
      );

      setBackground(imageData);
    };

    reader.readAsDataURL(file);
  };

  const removeBackground = () => {
    localStorage.removeItem(STORAGE_KEY);
    setBackground("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: "100%",
        overflow: "hidden",
        borderRadius: 2,

        background: background
          ? `url("${background}") center / cover no-repeat`
          : "linear-gradient(135deg, #eef2ff, #dbeafe)",
      }}
    >
      {/* Background Overlay */}
      {background && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "rgba(255,255,255,0.18)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Dashboard Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          p: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#334155",
            mb: 1,
          }}
        >
          Welcome to MyBusinessAI ERP
        </Typography>

        <Typography
          sx={{
            color: "#64748b",
            mb: 3,
          }}
        >
          Your business dashboard
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            component="label"
          >
            {background
              ? "Change Background"
              : "Set Background Photo"}

            <input
              ref={fileInputRef}
              hidden
              type="file"
              accept="image/*"
              onChange={handleBackgroundChange}
            />
          </Button>

          {background && (
            <Button
              variant="outlined"
              color="error"
              onClick={removeBackground}
            >
              Remove Background
            </Button>
          )}
        </Box>

        <Typography
          variant="caption"
          sx={{
            mt: 2,
            color: "#64748b",
          }}
        >
          You can choose your own dashboard
          background photo.
        </Typography>
      </Box>
    </Box>
  );
}