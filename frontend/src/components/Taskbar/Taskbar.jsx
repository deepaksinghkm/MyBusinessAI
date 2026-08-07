import { Box } from "@mui/material";

export default function Taskbar() {
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
        px: 2,
        zIndex: 2000,
      }}
    >
      Taskbar
    </Box>
  );
}