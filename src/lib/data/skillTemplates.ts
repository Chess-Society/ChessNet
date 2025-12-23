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
            {
                name: 'Bienvenidos al mundo del ajedrez',
                category: 'Openings',
                level: 1,
                description: 'Introducción al juego y sus reglas básicas',
                content: 'El ajedrez es un juego de estrategia para 2 jugadores. Cada uno controla 16 piezas (blancas o negras) en un tablero de 64 casillas. El objetivo es dar jaque mate al rey contrario. ¡Es como una batalla donde la inteligencia gana!'
            },
            {
                name: 'El tablero',
                category: 'Openings',
                level: 1,
                description: 'Conocer el tablero: filas, columnas y diagonales',
                content: 'El tablero tiene 8 filas (horizontales) y 8 columnas (verticales), formando 64 casillas. Las casillas alternan entre blancas y negras. Recuerda: la casilla de la esquina derecha debe ser blanca. Las filas se numeran del 1 al 8, y las columnas se nombran de la "a" a la "h".'
            },
            {
                name: 'El peón sin miedo',
                category: 'Tactics',
                level: 1,
                description: 'Movimiento y captura del peón',
                content: 'El peón avanza 1 casilla hacia adelante (2 en su primer movimiento). Captura en diagonal. Cuando llega al final del tablero, se convierte en cualquier pieza (normalmente dama). ¡Los peones son el alma del ajedrez!'
            },
            {
                name: 'El caballo saltarín',
                category: 'Tactics',
                level: 1,
                description: 'Movimiento en L del caballo',
                content: 'El caballo se mueve en forma de "L": 2 casillas en una dirección y 1 en perpendicular. Es la única pieza que puede saltar sobre otras. Puede controlar hasta 8 casillas desde el centro del tablero. ¡Es muy travieso!'
            },
            {
                name: 'El alfil veloz',
                category: 'Tactics',
                level: 1,
                description: 'Movimiento diagonal del alfil',
                content: 'El alfil se mueve en diagonal, todas las casillas que quieras. Cada alfil permanece siempre en casillas del mismo color (blancas o negras). Los dos alfiles juntos controlan todo el tablero. ¡Son muy rápidos!'
            },
            {
                name: 'La torre astuta',
                category: 'Tactics',
                level: 1,
                description: 'Movimiento en línea recta de la torre',
                content: 'La torre se mueve en línea recta: horizontal o vertical, todas las casillas que quieras. Es muy poderosa en filas y columnas abiertas. Dos torres en la séptima fila son devastadoras. ¡Son como cañones!'
            },
            {
                name: 'La dama poderosa',
                category: 'Tactics',
                level: 1,
                description: 'El movimiento más versátil del tablero',
                content: 'La dama combina el movimiento de torre y alfil: puede moverse en línea recta y en diagonal. Es la pieza más poderosa del tablero. ¡Pero cuidado! No la saques muy pronto o te la pueden atacar.'
            },
            {
                name: 'El rey ansioso',
                category: 'Tactics',
                level: 1,
                description: 'Movimiento del rey y su importancia',
                content: 'El rey se mueve 1 casilla en cualquier dirección. Es la pieza más importante: si lo pierdes, pierdes la partida. Mantenlo seguro al principio, pero actívalo en el final. ¡Protégelo siempre!'
            },
            {
                name: 'Orígenes del ajedrez',
                category: 'Openings',
                level: 1,
                description: 'Historia y evolución del juego',
                content: 'El ajedrez nació en India hace más de 1500 años. Se llamaba "chaturanga" y representaba un ejército. Viajó a Persia, luego al mundo árabe y finalmente a Europa, donde evolucionó a las reglas actuales. ¡Un juego milenario!'
            },
            {
                name: '¡Jaque al rey!',
                category: 'Tactics',
                level: 1,
                description: 'Concepto de jaque y cómo responder',
                content: 'Jaque es cuando el rey está siendo atacado. Debes responder inmediatamente: 1) Mover el rey a una casilla segura, 2) Bloquear el ataque con otra pieza, o 3) Capturar la pieza atacante. ¡No puedes ignorar un jaque!'
            },
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
