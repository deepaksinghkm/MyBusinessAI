import { useState } from "react";
import Draggable from "react-draggable";
import {
  Paper,
  Box,
  Typography,
  IconButton
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from "@mui/icons-material/Minimize";
import CropSquareIcon from "@mui/icons-material/CropSquare";

export default function PopupWindow({
  title,
  children,
  onClose,
}) {

  const [minimized, setMinimized] = useState(false);

  if (minimized) {
    return (
      <Paper
        elevation={6}
        sx={{
          position: "fixed",
          bottom: 15,
          right: 15,
          width: 220,
          zIndex: 9999,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: 1,
            bgcolor: "#1976d2",
            color: "#fff",
            cursor: "pointer"
          }}
          onClick={() => setMinimized(false)}
        >
          <Typography fontSize={14}>
            {title}
          </Typography>

          <MinimizeIcon fontSize="small" />
        </Box>
      </Paper>
    );
  }

  return (

    <Draggable handle=".popup-title">

      <Paper
        elevation={10}
        sx={{
          width: 900,
          height: 600,

          position: "fixed",

          top: 90,
          left: 220,

          borderRadius: 3,

          overflow: "hidden",

          zIndex: 9999,
        }}
      >

        <Box
          className="popup-title"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",

            bgcolor: "#1976d2",
            color: "#fff",

            px: 2,
            py: 1,

            cursor: "move"
          }}
        >

          <Typography fontWeight="bold">
            {title}
          </Typography>

          <Box>

            <IconButton
              size="small"
              onClick={() => setMinimized(true)}
            >
              <MinimizeIcon sx={{ color: "#fff" }} />
            </IconButton>

            <IconButton size="small">
              <CropSquareIcon sx={{ color: "#fff" }} />
            </IconButton>

            <IconButton
              size="small"
              onClick={onClose}
            >
              <CloseIcon sx={{ color: "#fff" }} />
            </IconButton>

          </Box>

        </Box>

        <Box
          sx={{
            p: 2,
            height: "calc(100% - 52px)",
            overflow: "auto",
            bgcolor: "#fff",
          }}
        >
          {children}
        </Box>

      </Paper>

    </Draggable>
  );

}