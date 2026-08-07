import { createContext, useContext, useState } from "react";
import WindowRegistry from "../core/WindowRegistry";

const WindowManagerContext = createContext();

export function WindowManagerProvider({ children }) {
  const [windows, setWindows] = useState([]);

  const openWindow = (moduleId) => {
    const config = WindowRegistry[moduleId];

    if (!config) return;

    setWindows((prev) => {
      const exists = prev.find((w) => w.id === moduleId);

      if (exists) {
        return prev.map((w) =>
          w.id === moduleId
            ? {
                ...w,
                minimized: false,
                active: true,
              }
            : {
                ...w,
                active: false,
              }
        );
      }

      return [
        ...prev.map((w) => ({
          ...w,
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
      prev.filter((w) => w.id !== id)
    );
  };

  const minimizeWindow = (id) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, minimized: true }
          : w
      )
    );
  };

  const maximizeWindow = (id) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              maximized: !w.maximized,
            }
          : w
      )
    );
  };

  const activateWindow = (id) => {
    setWindows((prev) =>
      prev.map((w) => ({
        ...w,
        active: w.id === id,
      }))
    );
  };

  return (
    <WindowManagerContext.Provider
      value={{
        windows,
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