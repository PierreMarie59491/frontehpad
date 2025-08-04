import React, { useState, useEffect } from "react";
import { useUser } from '../contexts/UserContext';

function ActivityFormModal({ isOpen, onClose, initialData, onSubmit }) {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    duration: "",
    participants: "",
    material: "",
    objectives: "",
    description: "",
    difficulty: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        category: initialData.category || "",
        duration: initialData.duration || "",
        participants: initialData.participants || "",
        material: initialData.material ? initialData.material.join(", ") : "",
        objectives: initialData.objectives ? initialData.objectives.join(", ") : "",
        description: initialData.description || "",
        difficulty: initialData.difficulty || "",
      });
    } else {
      setFormData({
        title: "",
        category: "",
        duration: "",
        participants: "",
        material: "",
        objectives: "",
        description: "",
        difficulty: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      author: user?.name || "Invité",  // Récupère le nom de l'utilisateur connecté ici
      material: formData.material.split(",").map((m) => m.trim()),
      objectives: formData.objectives.split(",").map((o) => o.trim()),
    };

    onSubmit(payload);
  };


  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-4">
          {initialData ? "Modifier Activité" : "Ajouter Activité"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Titre *"
            required
          />
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Catégorie *"
            required
          />
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Durée *"
            required
          />
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            name="participants"
            value={formData.participants}
            onChange={handleChange}
            placeholder="Participants *"
            required
          />
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            name="material"
            value={formData.material}
            onChange={handleChange}
            placeholder="Matériel (séparé par des virgules)"
          />
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            name="objectives"
            value={formData.objectives}
            onChange={handleChange}
            placeholder="Objectifs (séparés par des virgules)"
          />
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-purple-600"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            rows={4}
          />
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            placeholder="Difficulté"
          />
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ActivityFormModal;
