import { CustomContentConfig, PlayerActionPoses, CpuActionPoses, SelectionMenuTextConfig, UIIconsConfig } from '../types';
import demonCastleArenaBg from '../assets/images/demon_castle_arena_bg_1791460248664.jpg';
import tcsCrownLogo from '../assets/images/tcs_crown_profile_logo_1791461323571.jpg';
import crimsonWarriorSprite from '../assets/images/player_crimson_warrior.png';

export const DEFAULT_ARENA_BG: string = demonCastleArenaBg;
export const DEFAULT_TCS_LOGO: string = tcsCrownLogo;
export const DEFAULT_PLAYER_SPRITE: string = crimsonWarriorSprite;

// ============================================================================
// DEFAULT ACTION SPRITES & GRAPHICAL ASSETS (SVG DATA URIs)
// Dynamic visual cues for each character state: Idle, Attack, Defend, Special, Hurt, Victory
// ============================================================================

export const DEFAULT_PLAYER_POSES: PlayerActionPoses = {
  // 1. IDLE POSE: Ready stance with gleaming sword
  idle: crimsonWarriorSprite,

  // 2. QUICK ATTACK POSE: Forward lunge blade slash with curved light trail
  attack: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="260" viewBox="0 0 220 260">
    <defs>
      <linearGradient id="pSlash" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="%23ffffff"/><stop offset="40%" stop-color="%23fde047"/><stop offset="100%" stop-color="%23ef4444"/></linearGradient>
      <linearGradient id="pGold2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23facc15"/><stop offset="100%" stop-color="%23ca8a04"/></linearGradient>
    </defs>
    <!-- Swoosh Slash Crescent Trail -->
    <path d="M 30 190 Q 150 140 195 40 Q 170 120 70 180 Z" fill="url(%23pSlash)" opacity="0.9" filter="drop-shadow(0 0 10px %23f59e0b)"/>
    <!-- Dynamic Forward Leaning Body -->
    <g transform="rotate(18 105 130)">
      <rect x="65" y="80" width="60" height="85" rx="15" fill="%231d4ed8"/>
      <circle cx="95" cy="55" r="30" fill="%23e2e8f0"/>
      <rect x="80" y="52" width="30" height="8" rx="4" fill="%230f172a"/>
      <circle cx="88" cy="56" r="2.5" fill="%23ef4444"/>
      <circle cx="102" cy="56" r="2.5" fill="%23ef4444"/>
      <path d="M 75 32 L 85 44 L 95 28 L 105 44 L 115 32 L 115 46 L 75 46 Z" fill="url(%23pGold2)"/>
      <!-- Lunging Arms & Thrusting Blade -->
      <path d="M 120 90 L 190 65 L 185 58 L 115 82 Z" fill="%23ffffff"/>
      <circle cx="120" cy="90" r="10" fill="url(%23pGold2)"/>
    </g>
    <!-- Impact Sparks -->
    <polygon points="195,35 205,45 215,35 205,55 195,65 185,55" fill="%23fef08a"/>
    <text x="110" y="245" font-family="sans-serif" font-weight="900" font-size="16" fill="%23ef4444" text-anchor="middle" letter-spacing="2">SLASH!</text>
  </svg>`,

  // 3. HEAVY ATTACK POSE: 2-Handed smash with raging fire sparks
  heavyAttack: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="260" viewBox="0 0 220 260">
    <defs>
      <linearGradient id="pHvyFlame" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23f59e0b"/><stop offset="50%" stop-color="%23ef4444"/><stop offset="100%" stop-color="%237f1d1d"/></linearGradient>
      <linearGradient id="pHvyBlade" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23fff"/><stop offset="100%" stop-color="%23f97316"/></linearGradient>
    </defs>
    <!-- Background Fire Nova Burst -->
    <circle cx="110" cy="110" r="85" fill="url(%23pHvyFlame)" opacity="0.35"/>
    <path d="M 110 10 L 125 60 L 175 40 L 140 80 L 195 105 L 145 130 L 190 170 L 130 160 L 135 210 L 105 175 L 80 215 L 85 160 L 25 170 L 70 130 L 25 105 L 80 80 L 45 40 L 95 60 Z" fill="%23f59e0b" opacity="0.25"/>
    <!-- Greatsword Overhead Strike -->
    <path d="M 98 15 L 122 15 L 118 135 L 102 135 Z" fill="url(%23pHvyBlade)"/>
    <polygon points="110,0 126,16 94,16" fill="%23fff"/>
    <rect x="90" y="132" width="40" height="10" rx="4" fill="%23ca8a04"/>
    <circle cx="110" cy="148" r="7" fill="%23ef4444"/>
    <!-- Smashing Warrior Pose -->
    <circle cx="110" cy="120" r="28" fill="%23e2e8f0"/>
    <rect x="95" y="116" width="30" height="7" rx="3.5" fill="%230f172a"/>
    <rect x="80" y="145" width="60" height="65" rx="14" fill="%23ea580c"/>
    <text x="110" y="245" font-family="sans-serif" font-weight="900" font-size="16" fill="%23f97316" text-anchor="middle" letter-spacing="3">HEAVY SMASH!</text>
  </svg>`,

  // 4. DEFEND / GUARD POSE: Crouched behind giant hexagonal radiant shield
  defend: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="260" viewBox="0 0 220 260">
    <defs>
      <linearGradient id="pShield" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%2338bdf8"/><stop offset="50%" stop-color="%230284c7"/><stop offset="100%" stop-color="%230369a1"/></linearGradient>
    </defs>
    <!-- Hex Barrier Pulse Ring -->
    <polygon points="110,20 185,60 185,160 110,210 35,160 35,60" fill="%2338bdf8" opacity="0.2"/>
    <polygon points="110,30 175,65 175,155 110,195 45,155 45,65" stroke="%2338bdf8" stroke-width="4" fill="none" opacity="0.8"/>
    <!-- Giant Tower Aegis Shield -->
    <path d="M 60 55 L 110 40 L 160 55 L 155 150 Q 110 205 110 205 Q 65 150 60 150 Z" fill="url(%23pShield)" stroke="%23e0f2fe" stroke-width="5"/>
    <!-- Glowing Cross Emblem on Shield -->
    <rect x="103" y="65" width="14" height="95" rx="7" fill="%23ffffff" opacity="0.95"/>
    <rect x="75" y="95" width="70" height="14" rx="7" fill="%23ffffff" opacity="0.95"/>
    <!-- Defender Peeking Eyes Above Shield -->
    <circle cx="110" cy="40" r="18" fill="%2394a3b8"/>
    <rect x="100" y="36" width="20" height="6" rx="3" fill="%230f172a"/>
    <circle cx="106" cy="39" r="2" fill="%2338bdf8"/>
    <circle cx="114" cy="39" r="2" fill="%2338bdf8"/>
    <text x="110" y="245" font-family="sans-serif" font-weight="900" font-size="16" fill="%2338bdf8" text-anchor="middle" letter-spacing="3">PARRY GUARD</text>
  </svg>`,

  // 5. SPECIAL SKILL / ULTIMATE POSE: Radiant golden aura wings & Royal Crown burst
  special: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="260" viewBox="0 0 220 260">
    <defs>
      <linearGradient id="pSpecAura" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23fef08a"/><stop offset="50%" stop-color="%23f59e0b"/><stop offset="100%" stop-color="%23b45309"/></linearGradient>
      <linearGradient id="pRay" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="%23fff"/><stop offset="100%" stop-color="%23fde047"/></linearGradient>
    </defs>
    <!-- Radiant Golden Light Pillar Rays -->
    <polygon points="110,0 135,260 85,260" fill="url(%23pRay)" opacity="0.45"/>
    <polygon points="0,70 220,190 200,210 0,110" fill="url(%23pRay)" opacity="0.25"/>
    <polygon points="220,70 0,190 0,210 220,110" fill="url(%23pRay)" opacity="0.25"/>
    <!-- Golden Angelic Corona Wings -->
    <path d="M 110 110 Q 180 50 205 10 Q 185 90 145 130 Z" fill="url(%23pSpecAura)"/>
    <path d="M 110 110 Q 40 50 15 10 Q 35 90 75 130 Z" fill="url(%23pSpecAura)"/>
    <!-- Levitating Ascended Champion -->
    <circle cx="110" cy="85" r="32" fill="%23fef08a" stroke="%23ca8a04" stroke-width="4"/>
    <rect x="92" y="80" width="36" height="8" rx="4" fill="%230f172a"/>
    <circle cx="102" cy="84" r="3" fill="%23f59e0b"/>
    <circle cx="118" cy="84" r="3" fill="%23f59e0b"/>
    <!-- Gigantic Floating Crown -->
    <path d="M 80 40 L 95 60 L 110 32 L 125 60 L 140 40 L 138 68 L 82 68 Z" fill="%23facc15" stroke="%23fff" stroke-width="2"/>
    <circle cx="110" cy="30" r="5" fill="%23ef4444"/>
    <!-- Dual Excalibur Crossed Light -->
    <path d="M 50 170 L 170 80" stroke="%23ffffff" stroke-width="7" stroke-linecap="round"/>
    <path d="M 170 170 L 50 80" stroke="%23ffffff" stroke-width="7" stroke-linecap="round"/>
    <text x="110" y="245" font-family="serif" font-weight="900" font-size="16" fill="%23fef08a" text-anchor="middle" letter-spacing="3">CROWN ULTIMATE</text>
  </svg>`,

  // 6. HURT / RECOIL POSE: Impact spark and reeling back
  hurt: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="260" viewBox="0 0 220 260">
    <!-- Starburst Impact Explosion -->
    <polygon points="110,60 130,95 170,85 145,115 175,145 135,145 130,185 105,155 75,180 85,140 50,135 80,110 60,80 95,90" fill="%23ef4444" opacity="0.6"/>
    <!-- Distorted / Knocked Back Body -->
    <g transform="rotate(-18 110 130)">
      <rect x="80" y="90" width="60" height="75" rx="14" fill="%23b91c1c"/>
      <circle cx="110" cy="65" r="28" fill="%23fecaca"/>
      <!-- Dizzy X Eyes -->
      <path d="M 98 60 L 106 68 M 106 60 L 98 68" stroke="%237f1d1d" stroke-width="3" stroke-linecap="round"/>
      <path d="M 114 60 L 122 68 M 122 60 L 114 68" stroke="%237f1d1d" stroke-width="3" stroke-linecap="round"/>
      <path d="M 104 80 Q 110 74 116 80" stroke="%237f1d1d" stroke-width="2.5" fill="none"/>
    </g>
    <text x="110" y="245" font-family="sans-serif" font-weight="900" font-size="16" fill="%23f87171" text-anchor="middle" letter-spacing="2">HIT!</text>
  </svg>`,

  // 7. VICTORY POSE: Raising the Golden Crown triumphantly with trophies and sparkles
  victory: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="260" viewBox="0 0 220 260">
    <defs>
      <linearGradient id="pVicGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23fde047"/><stop offset="50%" stop-color="%23f59e0b"/><stop offset="100%" stop-color="%23d97706"/></linearGradient>
    </defs>
    <!-- Confetti & Celebration Stars -->
    <circle cx="45" cy="40" r="4" fill="%23ec4899"/>
    <circle cx="175" cy="45" r="5" fill="%2338bdf8"/>
    <circle cx="30" cy="110" r="3" fill="%23facc15"/>
    <circle cx="190" cy="115" r="4" fill="%23a855f7"/>
    <polygon points="50,70 54,82 66,82 56,90 60,102 50,94 40,102 44,90 34,82 46,82" fill="%23facc15"/>
    <polygon points="170,70 174,82 186,82 176,90 180,102 170,94 160,102 164,90 154,82 166,82" fill="%23facc15"/>
    <!-- Raised Crown in High Arms -->
    <path d="M 85 10 L 98 32 L 110 8 L 122 32 L 135 10 L 132 38 L 88 38 Z" fill="url(%23pVicGold)" stroke="%23fff" stroke-width="2"/>
    <circle cx="110" cy="5" r="5" fill="%23ef4444"/>
    <circle cx="85" cy="8" r="3.5" fill="%2338bdf8"/>
    <circle cx="135" cy="8" r="3.5" fill="%2338bdf8"/>
    <!-- Cheering Champion with Arms Raised Up -->
    <path d="M 80 100 L 95 40 M 140 100 L 125 40" stroke="url(%23pVicGold)" stroke-width="12" stroke-linecap="round"/>
    <circle cx="110" cy="75" r="28" fill="%23fef08a"/>
    <!-- Happy Smile Face -->
    <path d="M 98 70 Q 102 65 106 70" stroke="%231e293b" stroke-width="3" fill="none"/>
    <path d="M 114 70 Q 118 65 122 70" stroke="%231e293b" stroke-width="3" fill="none"/>
    <path d="M 102 82 Q 110 94 118 82" fill="%23dc2626"/>
    <!-- Royal Mantle & Armor -->
    <rect x="80" y="105" width="60" height="70" rx="14" fill="%231d4ed8"/>
    <path d="M 65 110 Q 110 180 155 110" fill="url(%23pVicGold)" opacity="0.6"/>
    <text x="110" y="240" font-family="serif" font-weight="900" font-size="18" fill="%23facc15" text-anchor="middle" letter-spacing="4">VICTORY!</text>
  </svg>`,
};

