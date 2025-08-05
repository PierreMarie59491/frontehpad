import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { configApi } from "../services/api";

const HomePage = () => {
  const { user, loading, gameConfig } = useUser();
  const [themes, setThemes] = useState([]);
  const [loadingThemes, setLoadingThemes] = useState(true);

  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    try {
      const response = await configApi.getThemes();
      setThemes(response.data);
    } catch (error) {
      console.error("Error loading themes:", error);
      // Fallback to mock themes
      setThemes([
        { id: "legislation", name: "Législation", description: "Règles et lois régissant les EHPAD", icon: "⚖️", color: "bg-blue-500", order: 0 },
        { id: "animation_types", name: "Types d'Animation", description: "Différentes formes d'animation en EHPAD", icon: "🎭", color: "bg-green-500", order: 1 },
        { id: "project_management", name: "Gestion de Projet", description: "Planification et organisation d'activités", icon: "📋", color: "bg-purple-500", order: 2 },
        { id: "budget_management", name: "Gestion de Budget", description: "Maîtrise des aspects financiers", icon: "💰", color: "bg-orange-500", order: 3 }
      ]);
    } finally {
      setLoadingThemes(false);
    }
  };

  if (loading || loadingThemes) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Erreur de chargement des données utilisateur</p>
        </div>
      </div>
    );
  }

  const progressToNextLevel = (user.xp % 100);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Hero Section */}
      <div className="text-center mb-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold mb-4">🏥 EHPAD Academy</h1>
        <p className="text-xl mb-6">Maîtrisez l'art de l'animation en EHPAD</p>
        <div className="flex justify-center items-center space-x-4">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Niveau {user.level}
          </Badge>
          <div className="text-right">
            <div className="text-sm opacity-90">Progression vers le niveau suivant</div>
            <Progress value={progressToNextLevel} className="w-48 h-3 mt-1" />
            <div className="text-xs mt-1">{user.xp} XP / {Math.floor(user.xp / 100) * 100 + 100} XP</div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">📊 Votre Progression</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">{user.completed_themes?.length || 0}</div>
              <div className="text-sm text-gray-600">Thèmes Complétés</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{user.badges?.length || 0}</div>
              <div className="text-sm text-gray-600">Badges Obtenus</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600">{user.xp}</div>
              <div className="text-sm text-gray-600">Points XP</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-orange-600">{user.created_activities?.length || 0}</div>
              <div className="text-sm text-gray-600">Activités Créées</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Theme Cards */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">🎯 Thèmes d'Apprentissage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {themes.map((theme, index) => {
            const isCompleted = user.completed_themes?.includes(theme.id);
            const isLocked = index > 0 && !user.completed_themes?.includes(themes[index - 1].id);
            
            return (
              <Card key={theme.id} className={`relative transition-all duration-300 hover:shadow-lg ${
                isCompleted ? 'ring-2 ring-green-500' : ''
              } ${isLocked ? 'opacity-50' : ''}`}>
                <CardHeader className={`${theme.color} text-white`}>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <span className="text-2xl">{theme.icon}</span>
                      <span>{theme.name}</span>
                    </span>
                    {isCompleted && <Badge variant="secondary">✅ Terminé</Badge>}
                    {isLocked && <Badge variant="destructive">🔒 Verrouillé</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-gray-600 mb-4">{theme.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Quiz disponible</span>
                    <Button 
                      as={Link} 
                      to={`/quiz/${theme.id}`} 
                      disabled={isLocked}
                      className="transition-all duration-200 hover:scale-105"
                    >
                      {isCompleted ? 'Réviser' : 'Commencer'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
    /*  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-xl">📋</span>
              <span>Fiches d'Activité</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Explorez notre bibliothèque ou créez vos propres fiches.</p>
            <Button as={Link} to="/activities" className="w-full">
              Parcourir les Fiches
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-xl">💰</span>
              <span>Simulation Budget</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Pratiquez la gestion budgétaire avec des cas réels.</p>
            <Button as={Link} to="/budget-simulation" className="w-full">
              Commencer Simulation
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-xl">👤</span>
              <span>Mon Profil</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Gérez votre profil, avatars et badges.</p>
            <Button as={Link} to="/profile" className="w-full">
              Voir le Profil
            </Button>
          </CardContent>
        </Card>
      </div>
    </div> */
  );
};

export default HomePage;
