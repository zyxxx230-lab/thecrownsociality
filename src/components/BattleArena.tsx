import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Character, CombatStats, CustomContentConfig } from '../types';
import { CPU_BOSS } from '../data/characters';
import { soundFx } from '../utils/sound';
import { DEFAULT_PLAYER_POSES, DEFAULT_CPU_POSES, DEFAULT_ARENA_BG } from '../utils/customContent';
import { getCharacterContourOutlineStyle } from '../utils/imageTransparency';
import { Shield, Zap, ChevronLeft, ChevronRight, Volume2, VolumeX, Sparkles, Swords } from 'lucide-react';

interface Props {
  playerChar: Character;
  cpuBossChar?: Character;
  onFinishBattle: (result: 'win' | 'lose', stats: CombatStats) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  customConfig: CustomContentConfig;
  onOpenCCEditor?: () => void;
}

interface FloatingText {
  id: number;
  text: string;
  x: number;
  color: string;
  isCrit?: boolean;
}

interface ShockwaveEffect {
  id: number;
  x: number;
  bottom: number;
  isSuper?: boolean;
}

interface CombatVfx {
  id: number;
  x: number;
  bottom: number;
  type: 'slash' | 'heavy_slash' | 'parry' | 'special_burst';
}

export const BattleArena: React.FC<Props> = ({
  playerChar,
  cpuBossChar,
  onFinishBattle,
  soundEnabled,
  setSoundEnabled,
  customConfig,
  onOpenCCEditor,
}) => {
  const activeCpu = cpuBossChar || CPU_BOSS;

  // Positions (0% to 100%)
  const [playerX, setPlayerX] = useState<number>(22);
  const [cpuX, setCpuX] = useState<number>(78);

  // Health & Energy
  const [playerHp, setPlayerHp] = useState<number>(playerChar.hp);
  const [cpuHp, setCpuHp] = useState<number>(activeCpu.hp);
  const [playerMana, setPlayerMana] = useState<number>(0);
  const [cpuMana, setCpuMana] = useState<number>(0);

  // Combat States
  const [playerIsBlocking, setPlayerIsBlocking] = useState<boolean>(false);
  const [cpuIsBlocking, setCpuIsBlocking] = useState<boolean>(false);
  const [playerAnim, setPlayerAnim] = useState<'idle' | 'attack' | 'heavy_attack' | 'defend' | 'hurt' | 'special' | 'death'>('idle');
  const [cpuAnim, setCpuAnim] = useState<'idle' | 'attack' | 'hurt' | 'special' | 'death'>('idle');
  const [toastMessage, setToastMessage] = useState<string>('ROUND 1... SABAS PEDANGMU!');

  // Anti-Spam Cooldown States
  const [attackUses, setAttackUses] = useState<number>(0);
  const [attackCooldown, setAttackCooldown] = useState<number>(0);
  const [defenseUses, setDefenseUses] = useState<number>(0);
  const [defenseCooldown, setDefenseCooldown] = useState<number>(0);
  const [specialCooldown, setSpecialCooldown] = useState<number>(0);

  // Medium CPU Deficiency State: CPU fatigue after 3 attacks
  const [cpuAttackUses, setCpuAttackUses] = useState<number>(0);
  const [cpuIsFatigued, setCpuIsFatigued] = useState<boolean>(false);

  // Match Timer & Floating numbers
  const [timer, setTimer] = useState<number>(99);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [combatVfxList, setCombatVfxList] = useState<CombatVfx[]>([]);

  // Winner State & Automatic 3-Second Direct Redirect Countdown
  const [winner, setWinner] = useState<'player' | 'cpu' | null>(null);
  const [victoryRedirectCountdown, setVictoryRedirectCountdown] = useState<number | null>(null);

  // Screen Shake & Heavy Hit Impact Visual Cues (Optimized for low-spec phones)
  const [lowSpecMode, setLowSpecMode] = useState<boolean>(true);
  const [screenShake, setScreenShake] = useState<'heavy' | 'super' | null>(null);
  const [impactFlashKey, setImpactFlashKey] = useState<number | null>(null);
  const [shockwaves, setShockwaves] = useState<ShockwaveEffect[]>([]);

  const shakeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const flashTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Movement button holds & Position refs
  const moveRef = useRef<'left' | 'right' | null>(null);
  const playerXRef = useRef<number>(22);
  const cpuXRef = useRef<number>(78);

  // Epic Royal Soundtrack Auto-Loop on Arena Mount
  useEffect(() => {
    if (soundEnabled) {
      soundFx.startRoyalBgm();
    }
    return () => {
      soundFx.stopRoyalBgm();
    };
  }, [soundEnabled]);

  // Combat Stats Tracking
  const statsRef = useRef<CombatStats>({
    hitsLanded: 0,
    damageDealt: 0,
    blocksSuccessful: 0,
    specialsUsed: 0,
    durationSeconds: 0,
  });

  const isGameOverRef = useRef<boolean>(false);

  // Dynamic Image Sprites for Player & CPU based on current action
  const getPlayerCurrentSprite = (): string => {
    const customPhoto = playerChar.customPhoto || customConfig.playerPhoto;
    const poses = customConfig.playerPoses;

    // When the character has a designated sprite photo (active in all roles):
    // Retain the sprite photo consistently across all actions with CSS combat VFX & animations
    if (customPhoto) {
      if (poses) {
        if (winner === 'player' && poses.victory && poses.victory !== DEFAULT_PLAYER_POSES.victory) return poses.victory;
        if ((playerAnim === 'death' || playerAnim === 'hurt') && poses.hurt && poses.hurt !== DEFAULT_PLAYER_POSES.hurt) return poses.hurt;
        if (playerAnim === 'special' && poses.special && poses.special !== DEFAULT_PLAYER_POSES.special) return poses.special;
        if (playerAnim === 'heavy_attack' && poses.heavyAttack && poses.heavyAttack !== DEFAULT_PLAYER_POSES.heavyAttack) return poses.heavyAttack;
        if (playerAnim === 'attack' && poses.attack && poses.attack !== DEFAULT_PLAYER_POSES.attack) return poses.attack;
        if ((playerIsBlocking || playerAnim === 'defend') && poses.defend && poses.defend !== DEFAULT_PLAYER_POSES.defend) return poses.defend;
      }
      return customPhoto;
    }

    const fallbackPoses = poses || DEFAULT_PLAYER_POSES;
    if (winner === 'player') return fallbackPoses.victory || DEFAULT_PLAYER_POSES.victory;
    if (playerAnim === 'death' || playerAnim === 'hurt') return fallbackPoses.hurt || DEFAULT_PLAYER_POSES.hurt;
    if (playerAnim === 'special') return fallbackPoses.special || DEFAULT_PLAYER_POSES.special;
    if (playerAnim === 'heavy_attack') return fallbackPoses.heavyAttack || DEFAULT_PLAYER_POSES.heavyAttack;
    if (playerAnim === 'attack') return fallbackPoses.attack || DEFAULT_PLAYER_POSES.attack;
    if (playerIsBlocking || playerAnim === 'defend') return fallbackPoses.defend || DEFAULT_PLAYER_POSES.defend;

    return fallbackPoses.idle || DEFAULT_PLAYER_POSES.idle;
  };

  const getCpuCurrentSprite = (): string => {
    const poses = customConfig.cpuPoses || DEFAULT_CPU_POSES;
    if (winner === 'cpu') return poses.idle || DEFAULT_CPU_POSES.idle;
    if (cpuAnim === 'death' || cpuAnim === 'hurt') return poses.hurt || DEFAULT_CPU_POSES.hurt;
    if (cpuAnim === 'special') return poses.special || DEFAULT_CPU_POSES.special;
    if (cpuAnim === 'attack') return poses.attack || DEFAULT_CPU_POSES.attack;
    if (cpuIsBlocking) return poses.defend || DEFAULT_CPU_POSES.defend;

    if (activeCpu.customPhoto && poses.idle === DEFAULT_CPU_POSES.idle) {
      return activeCpu.customPhoto;
    }
    if (poses.idle) return poses.idle;
    if (customConfig.cpuPhoto) return customConfig.cpuPhoto;
    if (activeCpu.customPhoto) return activeCpu.customPhoto;
    return DEFAULT_CPU_POSES.idle;
  };

  // Anti-Spam Cooldown Ticker Loop (runs every 100ms)
  useEffect(() => {
    const cdInterval = setInterval(() => {
      if (isGameOverRef.current) return;

      setAttackCooldown((prev) => {
        if (prev <= 0.1) {
          if (prev > 0) setAttackUses(0);
          return 0;
        }
        return Number((prev - 0.1).toFixed(1));
      });

      setDefenseCooldown((prev) => {
        if (prev <= 0.1) {
          if (prev > 0) setDefenseUses(0);
          return 0;
        }
        return Number((prev - 0.1).toFixed(1));
      });

      setSpecialCooldown((prev) => {
        if (prev <= 0.1) return 0;
        return Number((prev - 0.1).toFixed(1));
      });
    }, 100);

    return () => clearInterval(cdInterval);
  }, []);

  // Sync refs with latest state for physics & AI loops
  useEffect(() => {
    playerXRef.current = playerX;
  }, [playerX]);

  useEffect(() => {
    cpuXRef.current = cpuX;
  }, [cpuX]);

  // Keep player defense state synced with animation when not in other high priority states
  useEffect(() => {
    if (isGameOverRef.current) return;
    if (playerIsBlocking) {
      if (playerAnim !== 'hurt' && playerAnim !== 'death') {
        setPlayerAnim('defend');
      }
    } else if (playerAnim === 'defend') {
      setPlayerAnim('idle');
    }
  }, [playerIsBlocking, playerAnim]);

  // Haptic feedback helper
  const vibrate = (pattern: number | number[] = 30) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {}
    }
  };

  // Combat VFX generator - limit to 2 simultaneous items to prevent crowding and lag
  const triggerVfx = (x: number, bottom: number, type: 'slash' | 'heavy_slash' | 'parry' | 'special_burst') => {
    const id = Date.now() + Math.random();
    setCombatVfxList((prev) => [...prev.slice(-1), { id, x, bottom, type }]);
    setTimeout(() => {
      setCombatVfxList((prev) => prev.filter((vfx) => vfx.id !== id));
    }, 300);
  };

  // Heavy attack impact visual cues - lightweight for low-spec phones
  const triggerHeavyImpact = useCallback((hitX: number, hitBottom: number, isSuper = false) => {
    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);

    vibrate(isSuper ? [40, 20, 60] : [30, 20]);

    if (!lowSpecMode) {
      const id = Date.now() + Math.random();
      setShockwaves((prev) => [...prev.slice(-1), { id, x: hitX, bottom: hitBottom, isSuper }]);
      setImpactFlashKey(id);
      setScreenShake(isSuper ? 'super' : 'heavy');

      flashTimeoutRef.current = setTimeout(() => {
        setImpactFlashKey(null);
      }, 160);

      const duration = isSuper ? 320 : 220;
      shakeTimeoutRef.current = setTimeout(() => {
        setScreenShake(null);
        setShockwaves((prev) => prev.filter((sw) => sw.id !== id));
      }, duration);
    }
  }, [lowSpecMode]);

  // Floating combat text - limit to 2 simultaneous items to prevent screen crowding
  const spawnFloatingText = (text: string, xPos: number, color: string = '#facc15', isCrit = false) => {
    const id = Date.now() + Math.random();
    setFloatingTexts((prev) => [...prev.slice(-1), { id, text, x: xPos, color, isCrit }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 550);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const distance = Math.abs(cpuX - playerX);
  const ATTACK_RANGE = 20;

  // Movement
  const handlePlayerMove = useCallback((dir: 'left' | 'right') => {
    if (isGameOverRef.current) return;
    const step = playerChar.speed * 0.38;

    setPlayerX((prev) => {
      const currentCpuX = cpuXRef.current;
      let nextX = dir === 'left' ? prev - step : prev + step;
      nextX = Math.max(5, Math.min(92, nextX));

      if (prev < currentCpuX) {
        return Math.min(currentCpuX - 9, nextX);
      } else if (prev > currentCpuX) {
        return Math.max(currentCpuX + 9, nextX);
      }

      return nextX;
    });
  }, [playerChar.speed]);

  // Block Start
  const handleStartBlock = useCallback(() => {
    if (isGameOverRef.current) return;

    if (defenseCooldown > 0) {
      soundFx.playMiss();
      showToast(`🛡️ COOLDOWN TANGKIS (${defenseCooldown.toFixed(1)}s)!`);
      spawnFloatingText('CD Tangkis!', playerXRef.current, '#38bdf8');
      return;
    }

    setPlayerIsBlocking(true);
    setPlayerAnim('defend');
    setDefenseUses((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        setPlayerIsBlocking(false);
        setPlayerAnim('idle');
        setDefenseCooldown(2.0);
        showToast('🛡️ PERISAI RETAK! COOLDOWN TANGKIS 2 DETIK!');
        spawnFloatingText('CD Tangkis 2s!', playerXRef.current, '#38bdf8', true);
        return 3;
      }
      return next;
    });
  }, [defenseCooldown]);

  const handleStopBlock = useCallback(() => {
    setPlayerIsBlocking(false);
    if (playerAnim === 'defend') {
      setPlayerAnim('idle');
    }
  }, [playerAnim]);

  // Player Quick Attack (Dynamic image switch to attack sprite)
  const handlePlayerAttack = useCallback(() => {
    if (isGameOverRef.current) return;

    if (attackCooldown > 0) {
      soundFx.playMiss();
      showToast(`⏳ COOLDOWN SERANGAN (${attackCooldown.toFixed(1)}s)!`);
      spawnFloatingText('CD Serangan!', playerXRef.current, '#f87171');
      return;
    }

    setAttackUses((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        setAttackCooldown(2.0);
        showToast('⏳ STAMINA HABIS! COOLDOWN SERANGAN 2 DETIK!');
        spawnFloatingText('CD Serang 2s!', playerXRef.current, '#ef4444', true);
        return 3;
      }
      return next;
    });

    // Dynamic Attack Pose Image
    setPlayerAnim('attack');
    setTimeout(() => {
      setPlayerAnim(playerIsBlocking ? 'defend' : 'idle');
    }, 280);

    const currentCpuX = cpuXRef.current;
    const currentPlayerX = playerXRef.current;
    const currentDist = Math.abs(currentCpuX - currentPlayerX);
    const isCpuOnRight = currentCpuX >= currentPlayerX;

    if (currentDist > ATTACK_RANGE) {
      soundFx.playMiss();
      showToast('SABETAN MELESET! DEKATI MUSUH [➡️]');
      spawnFloatingText('MISS (Jauh!)', currentPlayerX + (isCpuOnRight ? 8 : -8), '#94a3b8');
      return;
    }

    // BOT AVOIDANCE: RETREATING OR DEFENDING
    if (!cpuIsFatigued && Math.random() < 0.40) {
      const avoidMode = Math.random() < 0.5 ? 'retreat' : 'defend';
      if (avoidMode === 'retreat') {
        const retreatDir = isCpuOnRight ? 1 : -1;
        const newCpuX = Math.max(8, Math.min(92, currentCpuX + retreatDir * 16));
        setCpuX(newCpuX);
        cpuXRef.current = newCpuX;
        soundFx.playMiss();
        showToast('💨 CPU MUNDUR MENGHINDARI SABETAN!');
        spawnFloatingText('RETREAT! 💨', currentCpuX, '#c084fc', true);
        return;
      } else {
        setCpuIsBlocking(true);
        setTimeout(() => setCpuIsBlocking(false), 550);
        showToast('🛡️ CPU TANGKIS PEDANG DENGAN PERISAI!');
        spawnFloatingText('DEFEND! 🛡️', currentCpuX, '#a855f7', true);
      }
    }

    vibrate(35);

    const hitBottom = 55;
    if (cpuIsBlocking && !cpuIsFatigued) {
      const reducedDmg = Math.max(3, Math.ceil(playerChar.attackDmg * 0.35));
      setCpuHp((prev) => Math.max(0, prev - reducedDmg));
      soundFx.playSwordParry();
      triggerVfx(currentCpuX, hitBottom, 'parry');
      showToast(`⚔️ DITANGKIS PARRY CPU! (-${reducedDmg})`);
      spawnFloatingText(`🛡️ PARRY! -${reducedDmg}`, currentCpuX, '#38bdf8');
      statsRef.current.damageDealt += reducedDmg;
    } else {
      const dmg = playerChar.attackDmg;
      setCpuHp((prev) => Math.max(0, prev - dmg));
      setCpuAnim('hurt');
      setTimeout(() => setCpuAnim('idle'), 250);
      soundFx.playSwordAttack();
      triggerVfx(currentCpuX, hitBottom, 'slash');
      showToast(cpuIsFatigued ? `💥 HANTAMAN TELAK SAAT CPU LELEH! -${dmg}` : `⚔️ SABETAN PEDANG TELAK! -${dmg}`);
      spawnFloatingText(`⚔️ -${dmg}`, currentCpuX, '#ff0033', true);

      statsRef.current.hitsLanded += 1;
      statsRef.current.damageDealt += dmg;
      setPlayerMana((prev) => Math.min(100, prev + 20));
    }
  }, [attackCooldown, playerChar.attackDmg, cpuIsBlocking, cpuIsFatigued, playerIsBlocking]);

  // Player Heavy Attack (Dynamic image switch to heavyAttack sprite)
  const handlePlayerHeavyAttack = useCallback(() => {
    if (isGameOverRef.current) return;

    if (attackCooldown > 0) {
      soundFx.playMiss();
      showToast(`⏳ COOLDOWN SERANGAN (${attackCooldown.toFixed(1)}s)!`);
      spawnFloatingText('CD Serangan!', playerXRef.current, '#f87171');
      return;
    }

    setAttackUses((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        setAttackCooldown(2.0);
        showToast('⏳ STAMINA HABIS! COOLDOWN SERANGAN 2 DETIK!');
        spawnFloatingText('CD Serang 2s!', playerXRef.current, '#ef4444', true);
        return 3;
      }
      return next;
    });

    // Dynamic Heavy Attack Pose Image
    setPlayerAnim('heavy_attack');
    setTimeout(() => {
      setPlayerAnim(playerIsBlocking ? 'defend' : 'idle');
    }, 350);

    const currentCpuX = cpuXRef.current;
    const currentPlayerX = playerXRef.current;
    const currentDist = Math.abs(currentCpuX - currentPlayerX);
    const isCpuOnRight = currentCpuX >= currentPlayerX;

    if (currentDist > ATTACK_RANGE) {
      soundFx.playMiss();
      showToast('TEBASAN BERAT MELESET! BUTUH JARAK DEKAT');
      spawnFloatingText('MISS (Jauh!)', currentPlayerX + (isCpuOnRight ? 8 : -8), '#94a3b8');
      return;
    }

    // BOT AVOIDANCE: RETREATING OR DEFENDING
    if (!cpuIsFatigued && Math.random() < 0.42) {
      const avoidMode = Math.random() < 0.5 ? 'retreat' : 'defend';
      if (avoidMode === 'retreat') {
        const retreatDir = isCpuOnRight ? 1 : -1;
        const newCpuX = Math.max(8, Math.min(92, currentCpuX + retreatDir * 17));
        setCpuX(newCpuX);
        cpuXRef.current = newCpuX;
        soundFx.playMiss();
        showToast('💨 CPU MUNDUR MENGHINDARI TEBASAN BERAT!');
        spawnFloatingText('RETREAT! 💨', currentCpuX, '#c084fc', true);
        return;
      } else {
        setCpuIsBlocking(true);
        setTimeout(() => setCpuIsBlocking(false), 600);
        showToast('🛡️ CPU TANGKIS TEBASAN BERAT DENGAN PERISAI!');
        spawnFloatingText('DEFEND! 🛡️', currentCpuX, '#a855f7', true);
      }
    }

    const contactX = (currentPlayerX + currentCpuX) / 2;
    const contactBottom = 60;
    triggerHeavyImpact(contactX, contactBottom, false);
    triggerVfx(currentCpuX, contactBottom, 'heavy_slash');

    if (cpuIsBlocking && !cpuIsFatigued) {
      const heavyBlocked = Math.max(6, Math.ceil(playerChar.attackDmg * 0.55));
      setCpuHp((prev) => Math.max(0, prev - heavyBlocked));
      soundFx.playSwordParry();
      showToast(`⚔️ HANTAMAN MENEMBUS PARRY CPU! (-${heavyBlocked})`);
      spawnFloatingText(`🛡️ SMASH! -${heavyBlocked}`, currentCpuX, '#38bdf8', true);
      statsRef.current.damageDealt += heavyBlocked;
      setPlayerMana((prev) => Math.min(100, prev + 15));
    } else {
      const heavyDmg = Math.round(playerChar.attackDmg * 1.55);
      setCpuHp((prev) => Math.max(0, prev - heavyDmg));
      setCpuAnim('hurt');
      setTimeout(() => setCpuAnim('idle'), 320);
      soundFx.playLouderSwordAttack();
      showToast(`💥 TEBASAN PEDANG BERAT KENA TELAK! -${heavyDmg}`);
      spawnFloatingText(`💥 HEAVY HIT! -${heavyDmg}`, currentCpuX, '#ff0033', true);

      statsRef.current.hitsLanded += 1;
      statsRef.current.damageDealt += heavyDmg;
      setPlayerMana((prev) => Math.min(100, prev + 32));
    }
  }, [attackCooldown, playerChar.attackDmg, cpuIsBlocking, cpuIsFatigued, playerIsBlocking, triggerHeavyImpact]);

  // Player Special Skill (Dynamic image switch to special sprite)
  const handlePlayerSpecial = useCallback(() => {
    if (isGameOverRef.current || playerMana < 100) return;

    if (specialCooldown > 0) {
      soundFx.playMiss();
      showToast(`⚡ COOLDOWN JURUS (${specialCooldown.toFixed(1)}s)!`);
      spawnFloatingText('CD Jurus!', playerXRef.current, '#fbbf24');
      return;
    }

    const currentCpuX = cpuXRef.current;
    const currentPlayerX = playerXRef.current;
    const currentDist = Math.abs(currentCpuX - currentPlayerX);
    const isCpuOnRight = currentCpuX >= currentPlayerX;

    if (currentDist > ATTACK_RANGE + 6) {
      showToast('JURUS BUTUH JARAK LEBIH DEKAT!');
      spawnFloatingText('Luar Jangkauan!', currentPlayerX + (isCpuOnRight ? 10 : -10), '#94a3b8');
      return;
    }

    // BOT AVOIDANCE: RETREATING OR DEFENDING
    if (!cpuIsFatigued && Math.random() < 0.35) {
      const avoidMode = Math.random() < 0.5 ? 'retreat' : 'defend';
      if (avoidMode === 'retreat') {
        const retreatDir = isCpuOnRight ? 1 : -1;
        const newCpuX = Math.max(8, Math.min(92, currentCpuX + retreatDir * 18));
        setCpuX(newCpuX);
        cpuXRef.current = newCpuX;
        soundFx.playMiss();
        showToast('💨 CPU MUNDUR MENGHINDARI JURUS!');
        spawnFloatingText('RETREAT! 💨', currentCpuX, '#c084fc', true);
        return;
      } else {
        setCpuIsBlocking(true);
        setTimeout(() => setCpuIsBlocking(false), 650);
        showToast('🛡️ CPU TANGKIS SEBAGIAN JURUS!');
        spawnFloatingText('DEFEND! 🛡️', currentCpuX, '#a855f7', true);
      }
    }

    // Set 5-second cooldown & Switch to Special Pose Image
    setSpecialCooldown(5.0);
    setPlayerMana(0);
    statsRef.current.specialsUsed += 1;

    setPlayerAnim('special');
    setTimeout(() => {
      setPlayerAnim(playerIsBlocking ? 'defend' : 'idle');
    }, 550);

    soundFx.playSpecial();
    showToast(`💥 ${playerChar.specialName.toUpperCase()}! (COOLDOWN 5 DETIK)`);

    const contactX = (currentPlayerX + currentCpuX) / 2;
    const contactBottom = 65;
    triggerHeavyImpact(contactX, contactBottom, true);
    triggerVfx(currentCpuX, contactBottom, 'special_burst');

    const dmg = playerChar.specialDmg;
    const finalDmg = (cpuIsBlocking && !cpuIsFatigued) ? Math.ceil(dmg * 0.5) : dmg;
    setCpuHp((prev) => Math.max(0, prev - finalDmg));
    setCpuAnim('hurt');
    setTimeout(() => setCpuAnim('idle'), 350);

    spawnFloatingText(`⚡ CRIT SPECIAL! -${finalDmg}`, currentCpuX, '#ff0033', true);
    statsRef.current.damageDealt += finalDmg;
    statsRef.current.hitsLanded += 1;
  }, [playerMana, specialCooldown, playerChar.specialDmg, playerChar.specialName, cpuIsBlocking, cpuIsFatigued, playerIsBlocking, triggerHeavyImpact]);

  // Continuous movement loop
  useEffect(() => {
    const moveTimer = setInterval(() => {
      if (moveRef.current && !isGameOverRef.current) {
        handlePlayerMove(moveRef.current);
      }
    }, 50);
    return () => clearInterval(moveTimer);
  }, [handlePlayerMove]);

  // CPU AI Engine: Tactical movement, dynamic retreat & defend
  useEffect(() => {
    const cpuLoop = setInterval(() => {
      if (isGameOverRef.current) return;

      const currentCpuX = cpuXRef.current;
      const currentPlayerX = playerXRef.current;
      const currentDist = Math.abs(currentCpuX - currentPlayerX);
      const cpuSpeed = activeCpu.speed * 0.32;
      const isCpuOnRight = currentCpuX >= currentPlayerX;

      if (cpuIsFatigued) {
        setCpuIsBlocking(false);
        setCpuX((prev) => {
          if (isCpuOnRight) return Math.min(92, prev + cpuSpeed * 0.7);
          return Math.max(8, prev - cpuSpeed * 0.7);
        });
        return;
      }

      // Tactical spacing: if dangerously close, bot occasionally retreats to avoid incoming combo
      if (currentDist < 14 && Math.random() < 0.28) {
        const retreatDir = isCpuOnRight ? 1 : -1;
        setCpuX((prev) => Math.max(8, Math.min(92, prev + retreatDir * cpuSpeed * 1.6)));
        showToast('💨 CPU MUNDUR MENJAGA JARAK!');
        return;
      }

      if (currentDist > ATTACK_RANGE) {
        setCpuX((prev) => {
          let nextX: number;
          if (isCpuOnRight) {
            nextX = Math.max(currentPlayerX + 9, prev - cpuSpeed);
          } else {
            nextX = Math.min(currentPlayerX - 9, prev + cpuSpeed);
          }
          return Math.max(8, Math.min(92, nextX));
        });
        setCpuIsBlocking(false);
      } else {
        const roll = Math.random();

        // 30% chance bot holds defend guard
        if (roll < 0.30) {
          setCpuIsBlocking(true);
        } else if (cpuMana >= 100) {
          setCpuMana(0);
          setCpuAnim('special');
          setTimeout(() => setCpuAnim('idle'), 450);
          soundFx.playSpecial();

          showToast(`💀 JURUS ${activeCpu.specialName.toUpperCase()}!`);
          const contactX = (currentPlayerX + currentCpuX) / 2;
          const contactBottom = 65;
          triggerHeavyImpact(contactX, contactBottom, true);
          triggerVfx(currentPlayerX, contactBottom, 'special_burst');

          const baseDmg = activeCpu.specialDmg;
          if (playerIsBlocking) {
            soundFx.playSwordParry();
            triggerVfx(currentPlayerX, contactBottom, 'parry');
            const blockedDmg = Math.ceil(baseDmg * (1 - playerChar.defense));
            setPlayerHp((prev) => Math.max(0, prev - blockedDmg));
            spawnFloatingText(`🛡️ PARRY! -${blockedDmg}`, currentPlayerX, '#38bdf8');
            statsRef.current.blocksSuccessful += 1;
          } else {
            setPlayerHp((prev) => Math.max(0, prev - baseDmg));
            setPlayerAnim('hurt');
            setTimeout(() => setPlayerAnim(playerIsBlocking ? 'defend' : 'idle'), 300);
            spawnFloatingText(`💀 CRIT -${baseDmg}!`, currentPlayerX, '#9333ea', true);
          }
        } else if (roll < 0.70) {
          const isHeavyAttack = Math.random() < 0.28;

          setCpuIsBlocking(false);
          setCpuAnim('attack');
          setTimeout(() => setCpuAnim('idle'), isHeavyAttack ? 300 : 220);

          setCpuAttackUses((prev) => {
            const next = prev + 1;
            if (next >= 3) {
              setCpuIsFatigued(true);
              setTimeout(() => {
                setCpuIsFatigued(false);
                setCpuAttackUses(0);
              }, 2000);
              showToast('💨 CPU KELELAHAN! (CELAH SERANGAN TERBUKA)');
              spawnFloatingText('CPU Lelah! 💨', currentCpuX, '#facc15');
              return 3;
            }
            return next;
          });

          const contactBottom = 55;

          if (isHeavyAttack) {
            const contactX = (currentPlayerX + currentCpuX) / 2;
            triggerHeavyImpact(contactX, contactBottom, false);

            if (playerIsBlocking) {
              soundFx.playSwordParry();
              triggerVfx(currentPlayerX, contactBottom, 'parry');
              const blockedDmg = Math.max(5, Math.ceil(activeCpu.attackDmg * 1.35 * (1 - playerChar.defense)));
              setPlayerHp((prev) => Math.max(0, prev - blockedDmg));
              showToast(`⚔️ PARRY! DENTINGAN PEDANG MENAHAN SERANGAN CPU! (-${blockedDmg})`);
              spawnFloatingText(`🛡️ PARRY! -${blockedDmg}`, currentPlayerX, '#38bdf8', true);
              statsRef.current.blocksSuccessful += 1;
            } else {
              const heavyDmg = Math.round(activeCpu.attackDmg * 1.38);
              setPlayerHp((prev) => Math.max(0, prev - heavyDmg));
              setPlayerAnim('hurt');
              setTimeout(() => setPlayerAnim(playerIsBlocking ? 'defend' : 'idle'), 300);
              soundFx.playLouderSwordAttack();
              triggerVfx(currentPlayerX, contactBottom, 'heavy_slash');
              showToast(`💀 CPU MENGHANTAM PEDANG BERAT! -${heavyDmg}`);
              spawnFloatingText(`💥 HEAVY HIT! -${heavyDmg}`, currentPlayerX, '#9333ea', true);
              setCpuMana((prev) => Math.min(100, prev + 25));
            }
          } else {
            if (playerIsBlocking) {
              soundFx.playSwordParry();
              triggerVfx(currentPlayerX, contactBottom, 'parry');
              const blockedDmg = Math.max(3, Math.ceil(activeCpu.attackDmg * (1 - playerChar.defense)));
              setPlayerHp((prev) => Math.max(0, prev - blockedDmg));
              showToast(`⚔️ PARRY! TANGKIS SABETAN PEDANG CPU! (-${blockedDmg})`);
              spawnFloatingText(`🛡️ PARRY! -${blockedDmg}`, currentPlayerX, '#38bdf8');
              statsRef.current.blocksSuccessful += 1;
            } else {
              const dmg = activeCpu.attackDmg;
              setPlayerHp((prev) => Math.max(0, prev - dmg));
              setPlayerAnim('hurt');
              setTimeout(() => setPlayerAnim(playerIsBlocking ? 'defend' : 'idle'), 250);
              soundFx.playSwordAttack();
              triggerVfx(currentPlayerX, contactBottom, 'slash');
              showToast(`CPU MENYABETMU! -${dmg}`);
              spawnFloatingText(`⚔️ -${dmg}`, currentPlayerX, '#9333ea');
              vibrate(40);
              setCpuMana((prev) => Math.min(100, prev + 18));
            }
          }
        } else {
          setCpuX((prev) => {
            if (isCpuOnRight) {
              return Math.min(92, prev + cpuSpeed * 1.2);
            } else {
              return Math.max(8, prev - cpuSpeed * 1.2);
            }
          });
          setCpuIsBlocking(false);
        }
      }
    }, 620);

    return () => clearInterval(cpuLoop);
  }, [playerIsBlocking, cpuMana, cpuIsFatigued, playerChar.defense, activeCpu, triggerHeavyImpact]);

  // Match countdown timer
  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (isGameOverRef.current) return;
      setTimer((prev) => {
        if (prev <= 1) return 0;
        statsRef.current.durationSeconds += 1;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  // Check victory / defeat:
  // REQUIREMENT: "After winning, the player immediately enters the link with a 3 second delay without any menu display."
  useEffect(() => {
    if (isGameOverRef.current) return;

    const executeWinRedirect = () => {
      isGameOverRef.current = true;
      setWinner('player');
      setCpuAnim('death');
      soundFx.playEnemyDeath();
      setTimeout(() => soundFx.playVictory(), 550);
      setVictoryRedirectCountdown(3);
      showToast('🏆 K.O.! VICTORY! MENUJU LINK DALAM 3 DETIK...');

      const targetLink = customConfig.winUrl || 'https://forms.gle/cTiWvirxKgVkKB7D9';

      let remainingSeconds = 3;
      const redirectInterval = setInterval(() => {
        remainingSeconds -= 1;
        if (remainingSeconds <= 0) {
          clearInterval(redirectInterval);
          try {
            window.location.href = targetLink;
          } catch {
            window.open(targetLink, '_self');
          }
        } else {
          setVictoryRedirectCountdown(remainingSeconds);
        }
      }, 1000);
    };

    if (cpuHp <= 0) {
      executeWinRedirect();
    } else if (playerHp <= 0 || timer === 0) {
      isGameOverRef.current = true;
      const isPlayerWin = playerHp > cpuHp;

      if (isPlayerWin) {
        executeWinRedirect();
      } else {
        // Player loses: show death anim, play player death sound, and return to initial start screen
        setWinner('cpu');
        setPlayerAnim('death');
        soundFx.playPlayerDeath();
        showToast('💀 DEFEAT! KAMU KALAH - KEMBALI KE MENU UTAMA...');
        setTimeout(() => {
          onFinishBattle('lose', statsRef.current);
        }, 1500);
      }
    }
  }, [playerHp, cpuHp, timer, customConfig.winUrl, onFinishBattle]);

  // Keyboard controls for desktop test
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') moveRef.current = 'left';
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') moveRef.current = 'right';
      if (e.key.toLowerCase() === 'j' || e.key === ' ') handlePlayerAttack();
      if (e.key.toLowerCase() === 'u' || e.key.toLowerCase() === 'i') handlePlayerHeavyAttack();
      if (e.key.toLowerCase() === 'k') handleStartBlock();
      if (e.key.toLowerCase() === 'l') handlePlayerSpecial();
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if ((e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') && moveRef.current === 'left') {
        moveRef.current = null;
      }
      if ((e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') && moveRef.current === 'right') {
        moveRef.current = null;
      }
      if (e.key.toLowerCase() === 'k') handleStopBlock();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [handlePlayerAttack, handlePlayerHeavyAttack, handlePlayerSpecial, handleStartBlock, handleStopBlock]);

  const p1HpPercent = Math.max(0, (playerHp / playerChar.hp) * 100);
  const cpuHpPercent = Math.max(0, (cpuHp / activeCpu.hp) * 100);

  const isPlayerFacingRight = playerX <= cpuX;
  const isCpuFacingRight = playerX > cpuX;

  const playerSpriteUrl = getPlayerCurrentSprite();
  const cpuSpriteUrl = getCpuCurrentSprite();

  return (
    <div
      className={`flex flex-col w-full max-w-4xl mx-auto select-none bg-neutral-950 overflow-hidden rounded-3xl border-2 border-neutral-800 shadow-2xl relative transition-transform ${
        screenShake === 'heavy' ? 'animate-screen-shake-heavy' : ''
      } ${screenShake === 'super' ? 'animate-screen-shake-super' : ''}`}
    >
      {/* Heavy Attack Impact Screen Flash Overlay */}
      {impactFlashKey !== null && (
        <div
          key={`flash-${impactFlashKey}`}
          className={`absolute inset-0 pointer-events-none z-40 animate-impact-flash ${
            screenShake === 'super' ? 'bg-amber-400/35' : 'bg-red-500/25'
          }`}
        />
      )}

      {/* ================= 16:9 CINEMATIC BATTLE ARENA ================= */}
      <div className="relative w-full aspect-[16/9] bg-gradient-to-b from-neutral-950 via-slate-900 to-neutral-950 overflow-hidden flex flex-col justify-between border-b border-neutral-800 shadow-inner">
        
        {/* Battle Arena Background Photo (Demon King Castle / Blood Moon by default or Custom) */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src={customConfig.arenaBackground || DEFAULT_ARENA_BG}
            alt="Demon King Castle Battle Arena"
            className="w-full h-full object-cover opacity-90 transition-opacity duration-300"
            referrerPolicy="no-referrer"
          />
          {/* Ambient Lighting & Vignette for Visual Contrast & Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-transparent to-neutral-950/65 pointer-events-none" />
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/35 pointer-events-none" />
        </div>

        {/* ================= TOP HUD: HEALTH & TIMER ================= */}
        <header className="bg-neutral-950/90 backdrop-blur-sm border-b border-neutral-800/80 px-2 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 z-20">
          {/* Player 1 HUD with Transparent Photo Avatar */}
          <div className="flex-1 flex items-center gap-1.5 sm:gap-2">
            <div className="w-8 h-9 sm:w-10 sm:h-11 bg-transparent flex items-center justify-center shrink-0 select-none pointer-events-none">
              {playerChar.customPhoto || (playerChar.avatar?.startsWith('data:') || playerChar.avatar?.startsWith('http')) ? (
                <img
                  src={playerChar.customPhoto || playerChar.avatar}
                  alt={playerChar.name}
                  className="w-full h-full object-contain"
                  style={getCharacterContourOutlineStyle(playerChar.accentColor || '#facc15', 1.8)}
                />
              ) : (
                <span className="text-xl sm:text-2xl drop-shadow">{playerChar.avatar}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold mb-1">
                <span className="text-amber-400 flex items-center gap-1 min-w-0">
                  <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-[9px] font-mono">P1</span>
                  <span className="truncate max-w-[85px] sm:max-w-none">{playerChar.name}</span>
                </span>
                <span className="text-emerald-400 font-mono text-[10px] sm:text-xs shrink-0">{Math.ceil(playerHp)}/{playerChar.hp}</span>
              </div>
              {/* HP Bar */}
              <div className="w-full h-2.5 sm:h-3.5 bg-neutral-900 rounded-full overflow-hidden p-0.5 border border-neutral-700/80 mb-1">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-300 rounded-full transition-all duration-150 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                  style={{ width: `${p1HpPercent}%` }}
                />
              </div>
              {/* Mana Bar */}
              <div className="w-full h-1.5 sm:h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-150"
                  style={{ width: `${playerMana}%` }}
                />
              </div>
            </div>
          </div>

          {/* Center: Timer & Distance Indicator */}
          <div className="flex flex-col items-center justify-center px-1 min-w-[50px] sm:min-w-[64px] shrink-0">
            <div className="text-lg sm:text-2xl font-black font-mono text-amber-400 leading-none drop-shadow">
              {timer}
            </div>
            <div
              className={`text-[8px] sm:text-[9px] font-bold px-1.5 py-0.2 rounded-full border mt-0.5 transition-colors ${
                distance <= ATTACK_RANGE
                  ? 'bg-red-950/90 text-red-300 border-red-600 animate-pulse'
                  : 'bg-neutral-900 text-cyan-300 border-neutral-700'
              }`}
            >
              {distance <= ATTACK_RANGE ? 'JARAK DEKAT' : `${Math.round(distance)}%`}
            </div>
          </div>

          {/* CPU HUD with Transparent Photo Avatar */}
          <div className="flex-1 flex items-center gap-1.5 sm:gap-2 flex-row-reverse text-right">
            <div className="w-8 h-9 sm:w-10 sm:h-11 bg-transparent flex items-center justify-center shrink-0 select-none pointer-events-none">
              {activeCpu.customPhoto || (activeCpu.avatar?.startsWith('data:') || activeCpu.avatar?.startsWith('http')) ? (
                <img
                  src={activeCpu.customPhoto || activeCpu.avatar}
                  alt={activeCpu.name}
                  className="w-full h-full object-contain"
                  style={getCharacterContourOutlineStyle(activeCpu.accentColor || '#a855f7', 1.8)}
                />
              ) : (
                <span className="text-xl sm:text-2xl drop-shadow">{activeCpu.avatar}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold mb-1">
                <span className="text-red-400 font-mono text-[10px] sm:text-xs shrink-0">{Math.ceil(cpuHp)}/{activeCpu.hp}</span>
                <span className="text-red-400 flex items-center gap-1 min-w-0 justify-end">
                  <span className="truncate max-w-[85px] sm:max-w-none">{activeCpu.name}</span>
                  <span className="px-1.5 py-0.2 bg-red-950 border border-red-800 rounded text-[9px] font-mono text-red-300">DEMON KING</span>
                </span>
              </div>
              {/* HP Bar */}
              <div className="w-full h-2.5 sm:h-3.5 bg-neutral-900 rounded-full overflow-hidden p-0.5 border border-neutral-700/80 mb-1">
                <div
                  className="h-full bg-gradient-to-l from-red-600 via-rose-500 to-red-400 rounded-full transition-all duration-150 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                  style={{ width: `${cpuHpPercent}%` }}
                />
              </div>
              {/* Mana Bar */}
              <div className="w-full h-1.5 sm:h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                <div
                  className="h-full bg-gradient-to-l from-purple-500 to-fuchsia-400 transition-all duration-150"
                  style={{ width: `${cpuMana}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Combat Toast Message */}
        <div className="absolute top-13 left-1/2 -translate-x-1/2 z-25 pointer-events-none w-max max-w-[90%]">
          <div className="px-3.5 py-1 bg-black/80 backdrop-blur-sm border border-amber-500/50 rounded-full text-[10px] sm:text-xs font-black text-amber-300 shadow-xl tracking-wide uppercase truncate text-center">
            {toastMessage}
          </div>
        </div>

        {/* Top Quick Actions (Sound, Low-Spec Mode & Edit PNG) */}
        <div className="absolute top-13 right-3 z-25 flex items-center gap-1.5">
          <button
            onClick={() => setLowSpecMode(!lowSpecMode)}
            className={`px-2 py-1 rounded-xl border text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer backdrop-blur-xs ${
              lowSpecMode
                ? 'bg-emerald-950/85 border-emerald-500/70 text-emerald-300'
                : 'bg-neutral-900/80 border-neutral-700 text-neutral-400'
            }`}
            title="Mode Ringan Efek (Anti-Lag Spek Rendah)"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${lowSpecMode ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'}`} />
            <span className="hidden sm:inline">{lowSpecMode ? 'Mode Ringan' : 'Efek Penuh'}</span>
            <span className="sm:hidden">{lowSpecMode ? 'Ringan' : 'Penuh'}</span>
          </button>

          <button
            onClick={() => {
              const next = !soundEnabled;
              soundFx.enabled = next;
              setSoundEnabled(next);
              if (next) {
                soundFx.startRoyalBgm();
              } else {
                soundFx.stopRoyalBgm();
              }
            }}
            className="p-1.5 sm:p-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:text-white transition-all cursor-pointer"
            title="Toggle Suara & Musik Kerajaan"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-500" />}
          </button>
        </div>

        {/* ================= VICTORY 3-SECOND DIRECT REDIRECT OVERLAY ================= */}
        {winner === 'player' && (
          <div className="absolute inset-0 z-45 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-3 animate-in fade-in duration-200 pointer-events-none">
            <div className="p-5 sm:p-7 rounded-3xl bg-neutral-950/95 border-3 border-amber-400 shadow-[0_0_60px_rgba(251,191,36,0.9)] flex flex-col items-center text-center max-w-sm sm:max-w-md animate-in zoom-in-95 duration-200">
              <div className="text-4xl sm:text-5xl animate-bounce mb-1">👑</div>
              <h2 className="text-2xl sm:text-3xl font-black font-serif text-amber-300 tracking-wider">
                VICTORY! K.O.
              </h2>
              <p className="text-xs sm:text-sm font-bold text-neutral-200 mt-1 mb-3">
                {playerChar.name} MERAIH KEMENANGAN MUTLAK!
              </p>

              {/* Direct 3-second countdown indicator */}
              <div className="px-4 py-2.5 rounded-2xl bg-amber-500/20 border-2 border-amber-400/80 text-amber-300 font-mono font-black text-xs sm:text-sm animate-pulse flex items-center gap-2.5 shadow-lg">
                <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
                <span>MENGALIHKAN KE LINK DALAM:</span>
                <span className="text-xl sm:text-2xl text-neutral-950 font-black bg-gradient-to-r from-amber-400 to-yellow-300 px-3 py-0.5 rounded-xl shadow-inner">
                  {victoryRedirectCountdown ?? 3}s
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Combat Visual Effects (Deep Neon Red for Player, Deep Purple for CPU) */}
        {combatVfxList.map((vfx) => (
          <div
            key={vfx.id}
            className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{ left: `${vfx.x}%`, bottom: `${vfx.bottom}px` }}
          >
            {vfx.type === 'slash' && (
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 animate-sword-slash">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_18px_rgba(255,0,51,1)]">
                  <path d="M 10 90 Q 50 40 90 10 Q 50 60 10 90" fill="#ff0033" />
                </svg>
              </div>
            )}
            {vfx.type === 'heavy_slash' && (
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 animate-sword-slash scale-125">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_24px_rgba(255,0,51,1)]">
                  <path d="M 15 85 Q 50 30 85 15 Q 40 65 15 85" fill="#ff1744" />
                </svg>
              </div>
            )}
            {vfx.type === 'parry' && (
              <div className="relative w-18 h-18 sm:w-22 sm:h-22 animate-parry-sparks">
                <div className="absolute inset-0 rounded-full border-4 border-[#ff0033] shadow-[0_0_25px_rgba(255,0,51,1)]" />
                <span className="text-2xl sm:text-3xl select-none">⚔️</span>
              </div>
            )}
            {vfx.type === 'special_burst' && (
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 animate-shockwave rounded-full border-4 border-[#ff0033] shadow-[0_0_35px_rgba(255,0,51,1)] flex items-center justify-center">
                <span className="text-3xl animate-spin text-[#ff0033]">⚡</span>
              </div>
            )}
          </div>
        ))}

        {/* Heavy Attack Shockwaves */}
        {shockwaves.map((sw) => (
          <div
            key={sw.id}
            className={`absolute z-35 pointer-events-none rounded-full border-4 shadow-lg animate-shockwave w-24 h-24 sm:w-32 sm:h-32 -translate-x-1/2 ${
              sw.isSuper
                ? 'border-[#ff0033] shadow-[0_0_35px_rgba(255,0,51,1)]'
                : 'border-[#ff1744] shadow-[0_0_25px_rgba(255,23,68,0.9)]'
            }`}
            style={{
              left: `${sw.x}%`,
              bottom: `${sw.bottom}px`,
            }}
          />
        ))}

        {/* Floating Numbers & Hit texts */}
        {floatingTexts.map((ft) => (
          <div
            key={ft.id}
            className={`absolute bottom-24 sm:bottom-28 z-30 font-black pointer-events-none transition-all duration-500 -translate-y-6 ${
              ft.isCrit ? 'text-base sm:text-lg drop-shadow-[0_0_12px_rgba(255,0,51,1)]' : 'text-xs sm:text-sm'
            }`}
            style={{ left: `${ft.x}%`, color: ft.color }}
          >
            {ft.text}
          </div>
        ))}

        {/* Floor Line in 16:9 Arena - Flush at bottom edge */}
        <div className="absolute bottom-0 w-full h-2.5 bg-gradient-to-r from-red-950/80 via-neutral-900 to-red-950/80 border-t border-red-900/60 pointer-events-none z-10">
          {customConfig.arenaFloorTrim && (
            <img
              src={customConfig.arenaFloorTrim}
              alt="Floor Trim"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
          )}
        </div>

        {/* ================= PLAYER CHARACTER SPRITE: TOUCHES BOTTOM EDGE & LARGER ================= */}
        <div
          className={`absolute flex flex-col items-center -translate-x-1/2 ${
            winner === 'player'
              ? 'animate-victory-sprite z-30'
              : playerAnim === 'death'
              ? 'animate-player-death pointer-events-none z-10'
              : playerAnim === 'attack'
              ? 'animate-player-attack z-25'
              : playerAnim === 'heavy_attack'
              ? 'animate-player-attack scale-110 z-25'
              : playerAnim === 'defend'
              ? 'animate-defend-guard z-25'
              : playerAnim === 'hurt'
              ? 'scale-95 brightness-150 animate-pulse z-20'
              : playerAnim === 'special'
              ? 'scale-120 -translate-y-2 z-25'
              : 'z-20'
          }`}
          style={{
            left: `${playerX}%`,
            bottom: '0px',
          }}
        >
          {/* Main Sub-container */}
          <div className="flex flex-col items-center relative">
            {/* Victory Crown Floating above Winning Character */}
            {winner === 'player' && (
              <div className="absolute -top-10 text-3xl sm:text-4xl animate-crown-bob z-40 select-none pointer-events-none">
                👑
              </div>
            )}

            {/* Defending Guard Barrier / Status */}
            {playerIsBlocking && playerAnim !== 'death' && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-1 z-30">
                <span className="text-[9px] font-mono font-black text-red-200 bg-red-950/90 border border-[#ff0033] px-2 py-0.5 rounded-full shadow-[0_0_12px_rgba(255,0,51,0.9)] animate-pulse tracking-wider whitespace-nowrap">
                  PARRY GUARD 🛡️
                </span>
              </div>
            )}

            {/* Enlarged Player Character Sprite with Deep Neon Red Silhouette Contour Outline */}
            <div className="relative w-36 h-48 sm:w-44 sm:h-58 md:w-52 md:h-68 flex flex-col items-center justify-end bg-transparent pointer-events-none select-none">
              <img
                src={playerSpriteUrl}
                alt={playerAnim}
                className={`w-full h-full object-contain pointer-events-none transition-transform duration-100 ${
                  !isPlayerFacingRight ? 'scale-x-[-1]' : ''
                } ${playerAnim === 'death' ? 'grayscale opacity-70' : ''} ${
                  winner === 'player'
                    ? 'animate-victory-aura'
                    : playerIsBlocking
                    ? 'char-outline-defend'
                    : playerAnim === 'special'
                    ? 'char-outline-special'
                    : playerAnim === 'heavy_attack'
                    ? 'char-outline-heavy'
                    : playerAnim === 'attack'
                    ? 'char-outline-attack'
                    : playerAnim === 'hurt'
                    ? 'char-outline-hurt'
                    : 'char-outline-player'
                }`}
                style={
                  !winner && !playerIsBlocking && (playerAnim === 'idle' || playerAnim === 'defend')
                    ? getCharacterContourOutlineStyle('#ff0033', 2.8, true)
                    : undefined
                }
              />

              {/* Status Action Label below character */}
              <div className="absolute -bottom-2 flex items-center justify-center pointer-events-none z-20">
                <span
                  className={`text-[8px] sm:text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-md transition-all border whitespace-nowrap ${
                    winner === 'player'
                      ? 'bg-[#ff0033] text-white border-red-400 font-extrabold shadow-[0_0_12px_rgba(255,0,51,0.9)]'
                      : playerAnim === 'attack'
                      ? 'bg-red-600/90 text-white border-red-400'
                      : playerAnim === 'heavy_attack'
                      ? 'bg-red-700/90 text-white border-red-300'
                      : playerAnim === 'defend'
                      ? 'bg-rose-600/90 text-white border-red-300 shadow-[0_0_10px_rgba(255,0,51,0.9)]'
                      : playerAnim === 'special'
                      ? 'bg-[#ff0033] text-white border-red-300 shadow-[0_0_14px_rgba(255,0,51,1)]'
                      : playerAnim === 'death'
                      ? 'bg-red-950 text-white border-red-600'
                      : 'bg-neutral-950/85 text-red-400 border-red-800/80 backdrop-blur-xs'
                  }`}
                >
                  {winner === 'player'
                    ? '🏆 JUARA'
                    : playerAnim === 'attack'
                    ? '🗡️ TEBAS'
                    : playerAnim === 'heavy_attack'
                    ? '💥 BERAT'
                    : playerAnim === 'defend'
                    ? '🛡️ TANGKIS'
                    : playerAnim === 'special'
                    ? '⚡ JURUS'
                    : playerAnim === 'death'
                    ? 'K.O.'
                    : 'P1'}
                </span>
              </div>
            </div>
          </div>

          {/* Floor Shadow */}
          <div className="w-24 sm:w-32 h-2.5 bg-black/75 rounded-full blur-xs mt-0.5" />
        </div>

        {/* ================= CPU ENEMY SPRITE: TOUCHES BOTTOM EDGE & DEEP PURPLE OUTLINE ================= */}
        <div
          className={`absolute flex flex-col items-center -translate-x-1/2 ${
            winner === 'cpu'
              ? 'animate-victory-sprite z-30'
              : cpuAnim === 'death'
              ? 'animate-player-death pointer-events-none z-10'
              : `${cpuAnim === 'attack' ? `scale-110 ${isCpuFacingRight ? 'translate-x-2' : '-translate-x-2'}` : ''} ${
                  cpuAnim === 'hurt' ? `scale-95 ${isCpuFacingRight ? '-translate-x-2' : 'translate-x-2'} brightness-150 animate-pulse` : ''
                } ${cpuAnim === 'special' ? 'scale-125 -translate-y-2' : ''}`
          }`}
          style={{
            left: `${cpuX}%`,
            bottom: '0px',
          }}
        >
          {/* Main Sub-container for CPU */}
          <div className="flex flex-col items-center relative">
            {winner === 'cpu' && (
              <div className="absolute -top-10 text-3xl sm:text-4xl animate-crown-bob z-40 select-none pointer-events-none">
                👑
              </div>
            )}

            {cpuIsBlocking && cpuAnim !== 'death' && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-1 z-30">
                <span className="text-[9px] font-mono font-black text-purple-200 bg-purple-950/90 border border-[#9333ea] px-2 py-0.5 rounded-full shadow-[0_0_12px_rgba(147,51,234,0.9)] animate-pulse tracking-wider whitespace-nowrap">
                  DEFEND 🛡️
                </span>
              </div>
            )}

            {/* CPU Character Sprite with Deep Purple Silhouette Contour Outline */}
            <div className="relative w-26 h-36 sm:w-32 sm:h-44 md:w-38 md:h-50 flex flex-col items-center justify-end bg-transparent pointer-events-none select-none">
              <img
                src={cpuSpriteUrl}
                alt={cpuAnim}
                className={`w-full h-full object-contain pointer-events-none transition-transform duration-100 ${
                  isCpuFacingRight ? 'scale-x-[-1]' : ''
                } ${cpuAnim === 'death' ? 'grayscale opacity-70' : ''} ${
                  winner === 'cpu'
                    ? 'animate-victory-dark-aura'
                    : cpuIsBlocking
                    ? 'char-outline-cpu-defend'
                    : cpuAnim === 'special'
                    ? 'char-outline-cpu-special'
                    : cpuAnim === 'attack'
                    ? 'char-outline-cpu-defend'
                    : cpuAnim === 'hurt'
                    ? 'char-outline-hurt'
                    : 'char-outline-cpu'
                }`}
                style={
                  !winner && !cpuIsBlocking && (cpuAnim === 'idle' || cpuAnim === 'death')
                    ? getCharacterContourOutlineStyle('#9333ea', 2.5, true)
                    : undefined
                }
              />

              {/* Status Action Label below CPU */}
              <div className="absolute -bottom-2 flex items-center justify-center pointer-events-none z-20">
                <span
                  className={`text-[8px] sm:text-[9px] font-black uppercase px-2 py-0.5 border rounded-full shadow-md transition-all whitespace-nowrap ${
                    winner === 'cpu'
                      ? 'bg-purple-600 text-white border-purple-300 font-extrabold shadow-[0_0_12px_rgba(147,51,234,0.9)]'
                      : cpuAnim === 'attack'
                      ? 'bg-purple-800/90 text-white border-purple-500'
                      : cpuAnim === 'special'
                      ? 'bg-purple-900/90 text-white border-purple-400'
                      : cpuAnim === 'death'
                      ? 'bg-neutral-800 text-purple-400 border-neutral-700'
                      : 'bg-neutral-950/85 text-purple-300 border-purple-800/80 backdrop-blur-xs'
                  }`}
                >
                  {winner === 'cpu'
                    ? '👑 JUARA'
                    : cpuAnim === 'attack'
                    ? '🗡️ SERANG'
                    : cpuAnim === 'special'
                    ? '⚡ JURUS'
                    : cpuAnim === 'death'
                    ? 'K.O.'
                    : 'DEMON KING'}
                </span>
              </div>
            </div>
          </div>

          {/* Floor Shadow for CPU */}
          <div className="w-18 sm:w-24 h-2.5 bg-black/75 rounded-full blur-xs mt-0.5" />
        </div>
      </div>

      {/* ================= STAMINA & COOLDOWN HUD BAR ================= */}
      <div className="bg-neutral-900/90 border-t border-neutral-800/80 px-2.5 sm:px-4 py-1 flex items-center justify-between text-[9px] sm:text-[11px] font-mono">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className={`flex items-center gap-0.5 ${attackCooldown > 0 ? 'text-red-400 font-bold animate-pulse' : 'text-neutral-300'}`}>
            🗡️ {attackCooldown > 0 ? `CD SERANG: ${attackCooldown.toFixed(1)}s` : `SERANG: ${3 - attackUses}/3`}
          </span>
          <span className="text-neutral-600">·</span>
          <span className={`flex items-center gap-0.5 ${defenseCooldown > 0 ? 'text-cyan-400 font-bold animate-pulse' : 'text-neutral-300'}`}>
            🛡️ {defenseCooldown > 0 ? `CD TANGKIS: ${defenseCooldown.toFixed(1)}s` : `TANGKIS: ${3 - defenseUses}/3`}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`flex items-center gap-0.5 font-bold ${
            specialCooldown > 0
              ? 'text-yellow-400 font-mono animate-pulse'
              : playerMana >= 100
              ? 'text-amber-300 font-extrabold'
              : 'text-neutral-500'
          }`}>
            ⚡ JURUS: {specialCooldown > 0 ? `CD ${specialCooldown.toFixed(1)}s` : playerMana >= 100 ? 'SIAP PAKAI!' : `${playerMana}%`}
          </span>
        </div>
      </div>

      {/* ================= TOUCH CONTROLS (WITHOUT JUMP, ERGONOMIC MOVEMENT) ================= */}
      <footer className="bg-neutral-950 px-2 sm:px-5 py-2.5 sm:py-3.5 flex items-center justify-between gap-1 sm:gap-4 z-30">
        {/* Left Thumb Cluster: Movement (Mundur & Maju) */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* MUNDUR BUTTON */}
          <button
            onTouchStart={(e) => { e.preventDefault(); moveRef.current = 'left'; }}
            onTouchEnd={(e) => { e.preventDefault(); moveRef.current = null; }}
            onMouseDown={() => { moveRef.current = 'left'; }}
            onMouseUp={() => { moveRef.current = null; }}
            className="w-16 h-13 sm:w-22 sm:h-17 md:w-26 md:h-19 rounded-2xl bg-neutral-900 border border-neutral-700 active:bg-neutral-800 active:border-red-500 text-neutral-200 flex flex-col items-center justify-center active:scale-90 shadow-md transition-all touch-manipulation cursor-pointer"
            aria-label="Mundur"
            title="Mundur (A / ⬅️)"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-neutral-200" />
            <span className="text-[9px] sm:text-[10px] font-black text-neutral-300">Mundur</span>
          </button>

          {/* MAJU BUTTON */}
          <button
            onTouchStart={(e) => { e.preventDefault(); moveRef.current = 'right'; }}
            onTouchEnd={(e) => { e.preventDefault(); moveRef.current = null; }}
            onMouseDown={() => { moveRef.current = 'right'; }}
            onMouseUp={() => { moveRef.current = null; }}
            className="w-16 h-13 sm:w-22 sm:h-17 md:w-26 md:h-19 rounded-2xl bg-neutral-900 border border-neutral-700 active:bg-neutral-800 active:border-red-500 text-neutral-200 flex flex-col items-center justify-center active:scale-90 shadow-md transition-all touch-manipulation cursor-pointer"
            aria-label="Maju"
            title="Maju (D / ➡️)"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-neutral-200" />
            <span className="text-[9px] sm:text-[10px] font-black text-neutral-300">Maju</span>
          </button>
        </div>

        {/* Right Thumb Cluster: Combat Action Buttons (Customizable PNG Icons) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* TANGKIS / PARRY GUARD BUTTON */}
          <button
            onTouchStart={(e) => { e.preventDefault(); handleStartBlock(); }}
            onTouchEnd={(e) => { e.preventDefault(); handleStopBlock(); }}
            onMouseDown={handleStartBlock}
            onMouseUp={handleStopBlock}
            disabled={defenseCooldown > 0}
            className={`w-11 h-13 sm:w-16 sm:h-17 md:w-19 md:h-19 rounded-2xl flex flex-col items-center justify-center active:scale-90 transition-all touch-manipulation border cursor-pointer relative ${
              defenseCooldown > 0
                ? 'bg-neutral-900 border-neutral-800 text-neutral-600 opacity-60 cursor-not-allowed'
                : playerIsBlocking
                ? 'bg-cyan-600 border-cyan-200 text-white shadow-[0_0_20px_rgba(6,182,212,0.9)] scale-95'
                : 'bg-cyan-950/80 border-cyan-700 text-cyan-200 active:bg-cyan-900'
            }`}
            aria-label="Tangkis Serangan"
            title="Tangkis / Parry (K)"
          >
            {customConfig.uiIcons?.defend ? (
              <img src={customConfig.uiIcons.defend} alt="Defend" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
            ) : (
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            <span className="text-[8px] sm:text-[9px] font-black tracking-wider mt-0.5">
              {defenseCooldown > 0 ? `${defenseCooldown.toFixed(1)}s` : 'TANGKIS'}
            </span>
            <span className="text-[7px] text-cyan-300 font-mono absolute top-0.5 right-1">
              {defenseCooldown > 0 ? 'CD' : `${3 - defenseUses}`}
            </span>
          </button>

          {/* TEBAS / QUICK SWORD ATTACK BUTTON */}
          <button
            onClick={handlePlayerAttack}
            disabled={attackCooldown > 0}
            className={`w-11 h-13 sm:w-16 sm:h-17 md:w-19 md:h-19 rounded-2xl border text-white flex flex-col items-center justify-center active:scale-90 shadow-lg transition-all touch-manipulation cursor-pointer relative ${
              attackCooldown > 0
                ? 'bg-neutral-900 border-neutral-800 text-neutral-600 opacity-60 cursor-not-allowed'
                : 'bg-gradient-to-br from-rose-600 via-red-600 to-red-800 border-red-400 active:bg-red-500'
            }`}
            aria-label="Tebas Pedang Cepat"
            title="Tebas Pedang (J / Spasi)"
          >
            {customConfig.uiIcons?.attack ? (
              <img src={customConfig.uiIcons.attack} alt="Attack" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
            ) : (
              <span className="text-sm sm:text-base">🗡️</span>
            )}
            <span className="text-[8px] sm:text-[9px] font-black tracking-wider mt-0.5">
              {attackCooldown > 0 ? `${attackCooldown.toFixed(1)}s` : 'TEBAS'}
            </span>
            <span className="text-[7px] text-amber-200 font-mono absolute top-0.5 right-1">
              {attackCooldown > 0 ? 'CD' : `${3 - attackUses}`}
            </span>
          </button>

          {/* BERAT / HEAVY SWORD SMASH BUTTON */}
          <button
            onClick={handlePlayerHeavyAttack}
            disabled={attackCooldown > 0}
            className={`w-11 h-13 sm:w-16 sm:h-17 md:w-19 md:h-19 rounded-2xl border text-white flex flex-col items-center justify-center active:scale-90 shadow-lg transition-all touch-manipulation cursor-pointer relative ${
              attackCooldown > 0
                ? 'bg-neutral-900 border-neutral-800 text-neutral-600 opacity-60 cursor-not-allowed'
                : 'bg-gradient-to-br from-amber-600 via-orange-600 to-orange-800 border-orange-400 active:bg-orange-500'
            }`}
            aria-label="Tebasan Pedang Berat"
            title="Tebasan Berat (U / I)"
          >
            {customConfig.uiIcons?.heavy ? (
              <img src={customConfig.uiIcons.heavy} alt="Heavy" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
            ) : (
              <span className="text-sm sm:text-base">💥</span>
            )}
            <span className="text-[8px] sm:text-[9px] font-black tracking-wider text-amber-200 mt-0.5">
              {attackCooldown > 0 ? `${attackCooldown.toFixed(1)}s` : 'BERAT'}
            </span>
            <span className="text-[7px] text-amber-200 font-mono absolute top-0.5 right-1">
              {attackCooldown > 0 ? 'CD' : `${3 - attackUses}`}
            </span>
          </button>

          {/* JURUS / ULTIMATE SPECIAL BUTTON */}
          <button
            onClick={handlePlayerSpecial}
            disabled={playerMana < 100 || specialCooldown > 0}
            className={`w-11 h-13 sm:w-16 sm:h-17 md:w-19 md:h-19 rounded-2xl flex flex-col items-center justify-center transition-all touch-manipulation border cursor-pointer relative ${
              specialCooldown > 0
                ? 'bg-neutral-900 border-neutral-800 text-neutral-600 opacity-60 cursor-not-allowed'
                : playerMana >= 100
                ? 'bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 border-yellow-200 text-neutral-950 font-black shadow-[0_0_25px_rgba(245,158,11,1)] animate-bounce active:scale-90'
                : 'bg-neutral-900/70 border-neutral-800 text-neutral-600 cursor-not-allowed opacity-50'
            }`}
            aria-label="Jurus Pamungkas"
            title="Jurus Pamungkas (L)"
          >
            {customConfig.uiIcons?.special ? (
              <img src={customConfig.uiIcons.special} alt="Special" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
            ) : (
              <Zap className={`w-4 h-4 sm:w-5 sm:h-5 ${playerMana >= 100 && specialCooldown <= 0 ? 'fill-current text-neutral-950' : 'text-neutral-600'}`} />
            )}
            <span className="text-[8px] sm:text-[9px] font-black mt-0.5">
              {specialCooldown > 0 ? `${specialCooldown.toFixed(1)}s` : 'JURUS'}
            </span>
            {specialCooldown > 0 && (
              <span className="text-[7px] text-yellow-300 font-mono absolute top-0.5 right-1 animate-pulse">
                5s
              </span>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
};
