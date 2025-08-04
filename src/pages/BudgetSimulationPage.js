import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useUser } from "../contexts/UserContext";
import { useToast } from "../hooks/use-toast";
import { mockBudgetScenarios } from "../data/mockData";

const BudgetSimulationPage = () => {
  const { addXP } = useUser();
  const { toast } = useToast();
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [customBudget, setCustomBudget] = useState({
    totalBudget: "",
    categories: [
      { name: "Matériel artistique", amount: "" },
      { name: "Intervenants extérieurs", amount: "" },
      { name: "Sorties", amount: "" },
      { name: "Fêtes et événements", amount: "" },
      { name: "Matériel sportif", amount: "" }
    ]
  });

  const handleScenarioSelect = (scenario) => {
    setSelectedScenario(scenario);
    setCurrentQuestion(0);
    setShowResult(false);
    setUserAnswer("");
  };

  const handleAnswerSubmit = () => {
    const question = selectedScenario.questions[currentQuestion];
    const isCorrect = parseInt(userAnswer) === question.correctAnswer;
    
    if (isCorrect) {
      addXP(30);
      toast({
        title: "Correct ! 🎉",
        description: "+30 XP",
        className: "bg-green-100 border-green-500"
      });
    } else {
      toast({
        title: "Incorrect 😞",
        description: "Révisez vos calculs",
        className: "bg-red-100 border-red-500"
      });
    }
    
    setShowResult(true);
  };

  const calculateTotal = () => {
    return customBudget.categories.reduce((total, category) => {
      return total + (parseFloat(category.amount) || 0);
    }, 0);
  };

  const updateCategoryAmount = (index, amount) => {
    setCustomBudget(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) => 
        i === index ? { ...cat, amount } : cat
      )
    }));
  };

  const BudgetChart = ({ scenario }) => {
    const total = scenario.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-purple-600">{scenario.budget}€</div>
          <div className="text-sm text-gray-600">Budget Total</div>
        </div>
        
        {scenario.expenses.map((expense, index) => {
          const percentage = (expense.amount / scenario.budget) * 100;
          const colors = ['bg-purple-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-red-500'];
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{expense.category}</span>
                <span className="text-sm text-gray-600">{expense.amount}€</span>
              </div>
              <Progress value={percentage} className="h-3" />
              <div className="text-xs text-gray-500 text-right">
                {percentage.toFixed(1)}% du budget
              </div>
            </div>
          );
        })}
        
        <div className="border-t pt-4">
          <div className="flex justify-between items-center font-bold">
            <span>Total dépensé</span>
            <span>{total}€</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Reste disponible</span>
            <span className={total > scenario.budget ? "text-red-600" : "text-green-600"}>
              {scenario.budget - total}€
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">💰 Simulation de Budget</h1>

      <Tabs defaultValue="scenarios" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scenarios">📊 Scénarios</TabsTrigger>
          <TabsTrigger value="custom">🔧 Calculateur</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-6">
          {!selectedScenario ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>🎯 Choisissez un Scénario</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Pratiquez la gestion budgétaire avec des situations réelles d'EHPAD.
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockBudgetScenarios.map(scenario => (
                  <Card key={scenario.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle>{scenario.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{scenario.description}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span>Budget total:</span>
                          <span className="font-bold text-purple-600">{scenario.budget}€</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Questions:</span>
                          <span>{scenario.questions.length}</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleScenarioSelect(scenario)}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        Commencer
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Scenario Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {selectedScenario.title}
                    <Button 
                      onClick={() => setSelectedScenario(null)}
                      variant="outline"
                      size="sm"
                    >
                      Retour
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BudgetChart scenario={selectedScenario} />
                </CardContent>
              </Card>

              {/* Question */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    Question {currentQuestion + 1} / {selectedScenario.questions.length}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg">{selectedScenario.questions[currentQuestion].question}</p>
                  
                  <div className="space-y-3">
                    {selectedScenario.questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setUserAnswer(index)}
                        className={`w-full p-3 text-left border rounded-lg transition-colors ${
                          userAnswer === index 
                            ? "bg-purple-100 border-purple-500" 
                            : "bg-white border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {showResult && (
                    <div className={`p-4 rounded-lg ${
                      userAnswer === selectedScenario.questions[currentQuestion].correctAnswer
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}>
                      <p className="font-medium">
                        {userAnswer === selectedScenario.questions[currentQuestion].correctAnswer
                          ? "✅ Correct !"
                          : "❌ Incorrect"}
                      </p>
                      <p className="text-sm mt-1">
                        Réponse: {selectedScenario.questions[currentQuestion].options[selectedScenario.questions[currentQuestion].correctAnswer]}
                      </p>
                    </div>
                  )}

                  <Button 
                    onClick={showResult ? () => setSelectedScenario(null) : handleAnswerSubmit}
                    disabled={userAnswer === ""}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {showResult ? "Terminé" : "Valider"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🔧 Calculateur de Budget Personnalisé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Budget Total (€)</label>
                  <Input
                    type="number"
                    value={customBudget.totalBudget}
                    onChange={(e) => setCustomBudget(prev => ({...prev, totalBudget: e.target.value}))}
                    placeholder="Budget total disponible"
                  />
                </div>

                <div>
                  <h3 className="font-medium mb-3">Répartition par Catégorie</h3>
                  <div className="space-y-3">
                    {customBudget.categories.map((category, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="flex-1">
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        <Input
                          type="number"
                          value={category.amount}
                          onChange={(e) => updateCategoryAmount(index, e.target.value)}
                          placeholder="0"
                          className="w-32"
                        />
                        <span className="text-sm text-gray-600">€</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total des dépenses</span>
                    <span className="text-purple-600">{calculateTotal()}€</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                    <span>Budget disponible</span>
                    <span>{customBudget.totalBudget}€</span>
                  </div>
                  <div className="flex justify-between items-center font-medium mt-2">
                    <span>Reste</span>
                    <span className={
                      calculateTotal() > parseFloat(customBudget.totalBudget || 0) 
                        ? "text-red-600" 
                        : "text-green-600"
                    }>
                      {(parseFloat(customBudget.totalBudget || 0) - calculateTotal()).toFixed(2)}€
                    </span>
                  </div>
                </div>

                {calculateTotal() > parseFloat(customBudget.totalBudget || 0) && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <p className="text-red-800 font-medium">
                      ⚠️ Attention ! Vous dépassez votre budget de {(calculateTotal() - parseFloat(customBudget.totalBudget || 0)).toFixed(2)}€
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetSimulationPage;