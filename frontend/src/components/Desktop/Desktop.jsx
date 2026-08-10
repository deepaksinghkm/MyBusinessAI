import { useEffect, useRef, useState } from "react";

import {
  Box,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";

import WallpaperIcon from "@mui/icons-material/Wallpaper";
import DeleteIcon from "@mui/icons-material/Delete";

import { useWindowManager } from "../../context/WindowManager";

import AppWindow from "../Window/AppWindow";
import WindowRenderer from "../Window/WindowRenderer";

const STORAGE_KEY =
  "mybusinessai_desktop_background";

/*
 * ADMIN DEFAULT BACKGROUND
 *
 * Abhi admin default image nahi di gayi hai.
 * Isliye gradient background dikhega.
 *
 * Baad me admin default image yahan add
 * kar sakte hain.
 */
const DEFAULT_BACKGROUND = null;

export default function Desktop() {
  const { windows } = useWindowManager();

  const [background, setBackground] =
    useState(DEFAULT_BACKGROUND);

  const fileInputRef = useRef(null);

  /*
   * Load saved background
   */
  useEffect(() => {
    const savedBackground =
      localStorage.getItem(STORAGE_KEY);

    if (savedBackground) {
      setBackground(savedBackground);
    } else {
      setBackground(DEFAULT_BACKGROUND);
    }
  }, []);

  /*
   * Upload background
   */
  const handleBackgroundUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    /*
     * Only images
     */
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");

      event.target.value = "";

      return;
    }

    /*
     * Maximum 5 MB
     */
    if (file.size > 5 * 1024 * 1024) {
      alert(
        "Background image must be 5 MB or smaller."
      );

      event.target.value = "";

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

  /*
   * Remove user background
   */
  const removeBackground = () => {
    localStorage.removeItem(STORAGE_KEY);

    setBackground(DEFAULT_BACKGROUND);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",

        top: 60,
        left: 0,
        right: 0,
        bottom: 48,

        overflow: "hidden",

        /*
         * Desktop background layer
         */
        zIndex: 1,

        background: background
          ? `url("${background}") center center / cover no-repeat`
          : "linear-gradient(135deg,#eef2ff,#dbeafe)",
      }}
    >
      {/* =========================================
          BACKGROUND OVERLAY
      ========================================== */}

      {background && (
        <Box
          sx={{
            position: "absolute",

            inset: 0,

            zIndex: 1,

            background:
              "rgba(15,23,42,0.15)",

            pointerEvents: "none",
          }}
        />
      )}

      {/* =========================================
          WELCOME MESSAGE
      ========================================== */}

      {windows.length === 0 && (
        <Box
          sx={{
            position: "absolute",

            inset: 0,

            zIndex: 2,

            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            textAlign: "center",

            pointerEvents: "none",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 30,

                fontWeight: 700,

                color: background
                  ? "#ffffff"
                  : "#64748b",

                textShadow: background
                  ? "0 2px 8px rgba(0,0,0,0.45)"
                  : "none",
              }}
            >
              Welcome to MyBusinessAI ERP
            </Typography>

            <Typography
              sx={{
                mt: 1,

                color: background
                  ? "#f8fafc"
                  : "#94a3b8",

                textShadow: background
                  ? "0 1px 5px rgba(0,0,0,0.4)"
                  : "none",
              }}
            >
              Manage your business smarter
            </Typography>
          </Box>
        </Box>
      )}

      {/* =========================================
          BACKGROUND CONTROLS
      ========================================== */}

      <Box
        sx={{
          position: "absolute",

          right: 16,

          bottom: 16,

          zIndex: 2000,

          display: "flex",

          gap: 1,

          bgcolor:
            "rgba(255,255,255,0.92)",

          borderRadius: 2,

          p: 0.5,

          boxShadow:
            "0 4px 16px rgba(0,0,0,0.18)",
        }}
      >
        {/* Upload / Change */}

        <Tooltip
          title={
            background
              ? "Change background"
              : "Set background"
          }
        >
          <IconButton
            component="label"
            color="primary"
          >
            <WallpaperIcon />

            <input
              ref={fileInputRef}
              hidden
              type="file"
              accept="image/*"
              onChange={
                handleBackgroundUpload
              }
            />
          </IconButton>
        </Tooltip>

        {/* Remove */}

        {background && (
          <Tooltip
            title="Remove background"
          >
            <IconButton
              color="error"
              onClick={
                removeBackground
              }
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* =========================================
          OPEN WINDOWS
      ========================================== */}

      {windows.map((window) => {
        if (window.minimized) {
          return null;
        }

        return (
          <AppWindow
            key={window.id}
            window={window}
          >
            <WindowRenderer
              window={window}
            />
          </AppWindow>
        );
      })}
    </Box>
  );
}