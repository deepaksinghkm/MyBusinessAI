import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div>
      <h1>MAIN LAYOUT</h1>
      <Outlet />
    </div>
  );
}