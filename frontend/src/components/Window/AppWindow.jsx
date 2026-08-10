import { useState } from "react";

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
import FilterNoneIcon from "@mui/icons-material/FilterNone";

import { useWindowManager } from "../../context/WindowManager";

export default function AppWindow({
  window,
  children,
}) {
  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    activateWindow,
  } = useWindowManager();

  const [position, setPosition] = useState({
    x: window.x ?? 100,
    y: window.y ?? 70,
  });

  const [size, setSize] = useState({
    width: window.width ?? 1000,
    height: window.height ?? 650,
  });

  const handleActivate = () => {
    activateWindow(window.id);
  };

  const handleDragStop = (
    event,
    data
  ) => {
    if (window.maximized) {
      return;
    }

    setPosition({
      x: data.x,
      y: data.y,
    });
  };

  const handleResizeStop = (
    event,
    direction,
    ref,
    delta,
    newPosition
  ) => {
    if (window.maximized) {
      return;
    }

    setSize({
      width: ref.offsetWidth,
      height: ref.offsetHeight,
    });

    setPosition({
      x: newPosition.x,
      y: newPosition.y,
    });
  };

  const handleMaximize = () => {
    activateWindow(window.id);

    maximizeWindow(window.id);
  };

  const isMaximized =
    Boolean(window.maximized);

  return (
    <Rnd
      bounds="parent"

      dragHandleClassName="window-title"

      disableDragging={
        isMaximized
      }

      enableResizing={
        !isMaximized
      }

      position={
        isMaximized
          ? {
              x: 0,
              y: 0,
            }
          : position
      }

      size={
        isMaximized
          ? {
              width: "100%",
              height: "100%",
            }
          : size
      }

      minWidth={600}

      minHeight={350}

      onMouseDown={
        handleActivate
      }

      onDragStop={
        handleDragStop
      }

      onResizeStop={
        handleResizeStop
      }

      style={{
        /*
         * Windows background se hamesha
         * upar rahengi.
         */
        zIndex: window.active
          ? 1500
          : 1400,
      }}
    >
      <Paper
        elevation={
          window.active
            ? 12
            : 6
        }
        sx={{
          width: "100%",

          height: "100%",

          display: "flex",

          flexDirection:
            "column",

          overflow: "hidden",

          borderRadius:
            isMaximized
              ? 0
              : 3,
        }}
      >
        {/* WINDOW TITLE BAR */}

        <Box
          className="window-title"

          onMouseDown={
            handleActivate
          }

          sx={{
            height: 42,

            minHeight: 42,

            bgcolor:
              window.active
                ? "#1976d2"
                : "#64748b",

            color: "#fff",

            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",

            px: 1.5,

            cursor:
              isMaximized
                ? "default"
                : "move",

            userSelect: "none",
          }}
        >
          {/* WINDOW TITLE */}

          <Typography
            sx={{
              fontWeight: 600,

              fontSize: 14,

              overflow: "hidden",

              textOverflow:
                "ellipsis",

              whiteSpace:
                "nowrap",
            }}
          >
            {window.title}
          </Typography>

          {/* WINDOW BUTTONS */}

          <Box
            sx={{
              display: "flex",

              alignItems:
                "center",
            }}
          >
            {/* MINIMIZE */}

            <IconButton
              size="small"

              onClick={(event) => {
                event.stopPropagation();

                minimizeWindow(
                  window.id
                );
              }}

              sx={{
                color: "#fff",

                "&:hover": {
                  bgcolor:
                    "rgba(255,255,255,0.15)",
                },
              }}
            >
              <MinimizeIcon
                fontSize="small"
              />
            </IconButton>

            {/* MAXIMIZE / RESTORE */}

            <IconButton
              size="small"

              onClick={(event) => {
                event.stopPropagation();

                handleMaximize();
              }}

              sx={{
                color: "#fff",

                "&:hover": {
                  bgcolor:
                    "rgba(255,255,255,0.15)",
                },
              }}
            >
              {isMaximized ? (
                <FilterNoneIcon
                  fontSize="small"
                />
              ) : (
                <CropSquareIcon
                  fontSize="small"
                />
              )}
            </IconButton>

            {/* CLOSE */}

            <IconButton
              size="small"

              onClick={(event) => {
                event.stopPropagation();

                closeWindow(
                  window.id
                );
              }}

              sx={{
                color: "#fff",

                "&:hover": {
                  bgcolor:
                    "#d32f2f",
                },
              }}
            >
              <CloseIcon
                fontSize="small"
              />
            </IconButton>
          </Box>
        </Box>

        {/* WINDOW CONTENT */}

        <Box
          sx={{
            flex: 1,

            minHeight: 0,

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