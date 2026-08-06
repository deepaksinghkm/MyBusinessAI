import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  TextField,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";

export default function Header() {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "#ffffff",
        color: "#111827",
        width: "calc(100% - 250px)",
        ml: "250px",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <Toolbar>

        <Typography
          variant="h6"
          sx={{ fontWeight: 700 }}
        >
          MyBusinessAI ERP
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <TextField
          size="small"
          placeholder="Search..."
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />,
          }}
        />

        <IconButton sx={{ mx: 2 }}>
          <NotificationsIcon />
        </IconButton>

        <Avatar sx={{ bgcolor: "#1976d2" }}>
          D
        </Avatar>

      </Toolbar>
    </AppBar>
  );
}