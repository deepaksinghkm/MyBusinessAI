import { Box, Typography } from "@mui/material";

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h4">
        Dashboard
      </Typography>

      <Typography sx={{ mt: 2 }}>
        Welcome to MyBusinessAI ERP
      </Typography>
    </Box>
  );
}