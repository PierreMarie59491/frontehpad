import axios from "axios";
import apiClient from "../services/api";

const BACKEND_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const API = `${BACKEND_URL}/api`;

/**
 * Enregistre un utilisateur
 */
export const register = (formData) => {
  return axios.post(`${API}/auth/register`, {
    name: formData.name,
    email: formData.email,
    password: formData.password,
  });
};

/**
 * Connexion utilisateur avec stockage du token
 */
export const login = async (credentials) => {
  const response = await apiClient.post("/auth/login", {
    email: credentials.email,
    password: credentials.password,
  });

  return response.data; // Contient access_token
};

/**
 * Récupère l'utilisateur connecté
 */
export const getCurrentUser = () => {
  return apiClient.get("/auth/me"); // ✅ corrigé et simplifié
};
