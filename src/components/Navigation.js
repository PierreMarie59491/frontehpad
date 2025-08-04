import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { mockAvatars } from "../data/mockData";

const Navigation = () => {
  const { user, logout } = useUser();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Accueil", icon: "🏠" },
    { path: "/activities", label: "Fiches d'Activité", icon: "📋" },
    { path: "/budget-simulation", label: "Budget", icon: "💰" },
    { path: "/profile", label: "Profil", icon: "👤" },
  ];

  const publicNavItems = [
    { path: "/login", label: "Connexion", icon: "🔐" },
    { path: "/register", label: "Inscription", icon: "📝" },
     { path: "/", label: "Accueil", icon: "🏠" },
    { path: "/activities", label: "Fiches d'Activité", icon: "📋" },
    { path: "/budget-simulation", label: "Budget", icon: "💰" },
    { path: "/profile", label: "Profil", icon: "👤" },
  ];

  return (
    <nav className="bg-white shadow-lg border-b-2 border-purple-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🏥</span>
            <span className="text-xl font-bold text-purple-800">EHPAD Academy</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {(user ? navItems : publicNavItems).map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-purple-100 text-purple-800 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Connected user info */}
          {user && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Niveau {user.level}</Badge>
                  <span className="text-xs text-gray-500">{user.xp} XP</span>
                </div>
              </div>
              <div className="w-16">
                <Progress value={user.xp % 100} className="h-2" />
              </div>
              <Avatar>
                <AvatarImage src={mockAvatars.find(a => a.id === user.avatar)?.image} />
                <AvatarFallback>👤</AvatarFallback>
              </Avatar>
              <button
                onClick={logout}
                className="text-sm text-purple-700 hover:underline ml-2"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
