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
            {
                name: 'Mantenerse con vida',
                category: 'Strategy',
                level: 1,
                description: 'Defensa básica y protección de piezas',
                content: '¡No regales tus piezas! Antes de mover, pregúntate: "¿Me pueden comer si voy ahí?". Si atacan una pieza tuya: 1) Muévela, 2) Defiéndela con otra, o 3) Ataca a quien te ataca. ¡Valora tu ejército!'
            },
            {
                name: 'Jaque mate, ¡Se acabó!',
                category: 'Tactics',
                level: 1,
                description: 'Objetivo final del juego',
                content: 'El Jaque Mate ocurre cuando el Rey está en jaque y NO tiene escapatoria. No puede moverse, no puede bloquear y no puede capturar. ¡Es el fin de la partida y la victoria es tuya!'
            },
            {
                name: 'Resuelve la partida',
                category: 'Tactics',
                level: 1,
                description: 'Ejercicios de mate en 1',
                content: 'Entrena tu ojo de águila. Busca oportunidades para terminar la partida en un solo movimiento. Observa las líneas de ataque de tus piezas y busca al Rey enemigo encerrado.'
            },
            {
                name: 'El valor de cada pieza',
                category: 'Strategy',
                level: 1,
                description: 'Sistema de puntos de las piezas',
                content: 'Cada pieza tiene un valor: Peón=1, Caballo=3, Alfil=3, Torre=5, Dama=9. El Rey vale toda la partida. Usa esto para decidir si te conviene cambiar piezas. ¡No cambies una Torre por un Caballo sin una buena razón!'
            },
            {
                name: 'Juego de peones',
                category: 'Strategy',
                level: 1,
                description: 'Estructura de peones básica',
                content: 'Los peones son el escudo y la estructura. No los muevas sin sentido, porque no pueden retroceder. Trata de dominar el centro con tus peones al inicio. ¡Una buena cadena de peones es una muralla!'
            },
            {
                name: 'Juego de caballos',
                category: 'Tactics',
                level: 1,
                description: 'Tácticas con caballos',
                content: 'Los caballos son excelentes bloqueadores y atacantes sorpresa. Intenta colocarlos en el centro del tablero ("caballo en el centro vale por ciento"). Evita dejarlos en los bordes donde tienen menos movimientos.'
            },

            // NIVEL 2 - FUNDAMENTOS
            {
                name: 'Juego de alfiles',
                category: 'Tactics',
                level: 2,
                description: 'Uso efectivo de los alfiles',
                content: 'Los alfiles necesitan diagonales abiertas. No los bloquees con tus propios peones. El "Alfil Bueno" es el que corre por casillas de color distinto a donde tienes tus peones fijos. ¡Dales libertad!'
            },
            {
                name: 'Juego de torres',
                category: 'Tactics',
                level: 2,
                description: 'Coordinación de torres',
                content: 'Las torres aman las columnas abiertas (sin peones). Conéctalas entre sí moviendo la Dama y enrocándote. Dos torres dobladas en una columna son una fuerza imparable.'
            },
            {
                name: 'Juego de dama',
                category: 'Tactics',
                level: 2,
                description: 'Uso estratégico de la dama',
                content: 'La Dama es tu mejor atacante, pero no la saques a pasear sola al principio o las piezas menores la atacarán ganando tiempo. Úsala para rematar ataques o crear amenazas dobles.'
            },
            {
                name: 'Juego de rey',
                category: 'Endgame',
                level: 2,
                description: 'Actividad del rey en el final',
                content: 'En la apertura y medio juego, el Rey es cobarde y se esconde. Pero en el Final, ¡el Rey se vuelve un héroe! Úsalo para apoyar a tus peones y atacar los del rival. Un Rey activo gana finales.'
            },
            {
                name: 'Enroque',
                category: 'Openings',
                level: 2,
                description: 'Movimiento especial de seguridad del rey',
                content: 'El único movimiento donde mueves dos piezas a la vez (Rey y Torre). Sirve para poner seguro al Rey y activar la Torre. Reglas: sin piezas en medio, ni el Rey ni la Torre se han movido antes, y no puedes enrocar si estás en jaque o pasas por jaque.'
            },
            {
                name: 'Resuelve la partida',
                category: 'Tactics',
                level: 2,
                description: 'Ejercicios de mate en 2',
                content: 'Sube de nivel buscando combinaciones de dos jugadas. A veces necesitas sacrificar una pieza o hacer un jaque previo para obligar al Rey a ir a una casilla fatal. ¡Calcula!'
            },
            {
                name: 'Ajedrecistas increíbles',
                category: 'Openings',
                level: 2,
                description: 'Grandes maestros de la historia',
                content: 'Conoce a leyendas como Morphy, Capablanca o Kasparov. Cada uno aportó ideas revolucionarias. Estudiar sus partidas clásicas es la mejor forma de absorber patrones ganadores.'
            },
            {
                name: 'Jaques, capturas y amenazas',
                category: 'Tactics',
                level: 2,
                description: 'Tácticas fundamentales',
                content: 'Las jugadas forzadas son la clave de la táctica. En cada turno, busca primero Jaques, luego Capturas y finalmente Amenazas (J-C-A). ¡Obliga a tu rival a responder a tu juego!'
            },
            {
                name: 'Sigue el sistema',
                category: 'Strategy',
                level: 2,
                description: 'Desarrollo sistemático de piezas',
                content: 'No muevas la misma pieza dos veces en la apertura si no es necesario. Saca caballos y alfiles, enroca, conecta torres. ¡Espera a tener todo tu ejército listo antes de lanzar el ataque final!'
            },
            {
                name: 'Campeonatos',
                category: 'Openings',
                level: 2,
                description: 'Torneos y competiciones importantes',
                content: 'El Campeonato Mundial es el título máximo. También existen las Olimpiadas de Ajedrez y torneos de élite como Wijk aan Zee. ¡El ajedrez competitivo es un deporte de alto rendimiento!'
            },
            {
                name: 'Apertura',
                category: 'Openings',
                level: 2,
                description: 'Principios de la apertura',
                content: 'Objetivos: 1) Controlar el centro, 2) Desarrollar piezas menores, 3) Poner seguro al Rey. Si cumples estos tres principios, tendrás una posición sólida para enfrentar el medio juego.'
            },
            {
                name: 'Medio juego',
                category: 'Strategy',
                level: 2,
                description: 'Estrategia en el medio juego',
                content: 'Es la fase de la lucha y la creatividad. Aquí elaboras planes: atacar al rey, ganar espacio, o crear debilidades en los peones del rival. Combina estrategia a largo plazo con táctica inmediata.'
            },
            {
                name: 'Final de juego',
                category: 'Endgame',
                level: 2,
                description: 'Técnicas de finales básicos',
                content: 'Cuando quedan pocas piezas, cada peón es una futura Dama. Aprende a dar mate con Rey y Dama, y Rey y Torre. Conoce la regla del cuadrado y la oposición. ¡La técnica aquí debe ser precisa!'
            },
            {
                name: 'Resuelve la partida',
                category: 'Tactics',
                level: 2,
                description: 'Problemas tácticos variados',
                content: 'Practica temas tácticos mixtos: clavadas, ataques dobles, desviaciones y ataques a la descubierta. Cuantos más patrones reconozcas, ¡más rápido verás las soluciones en tus partidas!'
            },
            {
                name: 'Encuentra tu estilo',
                category: 'Strategy',
                level: 2,
                description: 'Descubrir tu estilo de juego',
                content: '¿Eres un jugador agresivo como Tal o posicional como Petrosian? Juega diferentes aperturas y observa qué tipo de posiciones disfrutas más. ¡Conocer tu estilo te ayudará a elegir mejor tus batallas!'
            },

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
