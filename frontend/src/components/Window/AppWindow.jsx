import { Rnd } from "react-rnd";
import {
  Paper,
  Box,
  Typography,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from "@mui/icons-material/Minimize";
import CropSquareIcon from "@mui/icons-material/CropSquare";

import { useWindowManager } from "../../context/WindowManager";

export default function AppWindow({
  window,
  children,
}) {
  const {
    closeWindow,
    minimizeWindow,
  } = useWindowManager();

  return (
    <Rnd
      default={{
        x: window.x,
        y: window.y,
        width: window.width,
        height: window.height,
      }}
      bounds="parent"
      dragHandleClassName="window-title"
      minWidth={600}
      minHeight={350}
    >
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: 3,
        }}
      >
        <Box
          className="window-title"
          sx={{
            height: 42,
            bgcolor: "#1976d2",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            cursor: "move",
          }}
        >
          <Typography fontWeight="bold">
            {window.title}
          </Typography>

          <Box>

            <IconButton
              size="small"
              sx={{ color: "#fff" }}
              onClick={() =>
                minimizeWindow(window.id)
              }
            >
              <MinimizeIcon />
            </IconButton>

            <IconButton
              size="small"
              sx={{ color: "#fff" }}
            >
              <CropSquareIcon />
            </IconButton>

            <IconButton
              size="small"
              sx={{ color: "#fff" }}
              onClick={() =>
                closeWindow(window.id)
              }
            >
              <CloseIcon />
            </IconButton>

          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            bgcolor: "#fff",
            overflow: "auto",
            p: 2,
          }}
        >
          {children}
        </Box>
      </Paper>
    </Rnd>
  );
}