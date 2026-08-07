import { createContext, useContext, useState } from "react";

const WindowContext = createContext();

export function WindowProvider({ children }) {
  const [windows, setWindows] = useState([]);

  const openWindow = (window) => {
    setWindows((prev) => {
      const exists = prev.find((w) => w.id === window.id);

      if (exists) {
        return prev.map((w) =>
          w.id === window.id
            ? { ...w, minimized: false }
            : w
        );
      }

      return [
        ...prev,
        {
          ...window,
          minimized: false,
          maximized: false,
        },
      ];
    });
  };

  const closeWindow = (id) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
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
          ? { ...w, maximized: !w.maximized }
          : w
      )
    );
  };

  return (
    <WindowContext.Provider
      value={{
        windows,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
}

export function useWindow() {
  return useContext(WindowContext);
}