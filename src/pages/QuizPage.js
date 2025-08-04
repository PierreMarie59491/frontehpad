import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { useToast } from "../hooks/use-toast";
import { quizApi, configApi } from "../services/api";

const QuizPage = () => {
  const { theme } = useParams();
  const navigate = useNavigate();
  const { user, addXP, completeTheme, unlockBadge } = useUser();
  const { toast } = useToast();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [themeData, setThemeData] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeQuiz();
  }, [theme]);

  const initializeQuiz = async () => {
    try {
      // Load theme data
      const themesResponse = await configApi.getThemes();
      const currentTheme = themesResponse.data.find(t => t.id === theme);
      setThemeData(currentTheme);

      // Load questions
      const questionsResponse = await quizApi.getThemeQuestions(theme);
      setQuestions(questionsResponse.data);

      // Start quiz session
      if (user) {
        const sessionResponse = await quizApi.startSession(user.id, theme);
        setSession(sessionResponse.data);
      }
    } catch (error) {
      console.error("Error initializing quiz:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le quiz",
        variant: "destructive"
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = async () => {
    if (!session || !questions[currentQuestion]) return;

    try {
      const response = await quizApi.submitAnswer(
        session.id,
        questions[currentQuestion].id,
        selectedAnswer
      );
      
      const isCorrect = response.data.is_correct;
      
      if (isCorrect) {
        setScore(score + 1);
        addXP(20);
        toast({
          title: "Correct ! 🎉",
          description: "+20 XP",
          className: "bg-green-100 border-green-500"
        });
      } else {
        toast({
          title: "Incorrect 😞",
          description: "Pas de XP cette fois",
          className: "bg-red-100 border-red-500"
        });
      }
      
      setShowAnswer(true);
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast({
        title: "Erreur",
        description: "Impossible de soumettre la réponse",
        variant: "destructive"
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = async () => {
    const percentage = (score / questions.length) * 100;
    
    if (percentage >= 70) {
      await completeTheme(theme);
      
      // Unlock theme-specific badges
      if (theme === "legislation" && percentage >= 80) {
        await unlockBadge("legislation_master");
      } else if (theme === "animation_types" && percentage >= 80) {
        await unlockBadge("animation_expert");
      } else if (theme === "budget_management" && percentage >= 80) {
        await unlockBadge("budget_wizard");
      }
      
      // First quiz badge
      if (user.completed_themes?.length === 0) {
        await unlockBadge("first_quiz");
      }
    }
    
    setQuizCompleted(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setScore(0);
    setQuizCompleted(false);
    initializeQuiz();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du quiz...</p>
        </div>
      </div>
    );
  }

  if (!themeData || questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="text-center">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Quiz non disponible</h2>
            <p className="text-gray-600 mb-4">Aucune question disponible pour ce thème.</p>
            <Button onClick={() => navigate("/")} className="bg-purple-600 hover:bg-purple-700">
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = (score / questions.length) * 100;
    const passed = percentage >= 70;

    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl">
              {passed ? "🎉 Félicitations !" : "😞 Presque !"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-6xl">
              {passed ? "✅" : "❌"}
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Résultats</h2>
              <div className="text-4xl font-bold mb-2 text-purple-600">
                {score}/{questions.length}
              </div>
              <div className="text-xl text-gray-600">
                {percentage.toFixed(0)}% de réussite
              </div>
            </div>
            
            {passed && (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800 font-medium">
                  Thème terminé avec succès ! Vous pouvez maintenant accéder au thème suivant.
                </p>
              </div>
            )}
            
            <div className="flex justify-center space-x-4">
              <Button onClick={resetQuiz} variant="outline">
                Recommencer
              </Button>
              <Button onClick={() => navigate("/")} className="bg-purple-600 hover:bg-purple-700">
                Retour à l'accueil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{themeData.icon}</span>
            <h1 className="text-2xl font-bold">{themeData.name}</h1>
          </div>
          <Badge variant="secondary">
            Question {currentQuestion + 1} / {questions.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Answer Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              let buttonClass = "w-full p-4 text-left border rounded-lg transition-all duration-200 hover:shadow-md ";
              
              if (showAnswer) {
                if (index === question.correct_answer) {
                  buttonClass += "bg-green-100 border-green-500 text-green-800";
                } else if (index === selectedAnswer) {
                  buttonClass += "bg-red-100 border-red-500 text-red-800";
                } else {
                  buttonClass += "bg-gray-50 border-gray-300 text-gray-600";
                }
              } else {
                buttonClass += selectedAnswer === index 
                  ? "bg-purple-100 border-purple-500 text-purple-800" 
                  : "bg-white border-gray-300 hover:bg-gray-50";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showAnswer}
                  className={buttonClass}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showAnswer && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Explication :</h3>
              <p className="text-blue-700">{question.explanation}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between mt-6">
            <Button 
              onClick={() => navigate("/")} 
              variant="outline"
            >
              Quitter
            </Button>
            
            {!showAnswer ? (
              <Button 
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Valider
              </Button>
            ) : (
              <Button 
                onClick={handleNextQuestion}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {currentQuestion < questions.length - 1 ? "Question suivante" : "Terminer"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizPage;