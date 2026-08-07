import { Outlet } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";

import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <Typography variant="h6" fontWeight="bold">
            MyBusinessAI ERP
          </Typography>
        </Toolbar>
      </AppBar>

      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}