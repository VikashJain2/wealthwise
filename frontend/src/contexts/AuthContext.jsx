
import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ id: decoded.id, role: decoded.role });
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        email,
        password,
      }, {withCredentials: true});
     localStorage.setItem("token", res.data.token);
    const decoded = jwtDecode(res.data.token);
    console.log("decoded", decoded);
    setUser({ id: decoded.id, role: decoded.role });
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      // setUser(user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.msg || "Login failed",
      };
    }
  };

  const register = async (email, password, role) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        email,
        password,
        role,
      }, {withCredentials: true});
      localStorage.setItem("token", res.data.token);
      const decoded = jwtDecode(res.data.token);
      setUser({ id: decoded.id, role: decoded.role });
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.msg || "Registration failed",
      };
    }
  };

  const logout = async() => {
    localStorage.removeItem("token");
    await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {}, {withCredentials: true});
    delete axios.defaults.headers.common["Authorization"];
    
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
