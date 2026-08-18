import { Box, Typography } from "@mui/material";

export default function MasterShortcutBar() {
  const shortcuts = [
    ["F4", "Add"],
    ["F2", "Modify"],
    ["F3", "Delete"],
    ["F6", "Clear"],
    ["Esc", "Close"],
  ];

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        mt: 2,
        p: 1,
        border: "1px solid #d1d5db",
        borderRadius: 1,
        bgcolor: "#f8fafc",
        flexWrap: "wrap",
      }}
    >
      {shortcuts.map(([key, label]) => (
        <Box
          key={key}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.7,
            px: 1,
            py: 0.5,
          }}
        >
          <Box
            sx={{
              px: 0.8,
              py: 0.3,
              border: "1px solid #94a3b8",
              borderRadius: 0.5,
              bgcolor: "#fff",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {key}
          </Box>

          <Typography variant="caption">
            {label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
