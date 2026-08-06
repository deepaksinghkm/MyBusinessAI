import { Box, Toolbar } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>

      <Header />

      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "#f4f6f9",
          minHeight: "100vh",
          ml: "250px",
        }}
      >
        <Toolbar />

        <Box sx={{ p: 3 }}>
          {children}
        </Box>

      </Box>

    </Box>
  );
}