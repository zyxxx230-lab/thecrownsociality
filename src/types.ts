export interface Character {
  id: string;
  name: string;
  title: string;
  avatar: string;
  color: string;
  accentColor: string;
  hp: number;
  maxHp: number;
  attackDmg: number;
  specialDmg: number;
  specialName: string;
  speed: number;
  defense: number; // percentage damage reduction on block
  description: string;
  customPhoto?: string;
}

export type GameScreen = 'start' | 'select' | 'battle' | 'result';
export type BattleResult = 'win' | 'lose' | null;

export interface CombatStats {
  hitsLanded: number;
  damageDealt: number;
  blocksSuccessful: number;
  specialsUsed: number;
  durationSeconds: number;
}

export interface PlayerActionPoses {
  idle: string;
  attack: string;
  heavyAttack: string;
  defend: string;
  special: string;
  hurt: string;
  victory: string;
}

export interface CpuActionPoses {
  idle: string;
  attack: string;
  defend: string;
  special: string;
  hurt: string;
}

export interface UIIconsConfig {
  logo?: string;
  attack?: string;
  heavy?: string;
  defend?: string;
  special?: string;
  jump?: string;
  moveLeft?: string;
  moveRight?: string;
}

export interface SelectionMenuTextConfig {
  headerTitle: string;
  headerSubtitle: string;
  confirmButtonText: string;
  badgeText: string;
  tipText?: string;
}

export interface CharacterTextOverride {
  name?: string;
  title?: string;
  avatar?: string;
  specialName?: string;
  description?: string;
}

export interface CustomContentConfig {
  version: string;
  // Arena & Backdrops
  arenaBackground: string;
  arenaFloorTrim?: string;
  startScreenPhoto: string;
  winUrl?: string;

  // Player Character Poses (PNG / Image URLs)
  playerPhoto: string;
  playerPoses: PlayerActionPoses;

  // CPU Opponent Poses (PNG / Image URLs)
  cpuPhoto?: string;
  cpuPoses: CpuActionPoses;

  // UI & Icons (PNG / Image URLs)
  uiIcons: UIIconsConfig;

  // Character Selection Menu Texts
  selectionMenuText: SelectionMenuTextConfig;

  // Per-character overrides (Arthur, Lyra, Roland, Ignis, CPU)
  characterOverrides?: Record<string, CharacterTextOverride>;

  customPlayerName?: string;
}

