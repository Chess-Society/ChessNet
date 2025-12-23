import type { Skill } from '$lib/services/storage';

export interface SkillTemplate {
    id: string;
    name: string;
    description: string;
    skills: Omit<Skill, 'id'>[];
}

export const skillTemplates: SkillTemplate[] = [
    {
        id: 'chess-basics-complete',
        name: 'Temario Completo de Ajedrez',
        description: 'Temario oficial completo desde nivel básico hasta avanzado',
        skills: [
            // NIVEL 1 - INTRODUCCIÓN
            { name: 'Bienvenidos al mundo del ajedrez', category: 'Openings', level: 1, description: 'Introducción al juego y sus reglas básicas' },
            { name: 'El tablero', category: 'Openings', level: 1, description: 'Conocer el tablero: filas, columnas y diagonales' },
            { name: 'El peón sin miedo', category: 'Tactics', level: 1, description: 'Movimiento y captura del peón' },
            { name: 'El caballo saltarín', category: 'Tactics', level: 1, description: 'Movimiento en L del caballo' },
            { name: 'El alfil veloz', category: 'Tactics', level: 1, description: 'Movimiento diagonal del alfil' },
            { name: 'La torre astuta', category: 'Tactics', level: 1, description: 'Movimiento en línea recta de la torre' },
            { name: 'La dama poderosa', category: 'Tactics', level: 1, description: 'El movimiento más versátil del tablero' },
            { name: 'El rey ansioso', category: 'Tactics', level: 1, description: 'Movimiento del rey y su importancia' },
            { name: 'Orígenes del ajedrez', category: 'Openings', level: 1, description: 'Historia y evolución del juego' },
            { name: '¡Jaque al rey!', category: 'Tactics', level: 1, description: 'Concepto de jaque y cómo responder' },
            { name: 'Mantenerse con vida', category: 'Strategy', level: 1, description: 'Defensa básica y protección de piezas' },
            { name: 'Jaque mate, ¡Se acabó!', category: 'Tactics', level: 1, description: 'Objetivo final del juego' },
            { name: 'Resuelve la partida', category: 'Tactics', level: 1, description: 'Ejercicios de mate en 1' },
            { name: 'El valor de cada pieza', category: 'Strategy', level: 1, description: 'Sistema de puntos de las piezas' },
            { name: 'Juego de peones', category: 'Strategy', level: 1, description: 'Estructura de peones básica' },
            { name: 'Juego de caballos', category: 'Tactics', level: 1, description: 'Tácticas con caballos' },

            // NIVEL 2 - FUNDAMENTOS
            { name: 'Juego de alfiles', category: 'Tactics', level: 2, description: 'Uso efectivo de los alfiles' },
            { name: 'Juego de torres', category: 'Tactics', level: 2, description: 'Coordinación de torres' },
            { name: 'Juego de dama', category: 'Tactics', level: 2, description: 'Uso estratégico de la dama' },
            { name: 'Juego de rey', category: 'Endgame', level: 2, description: 'Actividad del rey en el final' },
            { name: 'Enroque', category: 'Openings', level: 2, description: 'Movimiento especial de seguridad del rey' },
            { name: 'Resuelve la partida', category: 'Tactics', level: 2, description: 'Ejercicios de mate en 2' },
            { name: 'Ajedrecistas increíbles', category: 'Openings', level: 2, description: 'Grandes maestros de la historia' },
            { name: 'Jaques, capturas y amenazas', category: 'Tactics', level: 2, description: 'Tácticas fundamentales' },
            { name: 'Sigue el sistema', category: 'Strategy', level: 2, description: 'Desarrollo sistemático de piezas' },
            { name: 'Campeonatos', category: 'Openings', level: 2, description: 'Torneos y competiciones importantes' },
            { name: 'Apertura', category: 'Openings', level: 2, description: 'Principios de la apertura' },
            { name: 'Medio juego', category: 'Strategy', level: 2, description: 'Estrategia en el medio juego' },
            { name: 'Final de juego', category: 'Endgame', level: 2, description: 'Técnicas de finales básicos' },
            { name: 'Resuelve la partida', category: 'Tactics', level: 2, description: 'Problemas tácticos variados' },
            { name: 'Encuentra tu estilo', category: 'Strategy', level: 2, description: 'Descubrir tu estilo de juego' },

            // NIVEL 3 - INTERMEDIO
            { name: 'Empezar con buen pie', category: 'Openings', level: 3, description: 'Aperturas sólidas para principiantes' },
            { name: 'Aperturas famosas', category: 'Openings', level: 3, description: 'Española, Italiana, Francesa, etc.' },
            { name: 'Trampa de jaque mate', category: 'Tactics', level: 3, description: 'Patrones de mate comunes' },
            { name: 'Trampa de alfil y caballo', category: 'Tactics', level: 3, description: 'Coordinación de piezas menores' },
            { name: 'Trampa del imitador', category: 'Tactics', level: 3, description: 'Peligros de copiar jugadas' },
            { name: 'Trampa de la dama', category: 'Tactics', level: 3, description: 'Ataques prematuros de dama' },
            { name: 'Resuelve la partida', category: 'Tactics', level: 3, description: 'Combinaciones tácticas' },
            { name: 'El juego prohibido', category: 'Strategy', level: 3, description: 'Errores comunes a evitar' },
            { name: 'Ajedrecistas increíbles', category: 'Openings', level: 3, description: 'Campeones mundiales modernos' },
            { name: 'Tablas', category: 'Endgame', level: 3, description: 'Tipos de tablas y ahogado' },
            { name: 'Resuelve la partida', category: 'Tactics', level: 3, description: 'Ejercicios de combinaciones' },
            { name: 'Ajedrez a distancia', category: 'Strategy', level: 3, description: 'Juego posicional' },
            { name: 'Visión de juego', category: 'Strategy', level: 3, description: 'Cálculo de variantes' },
            { name: 'Trabajo en equipo', category: 'Strategy', level: 3, description: 'Coordinación de piezas' },
            { name: 'Ajedrecistas increíbles', category: 'Openings', level: 3, description: 'Estilos de juego de los grandes' },
            { name: 'Vigila el reloj', category: 'Strategy', level: 3, description: 'Gestión del tiempo' },

            // NIVEL 4 - AVANZADO
            { name: 'La Guerra Fría', category: 'Openings', level: 4, description: 'Ajedrez en la era Fischer-Spassky' },
            { name: 'Superdefensas', category: 'Strategy', level: 4, description: 'Defensas modernas e hipermodernas' },
            { name: 'Ajedrecistas increíbles', category: 'Openings', level: 4, description: 'Leyendas del ajedrez' },
            { name: 'Resuelve la partida', category: 'Tactics', level: 4, description: 'Problemas complejos' },
            { name: 'Una partida en el parque', category: 'Strategy', level: 4, description: 'Análisis de partidas famosas' },
            { name: 'Ajedrez por computadora', category: 'Strategy', level: 4, description: 'Uso de motores de análisis' },
            { name: 'Jóvenes prodigios', category: 'Openings', level: 4, description: 'Nuevas generaciones de maestros' },
            { name: 'Resuelve la partida', category: 'Tactics', level: 4, description: 'Estudios de finales' },
            { name: 'Estrategias', category: 'Strategy', level: 4, description: 'Planes a largo plazo' },
            { name: 'Cuestiones a recordar', category: 'Strategy', level: 4, description: 'Principios fundamentales' },

            // NIVEL 5 - MAESTRÍA
            { name: 'Cifras de récord', category: 'Openings', level: 5, description: 'Récords y curiosidades' },
            { name: 'Y ahora, ¿qué?', category: 'Strategy', level: 5, description: 'Camino hacia la maestría' },
            { name: 'Glosario', category: 'Openings', level: 5, description: 'Terminología ajedrecística completa' },
            { name: 'Índice alfabético', category: 'Openings', level: 5, description: 'Referencia rápida de conceptos' },
            { name: 'Agradecimientos', category: 'Openings', level: 5, description: 'Recursos y bibliografía recomendada' },
        ]
    }
];

export function getTemplateById(id: string): SkillTemplate | undefined {
    return skillTemplates.find(t => t.id === id);
}

export function getAllTemplates(): SkillTemplate[] {
    return skillTemplates;
}
