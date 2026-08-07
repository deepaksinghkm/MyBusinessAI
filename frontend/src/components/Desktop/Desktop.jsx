import { Box } from "@mui/material";
import { useWindowManager } from "../../context/WindowManager";

import AppWindow from "../Window/AppWindow";
import ModuleLoader from "../../core/ModuleLoader";

export default function Desktop() {
  const { windows } = useWindowManager();

  return (
    <Box
      sx={{
        position: "fixed",
        top: 60,
        left: 0,
        right: 0,
        bottom: 48,
        overflow: "hidden",
        background: "linear-gradient(135deg,#eef2ff,#dbeafe)",
      }}
    >
      {windows.length === 0 && (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              fontSize: 34,
              fontWeight: "bold",
              color: "#334155",
            }}
          >
            Welcome to MyBusinessAI ERP
          </Box>

          <Box
            sx={{
              mt: 2,
              color: "#64748b",
            }}
          >
            Click any icon from Header
          </Box>
        </Box>
      )}

      {windows
        .filter((w) => !w.minimized)
        .map((window) => (
          <AppWindow
            key={window.id}
            window={window}
          >
            <ModuleLoader
              module={window.id}
            />
          </AppWindow>
        ))}
    </Box>
  );
}