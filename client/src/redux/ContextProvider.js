import React, { createContext, useContext, useState, useEffect } from "react";

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  // Initialize the theme mode from local storage or default to "Light"
  const [currentMode, setCurrentMode] = useState(
    localStorage.getItem("themeMode") || "Light"
  );

  const setMode = e => {
    const selectedMode = e.target.value;
    setCurrentMode(selectedMode);
    localStorage.setItem("themeMode", selectedMode);
  };

  useEffect(() => {
    // Add an event listener to update the theme mode when the local storage changes
    const handleStorageChange = () => {
      setCurrentMode(localStorage.getItem("themeMode") || "Light");
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      // Cleanup the event listener when the component is unmounted
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <StateContext.Provider
      value={{
        currentMode,
        setMode
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