export const DEFAULT_CPU_POSES: CpuActionPoses = {
  // 1. CPU IDLE: Demon King
  idle: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="260" viewBox="0 0 220 260">
    <defs>
      <linearGradient id="cpuDark" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23581c87"/><stop offset="100%" stop-color="%231e1b4b"/></linearGradient>
    </defs>
    <!-- Dark Cloak -->
    <path d="M 65 80 Q 30 190 45 235 Q 110 215 155 235 Q 170 180 145 80 Z" fill="%233b0764"/>
    <!-- Dark Armor -->
    <rect x="75" y="80" width="60" height="90" rx="15" fill="url(%23cpuDark)"/>
    <circle cx="105" cy="55" r="32" fill="%23312e81"/>
    <!-- Spiky Dark Crown -->
    <polygon points="75,40 90,15 105,40 120,15 135,40" fill="%23a855f7"/>
    <!-- Glowing Crimson Eyes -->
    <circle cx="95" cy="56" r="4" fill="%23ef4444"/>
    <circle cx="115" cy="56" r="4" fill="%23ef4444"/>
    <!-- Shadow Blade -->
    <path d="M 150 110 L 180 30 L 175 115 Z" fill="%23c084fc"/>
  </svg>`,

  // 2. CPU ATTACK: Lunging Void Blade Slash
  attack: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="260" viewBox="0 0 220 260">
    <defs>
      <linearGradient id="cpuSlash" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="%23c084fc"/><stop offset="100%" stop-color="%23ef4444"/></linearGradient>
    </defs>
    <path d="M 190 190 Q 70 140 25 40 Q 50 120 150 180 Z" fill="url(%23cpuSlash)" opacity="0.85"/>
    <g transform="rotate(-15 105 130)">
      <rect x="75" y="80" width="60" height="85" rx="15" fill="%234c1d95"/>
      <circle cx="105" cy="55" r="30" fill="%231e1b4b"/>
      <circle cx="95" cy="56" r="4" fill="%23ef4444"/>
      <circle cx="115" cy="56" r="4" fill="%23ef4444"/>
    </g>
    <text x="110" y="245" font-family="sans-serif" font-weight="900" font-size="16" fill="%23c084fc" text-anchor="middle">DEMON SLASH!</text>
  </svg>`,

  // 3. CPU DEFEND: Void Barrier Sphere
  defend: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="260" viewBox="0 0 220 260">
    <circle cx="110" cy="115" r="80" fill="%23581c87" opacity="0.35"/>
    <circle cx="110" cy="115" r="70" stroke="%23c084fc" stroke-width="5" fill="none" opacity="0.8"/>
    <circle cx="110" cy="100" r="28" fill="%231e1b4b"/>
    <circle cx="102" cy="98" r="4" fill="%23a855f7"/>
    <circle cx="118" cy="98" r="4" fill="%23a855f7"/>
    <rect x="80" y="130" width="60" height="65" rx="14" fill="%233b0764"/>
    <text x="110" y="245" font-family="sans-serif" font-weight="900" font-size="16" fill="%23c084fc" text-anchor="middle">DEMON GUARD</text>
  </svg>`,

  // 4. CPU SPECIAL: Abyssal Demon Supernova
  special: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="260" viewBox="0 0 220 260">
    <circle cx="110" cy="110" r="95" fill="%237e22ce" opacity="0.4"/>
    <polygon points="110,10 135,90 215,110 135,130 110,210 85,130 5,110 85,90" fill="%23c084fc" opacity="0.75"/>
    <circle cx="110" cy="85" r="30" fill="%230f172a"/>
    <circle cx="100" cy="85" r="4" fill="%23f43f5e"/>
    <circle cx="120" cy="85" r="4" fill="%23f43f5e"/>
    <text x="110" y="245" font-family="serif" font-weight="900" font-size="16" fill="%23e9d5ff" text-anchor="middle">DEMON BURST!</text>
  </svg>`,

  // 5. CPU HURT: Dark Armor Recoil
  hurt: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="220" height="260" viewBox="0 0 220 260">
    <polygon points="110,60 140,90 170,80 140,115 160,150 120,135 110,180 85,145 60,165 75,125 50,110 80,95" fill="%23a855f7" opacity="0.65"/>
    <g transform="rotate(16 110 130)">
      <rect x="80" y="90" width="60" height="75" rx="14" fill="%233b0764"/>
      <circle cx="110" cy="65" r="28" fill="%231e1b4b"/>
      <circle cx="100" cy="65" r="4" fill="%23ef4444"/>
      <circle cx="120" cy="65" r="4" fill="%23ef4444"/>
    </g>
    <text x="110" y="245" font-family="sans-serif" font-weight="900" font-size="16" fill="%23f43f5e" text-anchor="middle">RECOIL!</text>
  </svg>`,
};

export const DEFAULT_UI_ICONS: UIIconsConfig = {
  logo: DEFAULT_TCS_LOGO,
  attack: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="26" fill="%23dc2626"/><path d="M 15 45 L 42 18 L 46 22 L 19 49 Z" fill="%23fff"/><circle cx="18" cy="46" r="4" fill="%23facc15"/></svg>`,
  heavy: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="26" fill="%23ea580c"/><polygon points="30,10 36,24 50,24 38,34 42,48 30,38 18,48 22,34 10,24 24,24" fill="%23fef08a"/></svg>`,
  defend: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="26" fill="%230284c7"/><path d="M 20 18 L 30 14 L 40 18 L 38 38 Q 30 46 30 46 Q 22 38 22 38 Z" fill="%23e0f2fe"/></svg>`,
  special: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="26" fill="%23ca8a04"/><polygon points="32,10 16,32 28,32 24,50 44,26 32,26" fill="%23fef08a"/></svg>`,
  jump: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="26" fill="%23b45309"/><path d="M 30 16 L 42 30 L 34 30 L 34 44 L 26 44 L 26 30 L 18 30 Z" fill="%23fef08a"/></svg>`,
};

export const DEFAULT_SELECTION_TEXT: SelectionMenuTextConfig = {
  headerTitle: 'Role Selection',
  headerSubtitle: 'Pilih role tempurmu untuk mengalahkan Demon King',
  confirmButtonText: 'MASUK KE ARENA TEMPUR',
  badgeText: 'TERPILIH',
  tipText: 'Pilih role andalanmu (Fighter, Assassin, Tank, Sword Mage) untuk bertarung!',
};

export const DEFAULT_CC_CONFIG: CustomContentConfig = {
  version: '3.1',
  arenaBackground: DEFAULT_ARENA_BG,
  arenaFloorTrim: '',
  startScreenPhoto: '',
  winUrl: 'https://forms.gle/cTiWvirxKgVkKB7D9',

  playerPhoto: DEFAULT_PLAYER_SPRITE,
  playerPoses: DEFAULT_PLAYER_POSES,

  cpuPhoto: '',
  cpuPoses: DEFAULT_CPU_POSES,

  uiIcons: DEFAULT_UI_ICONS,

  selectionMenuText: DEFAULT_SELECTION_TEXT,

  characterOverrides: {
    crown_knight: {
      name: 'Fighter',
      title: 'Petarung Seimbang (Fighter)',
      specialName: 'Royal Excalibur',
      description: 'Role petarung seimbang dengan daya tahan solid dan sabetan pedang beruntun yang mematikan.',
    },
    shadow_valkyrie: {
      name: 'Assassin',
      title: 'Pembunuh Bayangan (Assassin)',
      specialName: 'Gale Blade Tempest',
      description: 'Role lincah berkecepatan tinggi, langkah kilat mendekati musuh, dan serangan tebasan bertubi-tubi.',
    },
    grand_crusader: {
      name: 'Tank',
      title: 'Benteng Perisai (Tank)',
      specialName: 'Fortress Slam',
      description: 'Role tank dengan HP sangat tebal dan pertahanan perisai paling kokoh menahan gempuran musuh.',
    },
    crimson_duelist: {
      name: 'Sword Mage',
      title: 'Penyihir Pedang (Sword Mage)',
      specialName: 'Crimson Dragon Burst',
      description: 'Role ahli pedang sihir api dengan daya hancur burst damage tinggi saat menyerang tepat sasaran.',
    },
    demon_king: {
      name: 'Demon King',
      title: 'Raja Iblis Penguasa Kegelapan',
      specialName: 'Dark Demon Rupture',
      description: 'Demon King dengan pola serang taktikal bertahap, memiliki celah stamina setelah 3 serangan.',
    },
  },
  customPlayerName: '',
};

