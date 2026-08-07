import MainLayout from "./layouts/MainLayout";
import { WindowManagerProvider } from "./context/WindowManager";

export default function App() {
  return (
    <WindowManagerProvider>
      <MainLayout />
    </WindowManagerProvider>
  );
}