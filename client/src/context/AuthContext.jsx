import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ========================================
  // CHECK AUTH
  // ========================================

  const checkAuth = async () => {
    try {
      const response = await api.get("/auth/me");

      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // ========================================
  // SIGNUP
  // ========================================

  const signup = async (
    name,
    username,
    email,
    password
  ) => {
    const response = await api.post("/auth/signup", {
      name,
      username,
      email,
      password,
    });

    setUser(response.data.user);

    return response.data;
  };

  // ========================================
  // LOGIN
  // ========================================

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    setUser(response.data.user);

    return response.data;
  };

  // ========================================
  // LOGOUT
  // ========================================

  const logout = async () => {
    await api.post("/auth/logout");

    setUser(null);
  };

  // ========================================
  // CONTEXT VALUE
  // ========================================

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};