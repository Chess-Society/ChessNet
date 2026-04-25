export const XP_PER_TIER = 7500;

export const RARITY_STYLES: Record<string, { color: string, border: string, glow: string, bg: string, label: string }> = {
  'Común':      { color: 'text-zinc-400',    border: 'border-zinc-600',    glow: 'rgba(161,161,170,0.3)',   bg: 'bg-zinc-800/30',    label: 'COMÚN' },
  'Infrecuente': { color: 'text-emerald-400', border: 'border-emerald-500', glow: 'rgba(52,211,153,0.4)',    bg: 'bg-emerald-900/20', label: 'INFRECUENTE' },
  'Raro':        { color: 'text-blue-400',    border: 'border-blue-500',    glow: 'rgba(96,165,250,0.5)',    bg: 'bg-blue-900/20',    label: 'RARO' },
  'Épico':       { color: 'text-violet-400',  border: 'border-violet-500',  glow: 'rgba(139,92,246,0.6)',    bg: 'bg-violet-900/20',  label: 'ÉPICO' },
  'Legendario':  { color: 'text-amber-400',   border: 'border-amber-500',   glow: 'rgba(251,191,36,0.7)',    bg: 'bg-amber-900/20',   label: 'LEGENDARIO' },
  'Mítico':      { color: 'text-red-400',     border: 'border-red-500',     glow: 'rgba(248,113,113,0.7)',   bg: 'bg-red-900/20',     label: 'MÍTICO' },
};

export const possibleRewards = [
  // Emotes
  { name: 'Pissed 💢',      type: 'emote',  rarity: 'Común' },
  { name: 'Disgusted 🤢',   type: 'emote',  rarity: 'Infrecuente' },
  { name: 'Sick 🤮',         type: 'emote',  rarity: 'Infrecuente' },
  { name: 'Azure 💙',        type: 'emote',  rarity: 'Raro' },
  { name: 'Celebration 🥳',  type: 'emote',  rarity: 'Épico' },
  { name: 'Shwompy 🐸',      type: 'emote',  rarity: 'Legendario' },
  { name: 'Giga Chad 🗿',    type: 'emote',  rarity: 'Mítico' },
  { name: 'Pensativo 🤔',    type: 'emote',  rarity: 'Infrecuente' },
  { name: 'Victoria 🏆',     type: 'emote',  rarity: 'Épico' },
  
  // Fonts
  { name: 'Cyber Mono',     type: 'font',   rarity: 'Raro' },
  { name: 'Monospace Pro',  type: 'font',   rarity: 'Raro' },
  { name: 'Error 404',      type: 'font',   rarity: 'Legendario' },
  
  // Colors
  { name: 'Azul Ártico',    type: 'color',  rarity: 'Raro' },
  { name: 'Plasma Rojo',    type: 'color',  rarity: 'Épico' },
  { name: 'Sombra Negra',   type: 'color',  rarity: 'Legendario' },
  { name: 'Fucsia Mítico',  type: 'color',  rarity: 'Mítico' },
  
  // Frames
  { name: 'Neón Violeta',   type: 'frame',  rarity: 'Épico' },
  { name: 'Dorado Real',    type: 'frame',  rarity: 'Legendario' },
  { name: 'Corona Nexo',    type: 'frame',  rarity: 'Mítico' },

  // Effects
  { name: 'Trueno Cyber',   type: 'effect', rarity: 'Épico' },
  { name: 'Llamarada',      type: 'effect', rarity: 'Legendario' },
  
  // Badges
  { name: 'Fundador',       type: 'badge',  rarity: 'Mítico' },
  { name: 'Verificado',     type: 'badge',  rarity: 'Raro' },
  { name: 'OG',             type: 'badge',  rarity: 'Legendario' },
].map(r => ({ ...r, ...RARITY_STYLES[r.rarity] }));

export const frameStyles: Record<string, string> = {
  'Acero': 'border-zinc-400 shadow-[0_0_10px_rgba(161,161,170,0.3)]',
  'Amatista': 'border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.5)]',
  'Eléctrico': 'border-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.6)] animate-pulse',
  'Maestro': 'border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.8)] border-[3px]',
  'Neón Violeta': 'border-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]',
  'Dorado Real': 'border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]',
  'Cian Cyber': 'border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]',
  'Esmeralda': 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]',
  'Rojo Sangre': 'border-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]',
  'Corona Nexo': 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.8)] border-[4px] animate-pulse'
};

export const nameColorStyles: Record<string, string> = {
  'Esmeralda': 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]',
  'Violeta Neón': 'text-violet-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]',
  'Oro Puro': 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)] font-black',
  'Gris Piedra': 'text-zinc-500',
  'Violeta': 'text-violet-400',
  'Dorado': 'text-amber-400',
  'Cian': 'text-cyan-400',
  'Rojo': 'text-red-500',
  'Fucsia': 'text-fuchsia-400',
  'Azul Ártico': 'text-cyan-300 drop-shadow-[0_0_5px_rgba(103,232,249,0.4)]',
  'Plasma Rojo': 'text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.6)]',
  'Sombra Negra': 'text-zinc-300 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] font-black'
};

export const nameFontStyles: Record<string, string> = {
  'Retro': 'font-mono tracking-tighter',
  'Elegante': 'italic font-serif',
  'Maestro': 'uppercase tracking-[0.2em] font-black',
  'Cyber': 'font-cyber',
  'Inter Tight': 'font-inter-tight',
  'Monospace Pro': 'font-mono',
  'Error 404': 'font-mono line-through opacity-80'
};

export const shopItems = [
  { name: 'Plasma Rojo', type: 'color', price: 800, rarity: 'Épico', desc: 'Un color rojo intenso que parece fluir por tu nombre.' },
  { name: 'Cian Cyber', type: 'frame', price: 1200, rarity: 'Legendario', desc: 'Marco tecnológico con efectos de pulso cian.' },
  { name: 'Error 404', type: 'font', price: 1500, rarity: 'Legendario', desc: 'Tipografía corrupta para quienes rompen el sistema.' },
  { name: 'Corona Nexo', type: 'frame', price: 5000, rarity: 'Mítico', desc: 'El artefacto definitivo de la red.' },
  { name: 'Dorado Real', type: 'frame', price: 2500, rarity: 'Legendario', desc: 'El marco de los campeones del circuito.' },
  { name: 'Sombra Negra', type: 'color', price: 3000, rarity: 'Legendario', desc: 'Presencia absoluta en el chat.' },
];
