import type { CreateSkillForm } from '../types/school';
import type { CreateTournamentForm } from '../types/local-tournament';

export const CHESS_SYLLABUS_PRESETS: CreateSkillForm[] = [
  // 1. TÁCTICA – CORTO PLAZO
  {
    name: '1.1 Táctica Básica',
    categoryId: 'tactica',
    description: 'Fundamentos tácticos esenciales: clavada, ataques dobles, descubierta, etc.',
    level: 'beginner',
    difficulty: 2,
    learningObjectives: ['Clavada absoluta y relativa', 'Ataque doble y horquilla', 'Atracción y Desviación'],
    assessmentCriteria: ['Identificar clavadas en ejercicios de 1 jugada', 'Resolver mates en 1 con ataque doble', 'Explicar la diferencia entre atracción y desviación'],
    resources: ['https://lichess.org/practice/basic-tactics', 'Libro: Tratado Elemental de Ajedrez'],
    icon: 'Target'
  },
  {
    name: '1.2 Patrones Tácticos',
    categoryId: 'tactica',
    description: 'Esquemas típicos de mate y combinaciones (Anastasia, Boden, Lucena medio juego, etc.).',
    level: 'intermediate',
    difficulty: 3,
    learningObjectives: ['Mate de Anastasia y Boden', 'Esquema de Lucena en medio juego', 'Patrones de mate de Damiano y Grecco'],
    assessmentCriteria: ['Reconocer el patrón de Boden en partidas reales', 'Ejecutar el esquema de Lucena sin errores', 'Completar test de patrones de mate (80%+ éxito)'],
    resources: ['https://chess24.com/es/learn/tactics', 'App: Chess Tempo Patterns'],
    icon: 'Zap'
  },
  {
    name: '1.3 Combinaciones Complejas',
    categoryId: 'tactica',
    description: 'Secuencias forzadas largas que incluyen sacrificios múltiples.',
    level: 'advanced',
    difficulty: 5,
    learningObjectives: ['Sacrificios de pieza entera', 'Sobrecarga y Rayos X', 'Desbloqueo de líneas'],
    assessmentCriteria: ['Calcular variantes de hasta 4 jugadas', 'Resolver problemas de nivel 2000+ elo', 'Identificar el tema táctico en posiciones complejas'],
    resources: ['Curso: Cálculo Superior - Aagaard', 'Base de datos: Combinaciones Históricas'],
    icon: 'Lightning'
  },

  // 2. ESTRATEGIA
  {
    name: '2.1 Valoración Comprensiva',
    categoryId: 'estrategia',
    description: 'Evaluación objetiva de la posición: material, espacio, desarrollo y seguridad del rey.',
    level: 'intermediate',
    difficulty: 3,
    learningObjectives: [
      'Conteo y valor relativo',
      'Ventaja de espacio y centralización',
      'Evaluación del desarrollo dinámico',
      'Seguridad del Rey'
    ],
    assessmentCriteria: ['Realizar un balance material vs posicional', 'Detectar al menos 3 debilidades en una posición dada', 'Proponer un plan basado en la seguridad del rey'],
    resources: ['https://chess.com/lessons/strategy-fundamentals', 'Libro: Mi Sistema - Nimzowitsch'],
    icon: 'Scale'
  },
  {
    name: '2.2 Maniobras de Piezas (Método Caselas)',
    categoryId: 'estrategia',
    description: 'Técnicas de mejora posicional y estructural basadas en el método de Jacobo Caselas.',
    level: 'advanced',
    difficulty: 4,
    learningObjectives: [
      'Identificación de piezas mal situadas',
      'Maniobras preventivas',
      'Centralización y reagrupamiento'
    ],
    assessmentCriteria: ['Mover una pieza mal situada a su casilla ideal en <3 jugadas', 'Explicar el concepto de reagrupamiento dinámico', 'Demostrar una maniobra profiláctica en el flanco de dama'],
    resources: ['Seminario Jacobo Caselas: Maniobras Modernas', 'Base de datos de partidas magistrales'],
    icon: 'ArrowsInLineHorizontal'
  },
  {
    name: '2.3 Restricción y Profilaxis',
    categoryId: 'estrategia',
    description: 'Pensamiento preventivo para limitar las opciones del rival antes de ejecutar el plan propio.',
    level: 'advanced',
    difficulty: 5,
    learningObjectives: [
      'Profilaxis de pieza',
      'Control de rupturas del rival',
      'Bloqueo preventivo'
    ],
    assessmentCriteria: ['Anticipar la ruptura central del rival', 'Ejecutar un bloqueo exitoso de peones pasados', 'Evaluar el riesgo de contrajuego antes de atacar'],
    resources: ['Libro: Profilaxis en el Ajedrez - Dvoretsky', 'Vídeo: Control del centro y profilaxis'],
    icon: 'Shield'
  },

  // 3. CÁLCULO
  {
    name: '3.1 Cálculo de Variantes (Aagaard)',
    categoryId: 'calculo',
    description: 'Sistematización del cálculo profundo usando técnicas de Jacob Aagaard.',
    level: 'advanced',
    difficulty: 5,
    learningObjectives: [
      'Jugadas candidatas',
      'Árboles de variantes compactos',
      'Visualización de posición final'
    ],
    assessmentCriteria: ['Listar todas las jugadas candidatas relevantes', 'Visualizar posiciones a 5 jugadas de distancia', 'Evitar errores de "ceguera táctica" en el cálculo'],
    resources: ['Libro: Grandmaster Preparation: Calculation', 'Software: visualización 3D'],
    icon: 'Cpu'
  },

  // 4. FINALES
  {
    name: '4.1 Finales de Peones Básicos',
    categoryId: 'finales',
    description: 'Regla del cuadrado, oposición y triangulación.',
    level: 'beginner',
    difficulty: 2,
    learningObjectives: ['Oposición simple', 'Regla del cuadrado', 'Casillas clave'],
    assessmentCriteria: ['Ganar finales de peón con oposición', 'Aplicar la regla del cuadrado sin dudar', 'Identificar casillas ganadoras y perdedoras'],
    resources: ['https://lichess.org/practice/pawn-endgames', 'Manual de finales de Pandolfini'],
    icon: 'CaretUp'
  },
  {
    name: '4.2 Finales de Torres: Lucena y Philidor',
    categoryId: 'finales',
    description: 'Las dos posiciones fundamentales que todo jugador debe conocer.',
    level: 'intermediate',
    difficulty: 4,
    learningObjectives: ['Puente de Lucena', 'Defensa de Philidor', 'Posición de Vancura'],
    assessmentCriteria: ['Ejecutar el puente de Lucena en partida viva', 'Defender posiciones de Philidor con éxito', 'Explicar por qué Vancura es tablas'],
    resources: ['https://chess.com/drills/endgames/rooks', 'Vídeo: Lucena vs Philidor'],
    icon: 'Castle'
  }
];

export const TOURNAMENT_TEMPLATES: Partial<CreateTournamentForm>[] = [
  {
    name: 'Copa de Bienvenida (Suizo)',
    format: 'swiss',
    timeControl: '10+5',
    roundsPlanned: 5,
    notes: 'Torneo ideal para inaugurar el curso académico.'
  },
  {
    name: 'Liga de Invierno (Round Robin)',
    format: 'round_robin',
    timeControl: '15+10',
    notes: 'Competición calmada para todos contra todos.'
  },
  {
    name: 'Maratón de Blitz (Arena)',
    format: 'swiss',
    timeControl: '3+2',
    roundsPlanned: 11,
    notes: 'Desafío de rapidez y reflejos.'
  },
  {
    name: 'Campeonato de Clásicas',
    format: 'swiss',
    timeControl: '60+30',
    roundsPlanned: 7,
    notes: 'Torneo serio para desarrollar profundidad de cálculo.'
  }
];
