import { createContext, useContext, useState } from "react";
import WindowRegistry from "../core/WindowRegistry";

const WindowManagerContext = createContext();

export function WindowManagerProvider({ children }) {
  const [windows, setWindows] = useState([]);

  const openWindow = (moduleId) => {
    const config = WindowRegistry[moduleId];

    if (!config) return;

    setWindows((prev) => {
      const exists = prev.find(
        (w) => w.id === moduleId
      );

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
    setWindows((prev) => {
      const remaining = prev.filter(
        (w) => w.id !== id
      );

      const nextActive =
        remaining.length > 0
          ? remaining[remaining.length - 1].id
          : null;

      return prev.map((w) => ({
        ...w,
        minimized:
          w.id === id
            ? true
            : w.minimized,
        active:
          w.id === id
            ? false
            : w.id === nextActive,
      }));
    });
  };

  const maximizeWindow = (id) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              maximized: !w.maximized,
              active: true,
            }
          : w
      )
    );
  };

  const activateWindow = (id) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              minimized: false,
              active: true,
            }
          : {
              ...w,
              active: false,
            }
      )
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