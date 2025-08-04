import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { Toaster } from "./components/ui/toaster";
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage";
import ProfilePage from "./pages/ProfilePage";
import ActivitySheetsPage from "./pages/ActivitySheetsPage";
import CreateActivityPage from "./pages/CreateActivityPage";
import BudgetSimulationPage from "./pages/BudgetSimulationPage";
import Navigation from "./components/Navigation";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <UserProvider>
      <div className="App min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz/:theme" element={<QuizPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/activities" element={<ActivitySheetsPage />} />
            <Route path="/create-activity" element={<CreateActivityPage />} />
            <Route path="/budget-simulation" element={<BudgetSimulationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </div>
    </UserProvider>
  );
}


export default App;