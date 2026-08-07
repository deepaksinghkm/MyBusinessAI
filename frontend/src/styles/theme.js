import { createTheme } from "@mui/material/styles";

const theme = createTheme({

  palette: {

    mode: "light",

    primary: {
      main: "#2563eb",
    },

    secondary: {
      main: "#7c3aed",
    },

    background: {
      default: "#edf2f7",
      paper: "#ffffff",
    },

  },

  shape: {
    borderRadius: 14,
  },

  typography: {

    fontFamily:
      "Inter, Roboto, sans-serif",

    h5: {
      fontWeight: 700,
    },

    h6: {
      fontWeight: 700,
    },

  },

});

export default theme;