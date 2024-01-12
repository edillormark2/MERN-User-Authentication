import React, { createContext, useContext, useState, useEffect } from "react";

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [currentMode, setCurrentMode] = useState("Light");

  const setMode = e => {
    setCurrentMode(e.target.value);
    localStorage.setItem("themeMode", e.target.value);
  };

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
