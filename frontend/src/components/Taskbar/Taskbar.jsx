import {
  Box,
  Button,
} from "@mui/material";

import { useWindowManager } from "../../context/WindowManager";

export default function Taskbar() {
  const {
    windows,
    activateWindow,
  } = useWindowManager();

  const handleWindowClick = (window) => {
    activateWindow(window.id);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: 48,
        bgcolor: "#0f172a",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 1.5,
        zIndex: 2000,
        overflowX: "auto",
      }}
    >
      {windows.length === 0 ? (
        <Box
          sx={{
            px: 1,
            color: "#cbd5e1",
            fontSize: 14,
          }}
        >
          Taskbar
        </Box>
      ) : (
        windows.map((window) => (
          <Button
            key={window.id}
            onClick={() =>
              handleWindowClick(window)
            }
            variant="contained"
            size="small"
            sx={{
              minWidth: 140,
              maxWidth: 220,
              justifyContent: "flex-start",
              textTransform: "none",
              color: "#fff",
              bgcolor: window.active
                ? "#1976d2"
                : "#1e293b",
              "&:hover": {
                bgcolor: "#2563eb",
              },
              opacity: window.minimized
                ? 0.7
                : 1,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {window.title}
          </Button>
        ))
      )}
    </Box>
  );
}