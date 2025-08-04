import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { mockAvatars } from "../data/mockData";

const Navigation = () => {
  const { user, logout } = useUser();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  const linksToRender = user ? navItems : publicNavItems;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav className="bg-white shadow-lg border-b-2 border-purple-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🏥</span>
            <span className="text-xl font-bold text-purple-800">EHPAD Academy</span>
          </Link>

          {/* Burger button */}
          <button
            className="md:hidden text-3xl"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? "✖️" : "☰"}
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8">
            {linksToRender.map((item) => (
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

          {/* User info */}
          {user && (
            <div className="hidden md:flex items-center space-x-4">
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

        {/* Mobile menu (animated + clickable outside) */}
        <div
          ref={menuRef}
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="flex flex-col space-y-2 mt-4 pb-4">
            {linksToRender.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-purple-100 text-purple-800 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            {user && (
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="text-left px-4 py-2 text-purple-700 hover:underline"
              >
                Déconnexion
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
