import { Character } from '../types';
import crimsonWarriorSprite from '../assets/images/player_crimson_warrior.png';

// ============================================================================
// DEFAULT TRANSPARENT CHARACTER PHOTOS & SPRITES (100% Transparent Background)
// Designed for seamless contour outlines that hug each character silhouette
// ============================================================================

export const PLAYER_CRIMSON_WARRIOR_PHOTO = crimsonWarriorSprite;
export const CROWN_KNIGHT_PHOTO = crimsonWarriorSprite;
export const VALKYRIE_LYRA_PHOTO = crimsonWarriorSprite;
export const GRAND_CRUSADER_PHOTO = crimsonWarriorSprite;
export const CRIMSON_DUELIST_PHOTO = crimsonWarriorSprite;

export const DARK_SOVEREIGN_PHOTO = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="260" viewBox="0 0 220 260">
  <defs>
    <linearGradient id="dsVoid" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23c084fc"/><stop offset="100%" stop-color="%23581c87"/></linearGradient>
    <linearGradient id="dsDark" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%232e1065"/><stop offset="100%" stop-color="%230f0728"/></linearGradient>
  </defs>
  <!-- Abyssal Shadow Cape -->
  <path d="M 65 75 Q 20 180 30 240 Q 110 215 180 240 Q 190 180 145 75 Z" fill="%231e1b4b" opacity="0.95"/>
  <!-- Dark Sovereign Armor -->
  <rect x="74" y="76" width="62" height="92" rx="16" fill="url(%23dsDark)"/>
  <path d="M 85 92 L 105 130 L 125 92 Z" fill="url(%23dsVoid)"/>
  <circle cx="105" cy="112" r="6" fill="%23f43f5e"/>
  <!-- Horned Dark Crown & Helm -->
  <circle cx="105" cy="52" r="30" fill="%231e1b4b"/>
  <!-- Jagged Dark Crown Horns -->
  <path d="M 75 42 L 70 12 L 85 30 L 105 16 L 125 30 L 140 12 L 135 42 Z" fill="url(%23dsVoid)"/>
  <!-- Glowing Crimson Demonic Eyes -->
  <rect x="90" y="50" width="30" height="8" rx="4" fill="%23030712"/>
  <circle cx="98" cy="54" r="3" fill="%23ef4444"/>
  <circle cx="112" cy="54" r="3" fill="%23ef4444"/>
  <!-- Dark Legs & Sabatons -->
  <rect x="80" y="165" width="18" height="65" rx="8" fill="%230f0728"/>
  <rect x="112" y="165" width="18" height="65" rx="8" fill="%230f0728"/>
  <rect x="76" y="222" width="24" height="15" rx="6" fill="url(%23dsVoid)"/>
  <rect x="110" y="222" width="24" height="15" rx="6" fill="url(%23dsVoid)"/>
  <!-- Abyssal Void Blade -->
  <rect x="145" y="105" width="16" height="16" rx="6" fill="url(%23dsVoid)"/>
  <path d="M 152 110 L 182 25 L 188 28 L 156 112 Z" fill="%23e9d5ff"/>
  <circle cx="152" cy="116" r="4.5" fill="%23f43f5e"/>
