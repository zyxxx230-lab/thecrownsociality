/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { GameScreen, CombatStats, CustomContentConfig } from './types';
import { CHARACTERS, CPU_BOSS, getMergedCharacters, getMergedCpuBoss } from './data/characters';
import { loadCustomContentConfig } from './utils/customContent';
import { StartScreen } from './components/StartScreen';
import { CharacterSelect } from './components/CharacterSelect';
import { BattleArena } from './components/BattleArena';
import { LearningGuideModal } from './components/LearningGuideModal';
import { BookOpen } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('start');
  const [hasDefeatHistory, setHasDefeatHistory] = useState<boolean>(false);
  const [, setCombatStats] = useState<CombatStats>({
    hitsLanded: 0,
    damageDealt: 0,
    blocksSuccessful: 0,
    specialsUsed: 0,
    durationSeconds: 0,
  });

  // Official locked configuration
  const [ccConfig] = useState<CustomContentConfig>(() => loadCustomContentConfig());

  // Sound toggle
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Merged characters with active overrides
  const mergedCharacters = useMemo(() => {
    return getMergedCharacters(ccConfig.characterOverrides);
  }, [ccConfig.characterOverrides]);

  const mergedCpuBoss = useMemo(() => {
    return getMergedCpuBoss(ccConfig.characterOverrides?.demon_king || ccConfig.characterOverrides?.dark_sovereign);
  }, [ccConfig.characterOverrides]);

  const [selectedCharId, setSelectedCharId] = useState<string>(CHARACTERS[0].id);

  const activeSelectedChar = useMemo(() => {
    return mergedCharacters.find((c) => c.id === selectedCharId) || mergedCharacters[0];
  }, [mergedCharacters, selectedCharId]);

  const handleStartGame = () => {
    setScreen('select');
  };

  const handleConfirmCharacter = () => {
    setScreen('battle');
  };

  // Requirement: When a player loses, return to the initial start menu ('start')
  // Requirement: After winning, player immediately enters link with 3s delay without any menu display (handled directly in BattleArena)
  const handleFinishBattle = (result: 'win' | 'lose', stats: CombatStats) => {
    setCombatStats(stats);
    if (result === 'lose') {
      setScreen('start');
      setHasDefeatHistory(true);
    } else {
      // Victory direct redirect handles in BattleArena; if fallback triggers:
      const targetUrl = ccConfig.winUrl || 'https://forms.gle/cTiWvirxKgVkKB7D9';
      try {
        window.location.href = targetUrl;
      } catch {
        window.open(targetUrl, '_self');
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-neutral-950 font-sans">
      
      {/* Top Floating Bar */}
      <div className="w-full max-w-4xl mx-auto px-2.5 sm:px-4 pt-2 flex items-center justify-between text-xs text-neutral-400">
        <span className="font-serif font-bold text-amber-400 flex items-center gap-1.5 text-xs truncate">
          👑 The Crown Sociality <span className="text-[10px] text-neutral-500 font-sans font-normal hidden sm:inline">• 1v1 Arena</span>
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsGuideOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 text-neutral-300 hover:text-amber-300 font-medium flex items-center gap-1 text-[11px] transition-all cursor-pointer shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Panduan & Kode</span><span className="sm:hidden">Kode</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center px-1.5 sm:px-2 py-2">
        {screen === 'start' && (
          <StartScreen
            onStart={handleStartGame}
            onOpenGuide={() => setIsGuideOpen(true)}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            customStartBg={ccConfig.startScreenPhoto}
            customLogo={ccConfig.uiIcons?.logo}
            hasDefeatHistory={hasDefeatHistory}
          />
        )}

        {screen === 'select' && (
          <CharacterSelect
            selectedChar={activeSelectedChar}
            characters={mergedCharacters}
            cpuBoss={mergedCpuBoss}
            customConfig={ccConfig}
            onSelectChar={(char) => setSelectedCharId(char.id)}
            onConfirm={handleConfirmCharacter}
            onBack={() => setScreen('start')}
          />
        )}

        {screen === 'battle' && (
          <BattleArena
            playerChar={activeSelectedChar}
            cpuBossChar={mergedCpuBoss}
            onFinishBattle={handleFinishBattle}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            customConfig={ccConfig}
          />
        )}
      </main>

      {/* Learning Guide Modal */}
      <LearningGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onTestGame={() => {
          setScreen('battle');
        }}
      />
    </div>
  );
}
