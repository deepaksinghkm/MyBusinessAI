import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
} from "@mui/material";

export default function Header() {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
          }}
        >
          MyBusinessAI ERP
        </Typography>

        <Box>
          <Avatar
            sx={{
              bgcolor: "#1976d2",
            }}
          >
            D
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}