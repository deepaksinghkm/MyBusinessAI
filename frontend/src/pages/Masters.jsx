import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
} from "@mui/material";

import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import CategoryIcon from "@mui/icons-material/Category";
import PaletteIcon from "@mui/icons-material/Palette";
import StraightenIcon from "@mui/icons-material/Straighten";
import ScaleIcon from "@mui/icons-material/Scale";

import { useWindowManager } from "../../context/WindowManager";

const masterItems = [
  {
    id: "brand",
    title: "Brand",
    description: "Manage product brands",
    icon: BrandingWatermarkIcon,
  },
  {
    id: "category",
    title: "Category",
    description: "Manage product categories",
    icon: CategoryIcon,
  },
  {
    id: "color",
    title: "Colour",
    description: "Manage product colours",
    icon: PaletteIcon,
  },
  {
    id: "size",
    title: "Size",
    description: "Manage product sizes",
    icon: StraightenIcon,
  },
  {
    id: "unit",
    title: "Unit",
    description: "Manage product units",
    icon: ScaleIcon,
  },
];

export default function MastersPage() {
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
        }}
      >
        Masters
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "#64748b",
          mb: 3,
        }}
      >
        Manage common master data used throughout
        the ERP.
      </Typography>

      <Grid container spacing={2}>
        {masterItems.map((item) => {
          const Icon = item.icon;

          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={item.id}
            >
              <Card
                elevation={2}
                sx={{
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Icon
                    sx={{
                      fontSize: 42,
                      color: "#1976d2",
                    }}
                  />

                  <Typography
                    variant="h6"
                    sx={{
                      mt: 1,
                      fontWeight: 700,
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748b",
                      mt: 0.5,
                      mb: 2,
                    }}
                  >
                    {item.description}
                  </Typography>

                  <Button
                    variant="contained"
                    onClick={() =>
                      openWindow(item.id)
                    }
                  >
                    Open {item.title}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}