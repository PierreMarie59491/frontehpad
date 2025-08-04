import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useUser } from "../contexts/UserContext";

import ActivityFormModal from "../components/ActivityFormModal";

const ActivitySheetsPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = new URLSearchParams({ is_public: "true", limit: "100" });
      const response = await fetch(`/api/activities/?${queryParams.toString()}`);
      if (!response.ok) throw new Error("Erreur lors du chargement des activités");
      const data = await response.json();
      setActivities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || (activity.category && activity.category.toLowerCase() === categoryFilter);
    return matchesSearch && matchesCategory;
  });

  const handleAddClick = () => {
    setSelectedActivity(null);
    setModalOpen(true);
  };

  const handleEditClick = (activity) => {
    setSelectedActivity(activity);
    setModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Confirmez-vous la suppression ?")) return;
    try {
      const response = await fetch(`/api/activities/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erreur lors de la suppression");
      await fetchActivities();
    } catch (err) {
      alert(err.message);
    }
  };

 const handleFormSubmit = async (formData) => {
    try {
      const payload = {
        ...formData,
        author: user?.name || "Invité", // utilise le user du contexte
        material: typeof formData.material === "string"
          ? formData.material.split(",").map(m => m.trim())
          : Array.isArray(formData.material)
            ? formData.material
            : [],
        objectives: typeof formData.objectives === "string"
          ? formData.objectives.split(",").map(o => o.trim())
          : Array.isArray(formData.objectives)
            ? formData.objectives
            : [],
      };

    const method = selectedActivity ? "PUT" : "POST";
    const url = selectedActivity ? `/api/activities/${selectedActivity.id}` : `/api/activities/`;
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Erreur lors de la sauvegarde");
    setModalOpen(false);
    setSelectedActivity(null);
    await fetchActivities();
  } catch (err) {
    alert(err.message);
  }
};


  const ActivityCard = ({ activity }) => (
    <Card
      className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => setSelectedActivity(activity)}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{activity.title}</span>
          <Badge variant="secondary">{activity.category}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-3">{activity.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>⏱️ {activity.duration}</span>
          <span>👥 {activity.participants}</span>
          <Badge variant="outline">{activity.difficulty}</Badge>
        </div>
        <div className="mt-4 flex space-x-2">
          <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleEditClick(activity); }}>
            Modifier
          </Button>
          <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); handleDeleteClick(activity.id); }}>
            Supprimer
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">📋 Fiches d'Activité</h1>
        <Button onClick={handleAddClick} className="bg-purple-600 hover:bg-purple-700">
          ➕ Créer une Fiche
        </Button>
      </div>

      {loading && <p>Chargement des fiches...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        selectedActivity ? (
          // Ici tu peux mettre un composant de détail si tu veux
          <div className="mb-6">
            <h2 className="text-xl font-semibold">{selectedActivity.title}</h2>
            <p>{selectedActivity.description}</p>
            <Button onClick={() => setSelectedActivity(null)}>Retour à la liste</Button>
          </div>
        ) : (
          <Tabs defaultValue="library" className="w-full">
            <TabsContent value="library" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActivities.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-medium mb-2">Aucune activité trouvée</h3>
                    <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
                  </div>
                ) : (
                  filteredActivities.map(activity => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        )
      )}

      <ActivityFormModal
        isOpen={modalOpen}
        initialData={selectedActivity}
        onClose={() => { setModalOpen(false); setSelectedActivity(null); }}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default ActivitySheetsPage;
