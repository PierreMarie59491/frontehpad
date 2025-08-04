import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { configApi } from "../services/api";

const ProfilePage = () => {
  const { user, updateUser, gameConfig, loading } = useUser();
  const [avatars, setAvatars] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    loadConfigData();
  }, []);

  const loadConfigData = async () => {
    try {
      const [avatarsRes, badgesRes] = await Promise.all([
        configApi.getAvatars(),
        configApi.getBadges()
      ]);
      setAvatars(avatarsRes.data);
      setBadges(badgesRes.data);
    } catch (error) {
      console.error("Error loading config data:", error);
      // Fallback to defaults
      setAvatars([
        { id: "avatar1", name: "Animateur Débutant", image: "👨‍🏫", unlocked: true, required_level: 1 },
        { id: "avatar2", name: "Animatrice Experte", image: "👩‍🏫", unlocked: false, required_level: 5 },
        { id: "avatar3", name: "Coordinateur", image: "👨‍💼", unlocked: false, required_level: 10 },
        { id: "avatar4", name: "Directrice", image: "👩‍💼", unlocked: false, required_level: 15 }
      ]);
      setBadges([
        { id: "first_quiz", name: "Premier Quiz", description: "Complété votre premier quiz", icon: "🎯" },
        { id: "legislation_master", name: "Maître de la Législation", description: "Excellé en législation", icon: "⚖️" },
        { id: "animation_expert", name: "Expert Animation", description: "Maîtrise des techniques d'animation", icon: "🎭" },
        { id: "budget_wizard", name: "Magicien du Budget", description: "Parfait en gestion budgétaire", icon: "💰" },
        { id: "creator", name: "Créateur", description: "Créé votre première fiche d'activité", icon: "✨" }
      ]);
    } finally {
      setLoadingConfig(false);
    }
  };

  const handleAvatarChange = (avatarId) => {
    updateUser({ avatar: avatarId });
  };

  if (loading || loadingConfig) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

 if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement du profil...</p>
      </div>
    </div>
  );
}

if (!user) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-red-500">Erreur : utilisateur non connecté</p>
      </div>
    </div>
  );
}

  const progressToNextLevel = (user.xp % 100);
  const availableAvatars = avatars.filter(avatar => 
    avatar.unlocked || user.level >= avatar.required_level
  );

  const userBadges = badges.filter(badge => user.badges?.includes(badge.id));

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">👤 Mon Profil</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-center">Informations</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarImage src={avatars.find(a => a.id === user.avatar)?.image} />
              <AvatarFallback>{avatars.find(a => a.id === user.avatar)?.image}</AvatarFallback>
            </Avatar>
            
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Niveau</span>
                <Badge variant="secondary">{user.level}</Badge>
              </div>
              <div className="flex justify-between">
                <span>XP Total</span>
                <span className="font-medium">{user.xp}</span>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progression</span>
                  <span>{progressToNextLevel}/100</span>
                </div>
                <Progress value={progressToNextLevel} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>🏆 Récompenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Badges */}
              <div>
                <h3 className="font-medium mb-3">Badges Obtenus ({userBadges.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {userBadges.map(badge => (
                    <div key={badge.id} className="bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded-lg border border-yellow-300">
                      <div className="text-center">
                        <div className="text-2xl mb-1">{badge.icon}</div>
                        <div className="font-medium text-sm">{badge.name}</div>
                        <div className="text-xs text-gray-600">{badge.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {userBadges.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Aucun badge obtenu pour le moment. Continuez à jouer !
                  </div>
                )}
              </div>

              {/* Available Badges */}
              <div>
                <h3 className="font-medium mb-3">Badges Disponibles</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {badges.filter(badge => !user.badges?.includes(badge.id)).map(badge => (
                    <div key={badge.id} className="bg-gray-100 p-3 rounded-lg border border-gray-300 opacity-60">
                      <div className="text-center">
                        <div className="text-2xl mb-1 grayscale">{badge.icon}</div>
                        <div className="font-medium text-sm text-gray-600">{badge.name}</div>
                        <div className="text-xs text-gray-500">{badge.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Avatar Selection */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>🎭 Avatars</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {avatars.map(avatar => {
              const isUnlocked = avatar.unlocked || user.level >= avatar.required_level;
              const isSelected = user.avatar === avatar.id;
              
              return (
                <div
                  key={avatar.id}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                    isSelected 
                      ? "border-purple-500 bg-purple-50" 
                      : isUnlocked 
                        ? "border-gray-300 hover:border-gray-400 bg-white cursor-pointer" 
                        : "border-gray-200 bg-gray-50 opacity-50"
                  }`}
                  onClick={() => isUnlocked && handleAvatarChange(avatar.id)}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{avatar.image}</div>
                    <div className="font-medium text-sm">{avatar.name}</div>
                    {!isUnlocked && (
                      <div className="text-xs text-gray-500 mt-1">
                        Niveau {avatar.required_level} requis
                      </div>
                    )}
                    {isSelected && (
                      <Badge className="mt-2 bg-purple-600">Sélectionné</Badge>
                    )}
                  </div>
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl">🔒</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>📊 Statistiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{user.completed_themes?.length || 0}</div>
              <div className="text-sm text-gray-600">Thèmes Terminés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{user.badges?.length || 0}</div>
              <div className="text-sm text-gray-600">Badges Obtenus</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{user.level}</div>
              <div className="text-sm text-gray-600">Niveau Actuel</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{user.created_activities?.length || 0}</div>
              <div className="text-sm text-gray-600">Activités Créées</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;