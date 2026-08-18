import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

import AssessmentIcon from "@mui/icons-material/Assessment";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";

import { useWindowManager } from "../../context/WindowManager";

export default function ReportsPage() {
  const { openWindow } = useWindowManager();

  return (
    <Box
      sx={{
        p: 3,
        height: "100%",
        background: "#f8fafc",
        overflow: "auto",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: "#0f172a",
          mb: 0.5,
        }}
      >
        Reports
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "#64748b",
          mb: 3,
        }}
      >
        Business reports and transaction analysis
      </Typography>

      <Card
        elevation={2}
        sx={{
          maxWidth: 420,
          borderRadius: 3,
        }}
      >
        <CardContent>
          <PointOfSaleIcon
            sx={{
              fontSize: 42,
              color: "#1976d2",
              mb: 1,
            }}
          />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
            }}
          >
            Sales Register
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              mt: 1,
              mb: 2,
            }}
          >
            View sales invoices, customers, amounts,
            print invoices and download PDF.
          </Typography>

          <Button
            variant="contained"
            startIcon={<AssessmentIcon />}
            onClick={() =>
              openWindow("sales-register")
            }
          >
            Open Sales Register
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