</svg>`;

export const CHARACTERS: Character[] = [
  {
    id: 'crown_knight',
    name: 'Fighter',
    title: 'Petarung Seimbang (Fighter)',
    avatar: '👑',
    customPhoto: CROWN_KNIGHT_PHOTO,
    color: 'from-red-600 to-rose-700',
    accentColor: '#ff0033',
    hp: 280,
    maxHp: 280,
    attackDmg: 18,
    specialDmg: 48,
    specialName: 'Royal Excalibur',
    speed: 9,
    defense: 0.75, // blocks 75% damage
    description: 'Role petarung seimbang dengan daya tahan solid dan sabetan pedang beruntun yang mematikan.'
  },
  {
    id: 'shadow_valkyrie',
    name: 'Assassin',
    title: 'Pembunuh Bayangan (Assassin)',
    avatar: '🦅',
    customPhoto: VALKYRIE_LYRA_PHOTO,
    color: 'from-rose-600 to-red-800',
    accentColor: '#ff0033',
    hp: 240,
    maxHp: 240,
    attackDmg: 22,
    specialDmg: 52,
    specialName: 'Gale Blade Tempest',
    speed: 12,
    defense: 0.65,
    description: 'Role lincah berkecepatan tinggi, langkah kilat mendekati musuh, dan serangan tebasan bertubi-tubi.'
  },
  {
    id: 'grand_crusader',
    name: 'Tank',
    title: 'Benteng Perisai (Tank)',
    avatar: '🛡️',
    customPhoto: GRAND_CRUSADER_PHOTO,
    color: 'from-red-700 to-rose-900',
    accentColor: '#ff0033',
    hp: 340,
    maxHp: 340,
    attackDmg: 15,
    specialDmg: 42,
    specialName: 'Fortress Slam',
    speed: 7,
    defense: 0.85, // blocks 85% damage
    description: 'Role tank dengan HP sangat tebal dan pertahanan perisai paling kokoh menahan gempuran musuh.'
  },
  {
    id: 'crimson_duelist',
    name: 'Sword Mage',
    title: 'Penyihir Pedang (Sword Mage)',
    avatar: '🔥',
    customPhoto: CRIMSON_DUELIST_PHOTO,
    color: 'from-rose-600 to-red-700',
    accentColor: '#ff0033',
    hp: 250,
    maxHp: 250,
    attackDmg: 24,
    specialDmg: 58,
    specialName: 'Crimson Dragon Burst',
    speed: 10,
    defense: 0.70,
    description: 'Role ahli pedang sihir api dengan daya hancur burst damage tinggi saat menyerang tepat sasaran.'
  }
];

export const CPU_BOSS: Character = {
  id: 'demon_king',
  name: 'Demon King',
  title: 'Raja Iblis Penguasa Kegelapan',
  avatar: '👹',
  customPhoto: DARK_SOVEREIGN_PHOTO,
  color: 'from-purple-700 to-violet-950',
  accentColor: '#9333ea',
  hp: 260,
  maxHp: 260,
  attackDmg: 16,
  specialDmg: 38,
  specialName: 'Dark Demon Rupture',
  speed: 7.2,
  defense: 0.65,
  description: 'Demon King dengan pola serang taktikal bertahap, memiliki celah stamina setelah 3 serangan.'
};

export function getMergedCharacters(overrides?: Record<string, {
  name?: string;
  title?: string;
  avatar?: string;
  specialName?: string;
  description?: string;
}>): Character[] {
  if (!overrides) return CHARACTERS;
  return CHARACTERS.map((char) => {
    const o = overrides[char.id];
    if (!o) return char;
    const isCustomUrl = (o.avatar && (o.avatar.startsWith('http') || o.avatar.startsWith('data:image')));
    return {
      ...char,
      name: o.name || char.name,
      title: o.title || char.title,
      avatar: o.avatar || char.avatar,
      customPhoto: isCustomUrl ? o.avatar : char.customPhoto,
      specialName: o.specialName || char.specialName,
      description: o.description || char.description,
    };
  });
}

export function getMergedCpuBoss(override?: {
  name?: string;
  title?: string;
  avatar?: string;
  specialName?: string;
  description?: string;
}): Character {
  if (!override) return CPU_BOSS;
  const isCustomUrl = (override.avatar && (override.avatar.startsWith('http') || override.avatar.startsWith('data:image')));
  return {
    ...CPU_BOSS,
    name: override.name || CPU_BOSS.name,
    title: override.title || CPU_BOSS.title,
    avatar: override.avatar || CPU_BOSS.avatar,
    customPhoto: isCustomUrl ? override.avatar : CPU_BOSS.customPhoto,
    specialName: override.specialName || CPU_BOSS.specialName,
    description: override.description || CPU_BOSS.description,
  };
}
