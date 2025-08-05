import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useToast } from "../hooks/use-toast";

const CreateActivityPage = () => {
  const navigate = useNavigate();
  const { user, updateUser, addXP, unlockBadge } = useUser();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    duration: "",
    participants: "",
    description: "",
    difficulty: "",
    objectives: [""],
    material: [""],
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    if (
      !formData.title.trim() ||
      !formData.category.trim() ||
      !formData.duration.trim() ||
      !formData.participants.trim() ||
      !formData.description.trim() ||
      !formData.difficulty.trim()
    ) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return false;
    }
    // Check objectives and material have at least one non-empty
    if (formData.objectives.every((obj) => obj.trim() === "")) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter au moins un objectif",
        variant: "destructive",
      });
      return false;
    }
    if (formData.material.every((mat) => mat.trim() === "")) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter au moins un matériel",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newActivity = {
      id: `user_${Date.now()}`,
      ...formData,
      author: user.name,
      objectives: formData.objectives.filter((obj) => obj.trim() !== ""),
      material: formData.material.filter((mat) => mat.trim() !== ""),
      createdAt: new Date().toISOString(),
    };

    // Mise à jour user avec la nouvelle activité
    const updatedUser = {
      ...user,
      createdActivities: [...(user.createdActivities || []), newActivity],
    };
    updateUser(updatedUser);

    addXP(50);

    if (!user.createdActivities || user.createdActivities.length === 0) {
      unlockBadge("creator");
    }

    toast({
      title: "Succès ! 🎉",
      description: "Activité créée avec succès (+50 XP)",
      className: "bg-green-100 border-green-500",
    });

    navigate("/activities");

    // Optionnel : reset formulaire si tu restes sur la page
    // setFormData({ title: "", category: "", duration: "", participants: "", description: "", difficulty: "", objectives: [""], material: [""] });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">➕ Créer une Fiche d'Activité</h1>
        <Button onClick={() => navigate("/activities")} variant="outline">
          Annuler
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Informations Générales */}
          <Card>
            <CardHeader>
              <CardTitle>📝 Informations Générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Nom de l'activité"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Catégorie *</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cognitive">Cognitive</SelectItem>
                      <SelectItem value="Physique">Physique</SelectItem>
                      <SelectItem value="Sociale">Sociale</SelectItem>
                      <SelectItem value="Artistique">Artistique</SelectItem>
                      <SelectItem value="Spirituelle">Spirituelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Durée *</label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    placeholder="ex: 45 min"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Participants *</label>
                  <Input
                    value={formData.participants}
                    onChange={(e) => handleInputChange("participants", e.target.value)}
                    placeholder="ex: 6-8 personnes"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Difficulté *</label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => handleInputChange("difficulty", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Facile">Facile</SelectItem>
                      <SelectItem value="Moyenne">Moyenne</SelectItem>
                      <SelectItem value="Difficile">Difficile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Décrivez l'activité, son déroulement, les bénéfices attendus..."
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Objectifs */}
          <Card>
            <CardHeader>
              <CardTitle>🎯 Objectifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={objective}
                      onChange={(e) => handleArrayChange("objectives", index, e.target.value)}
                      placeholder="Objectif de l'activité"
                      className="flex-1"
                    />
                    {formData.objectives.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeArrayItem("objectives", index)}
                        variant="outline"
                        size="sm"
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" onClick={() => addArrayItem("objectives")} variant="outline" size="sm">
                  + Ajouter un objectif
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Matériel */}
          <Card>
            <CardHeader>
              <CardTitle>🛠️ Matériel Nécessaire</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {formData.material.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={item}
                      onChange={(e) => handleArrayChange("material", index, e.target.value)}
                      placeholder="Matériel ou équipement"
                      className="flex-1"
                    />
                    {formData.material.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeArrayItem("material", index)}
                        variant="outline"
                        size="sm"
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" onClick={() => addArrayItem("material")} variant="outline" size="sm">
                  + Ajouter du matériel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button type="button" onClick={() => navigate("/activities")} variant="outline">
              Annuler
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              Créer l'Activité
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateActivityPage;
