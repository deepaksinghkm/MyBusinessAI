import { createContext, useContext, useState } from "react";
import WindowRegistry from "../core/WindowRegistry";

const WindowManagerContext = createContext(null);

export function WindowManagerProvider({ children }) {
  const [windows, setWindows] = useState([]);
  const [activeModule, setActiveModule] = useState("dashboard");

  const navigate = (moduleId) => {
    if (!WindowRegistry[moduleId]) {
      return;
    }

    setActiveModule(moduleId);
  };

  // Old compatibility function.
  // Existing components that still call openWindow()
  // will continue to work.
  const openWindow = (moduleId) => {
    navigate(moduleId);

    setWindows((prev) => {
      const exists = prev.find(
        (window) => window.id === moduleId
      );

      if (exists) {
        return prev.map((window) => ({
          ...window,
          active: window.id === moduleId,
          minimized: false,
        }));
      }

      const config = WindowRegistry[moduleId];

      return [
        ...prev.map((window) => ({
          ...window,
          active: false,
        })),
        {
          ...config,
          active: true,
          minimized: false,
          maximized: false,
          x: 100,
          y: 70,
        },
      ];
    });
  };

  const closeWindow = (id) => {
    setWindows((prev) =>
      prev.filter((window) => window.id !== id)
    );
  };

  const minimizeWindow = (id) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id
          ? {
              ...window,
              minimized: true,
              active: false,
            }
          : window
      )
    );
  };

  const maximizeWindow = (id) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.id === id
          ? {
              ...window,
              maximized: !window.maximized,
              active: true,
            }
          : window
      )
    );
  };

  const activateWindow = (id) => {
    navigate(id);

    setWindows((prev) =>
      prev.map((window) =>
        window.id === id
          ? {
              ...window,
              minimized: false,
              active: true,
            }
          : {
              ...window,
              active: false,
            }
      )
    );
  };

  return (
    <WindowManagerContext.Provider
      value={{
        windows,
        activeModule,
        navigate,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        activateWindow,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  return useContext(WindowManagerContext);
}