// Preset high quality background photos
export const ARENA_BG_PRESETS = [
  {
    id: 'demon_castle',
    name: 'Kastil Demon King & Blood Moon (Default)',
    description: 'Benteng kastil neraka, air terjun lava pijar, dan bulan darah merah',
    url: DEFAULT_ARENA_BG,
  },
  {
    id: 'colosseum',
    name: 'Colosseum Gladiator Emas',
    description: 'Arena pertarungan pasir dan pilar batu megah',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%231a0b2e"/><stop offset="50%" stop-color="%232d124d"/><stop offset="100%" stop-color="%230b0514"/></linearGradient><linearGradient id="pillar" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="%23eab308"/><stop offset="100%" stop-color="%23ca8a04"/></linearGradient></defs><rect width="800" height="450" fill="url(%23bg)"/><circle cx="400" cy="180" r="140" fill="%23f59e0b" opacity="0.15" filter="blur(20px)"/><path d="M 50 400 L 750 400 L 800 450 L 0 450 Z" fill="%233b1e54"/><rect x="80" y="120" width="40" height="280" fill="url(%23pillar)" opacity="0.6"/><rect x="160" y="150" width="35" height="250" fill="url(%23pillar)" opacity="0.45"/><rect x="680" y="120" width="40" height="280" fill="url(%23pillar)" opacity="0.6"/><rect x="605" y="150" width="35" height="250" fill="url(%23pillar)" opacity="0.45"/><circle cx="400" cy="130" r="50" fill="%23fbbf24" opacity="0.3"/><text x="400" y="240" font-family="serif" font-size="28" font-weight="900" fill="%23fbbf24" text-anchor="middle" letter-spacing="4">ARENA MAHKOTA EMAS</text></svg>',
  },
  {
    id: 'citadel',
    name: 'Benteng Malam Berbadai',
    description: 'Langit gelap berpetir dengan gerbang obsidian',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><defs><linearGradient id="gCitadel" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%2309111e"/><stop offset="70%" stop-color="%230f172a"/><stop offset="100%" stop-color="%23020617"/></linearGradient></defs><rect width="800" height="450" fill="url(%23gCitadel)"/><path d="M0 260 L 150 180 L 280 260 L 400 140 L 520 260 L 650 190 L 800 270 L 800 450 L 0 450 Z" fill="%231e293b" opacity="0.8"/><circle cx="400" cy="100" r="70" fill="%2338bdf8" opacity="0.15" filter="blur(30px)"/><path d="M 380 60 L 420 140 L 400 150 L 440 220" stroke="%2338bdf8" stroke-width="3" fill="none" opacity="0.8"/><text x="400" y="320" font-family="sans-serif" font-size="22" font-weight="800" fill="%2394a3b8" text-anchor="middle" letter-spacing="6">OBSIDIAN CITADEL</text></svg>',
  },
  {
    id: 'magma',
    name: 'Kawah Naga Merah',
    description: 'Lava menyala merah dan percikan api abadi',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><defs><linearGradient id="gMagma" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%231c0505"/><stop offset="60%" stop-color="%233b0d0c"/><stop offset="100%" stop-color="%237f1d1d"/></linearGradient></defs><rect width="800" height="450" fill="url(%23gMagma)"/><circle cx="400" cy="380" r="280" fill="%23ef4444" opacity="0.35" filter="blur(40px)"/><path d="M 0 380 Q 200 340 400 370 T 800 380 L 800 450 L 0 450 Z" fill="%23b91c1c"/><text x="400" y="220" font-family="serif" font-size="26" font-weight="900" fill="%23fca5a5" text-anchor="middle" letter-spacing="4">CRIMSON FIRE DRAGON LAIR</text></svg>',
  },
];

