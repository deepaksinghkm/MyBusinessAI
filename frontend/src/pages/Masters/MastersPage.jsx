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
    icon: BrandingWatermarkIcon,
  },
  {
    id: "category",
    title: "Category",
    icon: CategoryIcon,
  },
  {
    id: "color",
    title: "Colour",
    icon: PaletteIcon,
  },
  {
    id: "size",
    title: "Size",
    icon: StraightenIcon,
  },
  {
    id: "unit",
    title: "Unit",
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
        Manage common master data.
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
                      fontSize: 40,
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

                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
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
