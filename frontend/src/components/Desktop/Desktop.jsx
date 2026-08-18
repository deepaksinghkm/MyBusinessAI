import { useEffect, useState } from "react";

import {
  Box,
  Typography,
} from "@mui/material";

import { useWindowManager } from "../../context/WindowManager";

import AppWindow from "../Window/AppWindow";
import WindowRenderer from "../Window/WindowRenderer";

const STORAGE_KEY =
  "mybusinessai_desktop_background";

const DEFAULT_BACKGROUND = null;

export default function Desktop() {
  const { windows } = useWindowManager();

  const [background, setBackground] =
    useState(DEFAULT_BACKGROUND);

  useEffect(() => {
    const loadBackground = () => {
      const saved =
        localStorage.getItem(STORAGE_KEY);

      setBackground(
        saved || DEFAULT_BACKGROUND
      );
    };

    loadBackground();

    window.addEventListener(
      "mybusinessai-background-change",
      loadBackground
    );

    return () => {
      window.removeEventListener(
        "mybusinessai-background-change",
        loadBackground
      );
    };
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 64,
        left: 0,
        right: 0,
        bottom: 48,
        overflow: "hidden",
        zIndex: 1,

        background: background
          ? `url("${background}") center center / cover no-repeat`
          : "linear-gradient(135deg,#eef2ff,#dbeafe)",
      }}
    >
      {/* Background overlay */}

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

      {/* Welcome */}

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
              Your business dashboard
            </Typography>
          </Box>
        </Box>
      )}

      {/* POPUP WINDOWS */}

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