// Preset photos for Start Screen
export const START_SCREEN_PRESETS = [
  {
    id: 'default',
    name: 'Tampilan Mahkota Standar',
    description: 'Desain awal bawaan dengan lambang mahkota bercahaya',
    url: '',
  },
  {
    id: 'royal_banner',
    name: 'Panji Kerajaan Megah (Royal Crest)',
    description: 'Banner megah lambang kehormatan tahta',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><defs><linearGradient id="gStart" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%232e1065"/><stop offset="50%" stop-color="%2317072b"/><stop offset="100%" stop-color="%23090312"/></linearGradient></defs><rect width="800" height="400" fill="url(%23gStart)"/><circle cx="400" cy="180" r="160" fill="%23f59e0b" opacity="0.15" filter="blur(40px)"/><path d="M 330 110 L 360 160 L 400 110 L 440 160 L 470 110 L 460 210 L 340 210 Z" fill="%23fbbf24"/><circle cx="400" cy="100" r="15" fill="%23fef08a"/><circle cx="330" cy="100" r="12" fill="%23fef08a"/><circle cx="470" cy="100" r="12" fill="%23fef08a"/><rect x="350" y="215" width="100" height="15" rx="7" fill="%23d97706"/><text x="400" y="290" font-family="serif" font-weight="900" font-size="34" fill="%23fde047" text-anchor="middle" letter-spacing="4">THE CROWN SOCIALITY</text><text x="400" y="325" font-family="sans-serif" font-weight="700" font-size="14" fill="%23cbd5e1" text-anchor="middle" letter-spacing="3">EDISI KHUSUS CUSTOM CONTENT</text></svg>',
  },
  {
    id: 'dragon_throne',
    name: 'Takhta Api Naga Purba',
    description: 'Banner naga merah perkasa siap bertarung',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><defs><linearGradient id="gDrg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%234c0519"/><stop offset="60%" stop-color="%231f030a"/><stop offset="100%" stop-color="%23090103"/></linearGradient></defs><rect width="800" height="400" fill="url(%23gDrg)"/><circle cx="400" cy="160" r="140" fill="%23f43f5e" opacity="0.25" filter="blur(30px)"/><polygon points="400,60 450,150 420,180 470,220 400,200 330,220 380,180 350,150" fill="%23f43f5e"/><text x="400" y="280" font-family="serif" font-weight="900" font-size="32" fill="%23fecdd3" text-anchor="middle" letter-spacing="4">DUEL NAGA MAHKOTA</text><text x="400" y="315" font-family="sans-serif" font-weight="700" font-size="13" fill="%23fda4af" text-anchor="middle" letter-spacing="3">1 VS 1 TACTICAL BATTLE</text></svg>',
  },
];

const LOCAL_STORAGE_KEY = 'crown_sociality_cc_config_v3';

export function loadCustomContentConfig(): CustomContentConfig {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      // ignore
    }
  }
  return DEFAULT_CC_CONFIG;
}

export function saveCustomContentConfig(_config: CustomContentConfig): boolean {
  return true;
}

export function resetCustomContentConfig(): CustomContentConfig {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {}
  }
  return DEFAULT_CC_CONFIG;
}
