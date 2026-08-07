import Box from "@mui/material/Box";

import Header from "../components/Header/Header";
import Desktop from "../components/Desktop/Desktop";
import Taskbar from "../components/Taskbar/Taskbar";

export default function MainLayout() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
      }}
    >
      <Header />

      <Desktop />

      <Taskbar />
    </Box>
  );
}