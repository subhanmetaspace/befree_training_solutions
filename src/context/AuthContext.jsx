// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
   const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("authToken");
    return storedToken && storedToken !== "null" ? storedToken : null;
  });

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) setToken(storedToken);
  }, []);

  const saveToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem("authToken", newToken);
  };

  const clearToken = () => {
    setToken(null);
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ token, saveToken, clearToken }}>
      {children}
    </AuthContext.Provider>
  );
};
