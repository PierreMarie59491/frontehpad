import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert("Compte créé !");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.detail || "Erreur lors de l'inscription");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-semibold">Inscription</h2>
      <input
        placeholder="Nom"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Mot de passe"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />
      <button type="submit" className="bg-green-500 text-white p-2 rounded">S'inscrire</button>
    </form>
  );
}
