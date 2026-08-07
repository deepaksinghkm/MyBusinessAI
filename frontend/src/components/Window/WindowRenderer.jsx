import { Typography } from "@mui/material";

export default function WindowRenderer({ window }) {
  switch (window.id) {
    case "company":
      return (
        <Typography variant="h5">
          Company Window Working
        </Typography>
      );

    case "brand":
      return (
        <Typography variant="h5">
          Brand Window Working
        </Typography>
      );

    default:
      return (
        <Typography variant="h5">
          Module Not Found
        </Typography>
      );
  }
}