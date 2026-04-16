import type { CreateSkillForm } from '../types/school';
import type { CreateTournamentForm } from '../types/local-tournament';

export const CHESS_SYLLABUS_PRESETS: CreateSkillForm[] = [
  // 1. TÁCTICA – CORTO PLAZO
  {
    name: '1.1 Táctica Básica',
    category_id: 'tactica',
    description: 'Fundamentos tácticos esenciales: clavada, ataques dobles, descubierta, etc.',
    level: 'beginner',
    difficulty: 2,
    learning_objectives: ['Clavada absoluta y relativa', 'Ataque doble y horquilla', 'Atracción y Desviación'],
    icon: 'Target'
  },
  {
    name: '1.2 Patrones Tácticos',
    category_id: 'tactica',
    description: 'Esquemas típicos de mate y combinaciones (Anastasia, Boden, Lucena medio juego, etc.).',
    level: 'intermediate',
    difficulty: 3,
    learning_objectives: ['Mate de Anastasia y Boden', 'Esquema de Lucena en medio juego', 'Patrones de mate de Damiano y Grecco'],
    icon: 'Zap'
  },
  {
    name: '1.3 Combinaciones Complejas',
    category_id: 'tactica',
    description: 'Secuencias forzadas largas que incluyen sacrificios múltiples.',
    level: 'advanced',
    difficulty: 5,
    learning_objectives: ['Sacrificios de pieza entera', 'Sobrecarga y Rayos X', 'Desbloqueo de líneas'],
    icon: 'Lightning'
  },

  // 2. ESTRATEGIA
  {
    name: '2.1 Valoración Comprensiva',
    category_id: 'estrategia',
    description: 'Evaluación objetiva de la posición: material, espacio, desarrollo y seguridad del rey.',
    level: 'intermediate',
    difficulty: 3,
    learning_objectives: [
      'Conteo y valor relativo',
      'Ventaja de espacio y centralización',
      'Evaluación del desarrollo dinámico',
      'Seguridad del Rey'
    ],
    icon: 'Scale'
  },
  {
    name: '2.2 Maniobras de Piezas (Método Caselas)',
    category_id: 'estrategia',
    description: 'Técnicas de mejora posicional y estructural basadas en el método de Jacobo Caselas.',
    level: 'advanced',
    difficulty: 4,
    learning_objectives: [
      'Identificación de piezas mal situadas',
      'Maniobras preventivas',
      'Centralización y reagrupamiento'
    ],
    icon: 'ArrowsInLineHorizontal'
  },
  {
    name: '2.3 Restricción y Profilaxis',
    category_id: 'estrategia',
    description: 'Pensamiento preventivo para limitar las opciones del rival antes de ejecutar el plan propio.',
    level: 'advanced',
    difficulty: 5,
    learning_objectives: [
      'Profilaxis de pieza',
      'Control de rupturas del rival',
      'Bloqueo preventivo'
    ],
    icon: 'ShieldCheck'
  },

  // 3. CÁLCULO
  {
    name: '3.1 Cálculo de Variantes (Aagaard)',
    category_id: 'calculo',
    description: 'Sistematización del cálculo profundo usando técnicas de Jacob Aagaard.',
    level: 'advanced',
    difficulty: 5,
    learning_objectives: [
      'Jugadas candidatas',
      'Árboles de variantes compactos',
      'Visualización de posición final'
    ],
    icon: 'Cpu'
  },

  // 4. FINALES
  {
    name: '4.1 Finales de Peones Básicos',
    category_id: 'finales',
    description: 'Regla del cuadrado, oposición y triangulación.',
    level: 'beginner',
    difficulty: 2,
    learning_objectives: ['Oposición simple', 'Regla del cuadrado', 'Casillas clave'],
    icon: 'CaretUp'
  },
  {
    name: '4.2 Finales de Torres: Lucena y Philidor',
    category_id: 'finales',
    description: 'Las dos posiciones fundamentales que todo jugador debe conocer.',
    level: 'intermediate',
    difficulty: 4,
    learning_objectives: ['Puente de Lucena', 'Defensa de Philidor', 'Posición de Vancura'],
    icon: 'Castle'
  }
];

export const TOURNAMENT_TEMPLATES: Partial<CreateTournamentForm>[] = [
  {
    name: 'Copa de Bienvenida (Suizo)',
    format: 'swiss',
    time_control: '10+5',
    roundsPlanned: 5,
    notes: 'Torneo ideal para inaugurar el curso académico.'
  },
  {
    name: 'Liga de Invierno (Round Robin)',
    format: 'round_robin',
    time_control: '15+10',
    notes: 'Competición calmada para todos contra todos.'
  },
  {
    name: 'Maratón de Blitz (Arena)',
    format: 'swiss',
    time_control: '3+2',
    roundsPlanned: 11,
    notes: 'Desafío de rapidez y reflejos.'
  },
  {
    name: 'Campeonato de Clásicas',
    format: 'swiss',
    time_control: '60+30',
    roundsPlanned: 7,
    notes: 'Torneo serio para desarrollar profundidad de cálculo.'
  }
];
