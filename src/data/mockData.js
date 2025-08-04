export const mockUserData = {
  id: "user1",
  name: "Alex Martin",
  email: "alex.martin@example.com",
  avatar: "avatar1",
  level: 1,
  xp: 0,
  badges: [],
  completedThemes: [],
  createdActivities: []
};

export const mockAvatars = [
  { id: "avatar1", name: "Animateur Débutant", image: "👨‍🏫", unlocked: true },
  { id: "avatar2", name: "Animatrice Experte", image: "👩‍🏫", unlocked: false, requiredLevel: 5 },
  { id: "avatar3", name: "Coordinateur", image: "👨‍💼", unlocked: false, requiredLevel: 10 },
  { id: "avatar4", name: "Directrice", image: "👩‍💼", unlocked: false, requiredLevel: 15 }
];

export const mockBadges = [
  { id: "first_quiz", name: "Premier Quiz", description: "Complété votre premier quiz", icon: "🎯" },
  { id: "legislation_master", name: "Maître de la Législation", description: "Excellé en législation", icon: "⚖️" },
  { id: "animation_expert", name: "Expert Animation", description: "Maîtrise des techniques d'animation", icon: "🎭" },
  { id: "budget_wizard", name: "Magicien du Budget", description: "Parfait en gestion budgétaire", icon: "💰" },
  { id: "creator", name: "Créateur", description: "Créé votre première fiche d'activité", icon: "✨" }
];

export const themes = [
  {
    id: "legislation",
    name: "Législation",
    description: "Règles et lois régissant les EHPAD",
    icon: "⚖️",
    color: "bg-blue-500",
    questions: 15
  },
  {
    id: "animation_types",
    name: "Types d'Animation",
    description: "Différentes formes d'animation en EHPAD",
    icon: "🎭",
    color: "bg-green-500",
    questions: 20
  },
  {
    id: "project_management",
    name: "Gestion de Projet",
    description: "Planification et organisation d'activités",
    icon: "📋",
    color: "bg-purple-500",
    questions: 12
  },
  {
    id: "budget_management",
    name: "Gestion de Budget",
    description: "Maîtrise des aspects financiers",
    icon: "💰",
    color: "bg-orange-500",
    questions: 18
  }
];

export const mockQuizzes = {
  legislation: [
    {
      id: 1,
      question: "Quel est le ratio minimum d'encadrement en EHPAD ?",
      options: [
        "1 soignant pour 10 résidents",
        "1 soignant pour 8 résidents",
        "1 soignant pour 6 résidents",
        "1 soignant pour 12 résidents"
      ],
      correctAnswer: 1,
      explanation: "Le ratio minimum est de 1 soignant pour 8 résidents selon la réglementation."
    },
    {
      id: 2,
      question: "Quelle autorisation est nécessaire pour ouvrir un EHPAD ?",
      options: [
        "Autorisation préfectorale",
        "Autorisation du conseil départemental",
        "Autorisation de l'ARS",
        "Autorisation municipale"
      ],
      correctAnswer: 2,
      explanation: "L'Agence Régionale de Santé (ARS) délivre l'autorisation d'ouverture."
    }
  ],
  animation_types: [
    {
      id: 1,
      question: "Quelle activité est recommandée pour stimuler la mémoire ?",
      options: [
        "Jeux de cartes",
        "Réminiscence",
        "Gymnastique douce",
        "Musique"
      ],
      correctAnswer: 1,
      explanation: "Les activités de réminiscence stimulent efficacement la mémoire autobiographique."
    }
  ],
  project_management: [
    {
      id: 1,
      question: "Première étape d'un projet d'animation ?",
      options: [
        "Définir les objectifs",
        "Choisir l'activité",
        "Préparer le matériel",
        "Évaluer les résidents"
      ],
      correctAnswer: 3,
      explanation: "L'évaluation des résidents est essentielle pour adapter l'activité."
    }
  ],
  budget_management: [
    {
      id: 1,
      question: "Quel pourcentage du budget total est généralement alloué aux animations ?",
      options: [
        "2-5%",
        "8-12%",
        "15-20%",
        "25-30%"
      ],
      correctAnswer: 0,
      explanation: "Le budget animation représente généralement 2 à 5% du budget total."
    }
  ]
};

export const mockActivitySheets = [
  {
    id: "act1",
    title: "Atelier Cuisine Thérapeutique",
    category: "Cognitive",
    duration: "60 min",
    participants: "6-8 personnes",
    material: ["Ingrédients simples", "Ustensiles adaptés", "Tabliers"],
    objectives: ["Stimuler la mémoire", "Favoriser la socialisation", "Maintenir l'autonomie"],
    description: "Atelier de préparation de recettes simples favorisant les échanges et la stimulation cognitive.",
    difficulty: "Facile",
    author: "Équipe pédagogique"
  },
  {
    id: "act2",
    title: "Jardinage Adapté",
    category: "Physique",
    duration: "45 min",
    participants: "4-6 personnes",
    material: ["Graines", "Petits outils", "Jardinières"],
    objectives: ["Stimulation sensorielle", "Activité physique douce", "Contact avec la nature"],
    description: "Activité de plantation et d'entretien de plantes adaptée aux capacités des résidents.",
    difficulty: "Moyenne",
    author: "Équipe pédagogique"
  }
];

export const mockBudgetScenarios = [
  {
    id: "scenario1",
    title: "Budget Annuel Animation",
    description: "Vous devez gérer un budget annuel de 5000€ pour les animations d'un EHPAD de 50 résidents.",
    budget: 5000,
    expenses: [
      { category: "Matériel artistique", amount: 1200 },
      { category: "Intervenants extérieurs", amount: 2000 },
      { category: "Sorties", amount: 800 },
      { category: "Fêtes et événements", amount: 1000 }
    ],
    questions: [
      {
        question: "Quel est le budget par résident pour l'année ?",
        options: ["80€", "100€", "120€", "150€"],
        correctAnswer: 1
      }
    ]
  }
];