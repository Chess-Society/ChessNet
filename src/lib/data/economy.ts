export const XP_PER_TIER = 7500;

export const RARITY_STYLES: Record<string, { color: string, border: string, glow: string, bg: string, label: string }> = {
  'Common':     { color: 'text-zinc-400',    border: 'border-zinc-600',    glow: 'rgba(161,161,170,0.3)',   bg: 'bg-zinc-800/30',    label: 'Común' },
  'Uncommon':   { color: 'text-emerald-400', border: 'border-emerald-500', glow: 'rgba(52,211,153,0.4)',    bg: 'bg-emerald-900/20', label: 'Infrecuente' },
  'Rare':       { color: 'text-blue-400',    border: 'border-blue-500',    glow: 'rgba(96,165,250,0.5)',    bg: 'bg-blue-900/20',    label: 'Raro' },
  'Epic':       { color: 'text-violet-400',  border: 'border-violet-500',  glow: 'rgba(139,92,246,0.6)',    bg: 'bg-violet-900/20',  label: 'Épico' },
  'Legendary':  { color: 'text-amber-400',   border: 'border-amber-500',   glow: 'rgba(251,191,36,0.7)',    bg: 'bg-amber-900/20',   label: 'Legendario' },
  'Mythic':     { color: 'text-red-400',     border: 'border-red-500',     glow: 'rgba(248,113,113,0.7)',   bg: 'bg-red-900/20',     label: 'Mítico' },
};

export const possibleRewards = [
  { name: 'Wave 👋',      type: 'emote',  rarity: 'Common' },
  { name: 'Thinking 🤔',  type: 'emote',  rarity: 'Uncommon' },
  { name: 'Cyber',        type: 'font',   rarity: 'Rare' },
  { name: 'Cian',         type: 'color',  rarity: 'Rare' },
  { name: 'Neón Violeta', type: 'frame',  rarity: 'Epic' },
  { name: 'Dorado Real',  type: 'frame',  rarity: 'Legendary' },
  { name: 'Fucsia Mítico',type: 'color',  rarity: 'Mythic' },
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
  'Rojo Sangre': 'border-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]'
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
  'Fucsia': 'text-fuchsia-400'
};

export const nameFontStyles: Record<string, string> = {
  'Retro': 'font-mono tracking-tighter',
  'Elegante': 'italic font-serif',
  'Maestro': 'uppercase tracking-[0.2em] font-black',
  'Cyber': 'font-cyber',
  'Inter Tight': 'font-inter-tight',
  'Monospace Pro': 'font-mono'
};

export const shopItems = [
  { name: 'Fucsia', type: 'color', price: 1500, rarity: 'Legendary', desc: 'Un color fucsia neón que destaca en cualquier publicación.' },
  { name: 'Cian Cyber', type: 'frame', price: 2500, rarity: 'Legendary', desc: 'Marco tecnológico con efectos de pulso cian.' },
  { name: 'Monospace Pro', type: 'font', price: 800, rarity: 'Epic', desc: 'Tipografía de terminal para un look más técnico.' },
  { name: 'Rojo Sangre', type: 'frame', price: 3000, rarity: 'Epic', desc: 'Marco agresivo para los jugadores más competitivos.' },
  { name: 'Dorado', type: 'color', price: 5000, rarity: 'Mythic', desc: 'El color de los reyes del tablero.' },
  { name: 'Esmeralda', type: 'frame', price: 1200, rarity: 'Rare', desc: 'Marco natural y elegante.' },
];
