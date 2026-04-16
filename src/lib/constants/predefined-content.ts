export const PREDEFINED_SYLLABUS = [
  {
    category: "Táctica",
    items: [
      { name: "Táctica Básica", description: "Clavada, ataques dobles, descubierta, etc.", level: 1 },
      { name: "Patrones Tácticos", description: "Mate de Anastasia, Boden, Lucena, etc.", level: 1 },
      { name: "Combinaciones de Mate", description: "Sacrificios típicos y redes de mate.", level: 2 },
      { name: "Cálculo de Variantes", description: "Visualización y árboles de decisión.", level: 3 }
    ]
  },
  {
    category: "Estrategia",
    items: [
      { name: "Valoración Comprensiva", description: "Material, espacio, desarrollo y seguridad del Rey.", level: 1 },
      { name: "Maniobra de Piezas", description: "Mejora posicional y casillas débiles.", level: 2 },
      { name: "Estructura de Peones", description: "Peones doblados, aislados, colgantes e islas.", level: 2 },
      { name: "Planificación de Medio Juego", description: "Identificación de planes según la posición.", level: 3 }
    ]
  },
  {
    category: "Finales",
    items: [
      { name: "Finales de Peones", description: "Oposición, regla del cuadrado y triangulación.", level: 1 },
      { name: "Finales de Torres Básicos", description: "Posición Lucena y Philidor.", level: 2 },
      { name: "Finales de Piezas Menores", description: "Alfiles de distinto color y técnica de realización.", level: 2 },
      { name: "Técnica de Finales Avanzada", description: "Fortalezas y zugzwang complejo.", level: 3 }
    ]
  }
];

export const PREDEFINED_TOURNAMENTS = [
  {
    name: "Copa de Bienvenida",
    description: "Torneo amistoso para familiarizar a los alumnos con la competición.",
    format: "Suizo",
    time_control: "10 min",
    max_players: 20
  },
  {
    name: "Liga Interna de la Academia",
    description: "Competencia recurrente para medir el progreso mensual.",
    format: "Liga (Round Robin)",
    time_control: "15 min + 5 seg",
    max_players: 12
  },
  {
    name: "Maratón de Blitz",
    description: "Evento rápido y dinámico para mejorar los reflejos y la intuición.",
    format: "Arena",
    time_control: "3 min + 2 seg",
    max_players: 50
  }
];
