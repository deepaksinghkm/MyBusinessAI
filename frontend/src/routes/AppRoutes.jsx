import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard/Dashboard";
import CompanyPage from "../pages/Company/CompanyPage";
import BrandPage from "../pages/Brand/BrandPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/company"
            element={<CompanyPage />}
          />

          <Route
            path="/brands"
            element={<BrandPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}