import React, { createContext, useContext, useState, useEffect } from "react";
import { userApi, configApi } from "../services/api";
import { login, register, getCurrentUser } from "../api/auth";
import apiClient from "../services/api"; // Pour définir l'en-tête Authorization

export const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameConfig, setGameConfig] = useState(null);

  useEffect(() => {
    initializeUser();
    loadGameConfig();
  }, []);

const initializeUser = async () => {
  const access_token = localStorage.getItem("token");
  console.log("Token from localStorage:", access_token);

  if (!access_token) {
    console.log("Pas de token → utilisateur non connecté");
    setUser(null);
    setLoading(false);
    return;
  }

  // Injecte le token AVANT l'appel à getCurrentUser
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  console.log("🔍 Authorization header:", apiClient.defaults.headers.common["Authorization"]);

  try {
    const response = await getCurrentUser(); // Ceci fait un GET /me avec header
    console.log("User data fetched:", response.data);
    setUser(response.data);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    localStorage.removeItem("token");
    setUser(null);
  } finally {
    setLoading(false);
  }
};



  const loadGameConfig = async () => {
    try {
      const response = await configApi.getGameConfig();
      setGameConfig(response.data);
    } catch (error) {
      console.error("Erreur chargement config jeu :", error);
    }
  };

const loginUser = async (email, password) => {
  const { access_token } = await login({ email, password });

  localStorage.setItem("token", access_token);
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

  await initializeUser(); // ✅ récupère l'utilisateur
};


  const registerUser = async (name, email, password) => {
    try {
      await register({ name, email, password });
      await loginUser(email, password);
    } catch (error) {
      throw new Error("Erreur d'inscription : " + (error.response?.data?.detail || error.message));
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete apiClient.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const updateUser = async (updates) => {
    if (!user) return;
    try {
      const response = await userApi.update(user.id, updates);
      setUser(response.data);
    } catch (error) {
      console.error("Erreur mise à jour utilisateur :", error);
    }
  };

  const addXP = async (points) => {
    if (!user) return;
    try {
      const response = await userApi.addXP(user.id, points);
      setUser(response.data);
    } catch (error) {
      console.error("Erreur ajout XP :", error);
    }
  };

  const unlockBadge = async (badgeId) => {
    if (!user || user.badges?.includes(badgeId)) return;
    try {
      const response = await userApi.addBadge(user.id, badgeId);
      setUser(response.data);
    } catch (error) {
      console.error("Erreur déverrouillage badge :", error);
    }
  };

  const completeTheme = async (theme) => {
    if (!user || user.completed_themes?.includes(theme)) return;
    try {
      const response = await userApi.completeTheme(user.id, theme);
      setUser(response.data);
    } catch (error) {
      console.error("Erreur thème complété :", error);
    }
  };

  const value = {
    user,
    loading,
    gameConfig,
    loginUser,
    registerUser,
    logout,
    updateUser,
    addXP,
    unlockBadge,
    completeTheme,
  };

  return <UserContext.Provider value={value}>
  {children}
</UserContext.Provider>;

};
