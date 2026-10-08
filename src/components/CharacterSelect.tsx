import React from 'react';
import { Character, CustomContentConfig } from '../types';
import { Swords, Shield, Zap, Wind, ChevronLeft, ArrowRight } from 'lucide-react';
import { getCharacterContourOutlineStyle } from '../utils/imageTransparency';

interface Props {
  selectedChar: Character;
  characters: Character[];
  cpuBoss: Character;
  customConfig?: CustomContentConfig;
  onSelectChar: (char: Character) => void;
  onConfirm: () => void;
  onBack: () => void;
  onUpdateConfig?: (newConfig: CustomContentConfig) => void;
}

export const CharacterSelect: React.FC<Props> = ({
  selectedChar,
  characters,
  cpuBoss,
  customConfig,
  onSelectChar,
  onConfirm,
  onBack,
}) => {
  return (
    <div className="flex flex-col min-h-[92vh] max-w-xl mx-auto px-3 sm:px-4 py-3 justify-between relative select-none">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white flex items-center gap-1 text-xs cursor-pointer active:scale-95 transition-all shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Kembali
          </button>
          
          <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400">
            PILIH ROLE TEMPUR
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-amber-300 font-serif text-center mb-1 drop-shadow-sm tracking-wider">
          {customConfig?.selectionMenuText?.headerTitle || 'ROLE SELECTION'}
        </h2>
        <p className="text-[11px] sm:text-xs text-neutral-400 text-center mb-3 sm:mb-4 px-2">
          {customConfig?.selectionMenuText?.headerSubtitle || 'Pilih role tempurmu untuk mengalahkan Demon King'}
        </p>
      </div>

      {/* Grid Karakter: 4 Official Roles with transparent sprites and contour outlines */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 my-auto">
        {characters.map((char) => {
          const isSelected = selectedChar.id === char.id;
          const photoUrl = char.customPhoto || (char.avatar?.startsWith('data:') || char.avatar?.startsWith('http') ? char.avatar : '');

          return (
            <div
              key={char.id}
              onClick={() => onSelectChar(char)}
              role="button"
              tabIndex={0}
              className={`relative p-3 rounded-2xl border transition-all text-left cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-neutral-850/90 border-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.35)] ring-2 ring-amber-400/50 scale-[1.02]'
                  : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700 opacity-85 hover:opacity-100'
              }`}
            >
              {isSelected && (
                <span className="absolute -top-2.5 right-3 bg-amber-500 text-neutral-950 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                  {customConfig?.selectionMenuText?.badgeText || 'TERPILIH'}
                </span>
              )}

              <div className="flex items-center gap-2.5 mb-2">
                {/* Character Sprite Container */}
                <div className="w-14 h-16 rounded-xl bg-transparent flex items-center justify-center shrink-0 p-0.5 relative pointer-events-none select-none">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={char.name}
                      className="w-full h-full object-contain pointer-events-none transition-transform duration-150"
                      style={getCharacterContourOutlineStyle(isSelected ? '#ff0033' : (char.accentColor || '#ff0033'), isSelected ? 2.6 : 1.8)}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-3xl drop-shadow">{char.avatar}</span>
                  )}
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-xs sm:text-sm font-bold text-white truncate">{char.name}</h3>
                  <p className="text-[10px] text-amber-400 font-medium truncate">{char.title}</p>
                </div>
              </div>

              {/* Bar Stats Mini */}
              <div className="space-y-1 text-[10px] sm:text-[11px] text-neutral-300 border-t border-neutral-800/80 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-400" /> HP:
                  </span>
                  <span className="font-semibold text-emerald-400">{char.hp}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 flex items-center gap-1">
                    <Swords className="w-3 h-3 text-red-400" /> ATK:
                  </span>
                  <span className="font-semibold text-red-400">{char.attackDmg}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400 flex items-center gap-1">
                    <Wind className="w-3 h-3 text-cyan-400" /> SPD:
                  </span>
                  <span className="font-semibold text-cyan-400">{char.speed}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Karakter Terpilih & Lawan CPU */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-3 sm:p-3.5 my-2.5 space-y-2">
        <div className="flex items-center gap-3">
          {/* Selected Character Preview with Transparent Background & Silhouette Outline */}
          <div className="w-16 h-20 sm:w-20 sm:h-24 flex flex-col items-center justify-end shrink-0 bg-transparent relative select-none pointer-events-none">
            {Boolean(selectedChar.customPhoto || selectedChar.avatar?.startsWith('data:') || selectedChar.avatar?.startsWith('http')) ? (
              <>
                <img
                  src={selectedChar.customPhoto || selectedChar.avatar}
                  alt={selectedChar.name}
                  className="w-full h-full object-contain pointer-events-none animate-in zoom-in-95 duration-200"
                  style={getCharacterContourOutlineStyle(selectedChar.accentColor || '#facc15', 2.5, true)}
                  referrerPolicy="no-referrer"
                />
                <div className="w-10 sm:w-12 h-1.5 bg-black/60 rounded-full blur-xs mt-0.5" />
              </>
            ) : (
              <span className="text-4xl drop-shadow">{selectedChar.avatar}</span>
            )}
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm sm:text-base font-black text-amber-300 font-serif leading-tight">
                  {selectedChar.name}
                </h4>
                <p className="text-[10px] sm:text-xs text-neutral-400 font-medium">
                  {selectedChar.title}
                </p>
              </div>
              <div
                className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]"
                style={{ backgroundColor: selectedChar.accentColor }}
                title={`Warna Aksen: ${selectedChar.accentColor}`}
              />
            </div>

            <p className="text-[10px] sm:text-[11px] text-neutral-300 leading-snug line-clamp-2">
              {selectedChar.description}
            </p>

            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" /> Jurus: {selectedChar.specialName}
              </span>
            </div>
          </div>
        </div>

        {/* Info CPU Boss */}
        <div className="flex items-center justify-between bg-neutral-950 p-2 rounded-xl border border-neutral-800/70 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-8 bg-transparent flex items-center justify-center shrink-0">
              {cpuBoss.customPhoto ? (
                <img
                  src={cpuBoss.customPhoto}
                  alt={cpuBoss.name}
                  className="w-full h-full object-contain"
                  style={getCharacterContourOutlineStyle('#9333ea', 2.0)}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-lg">{cpuBoss.avatar}</span>
              )}
            </div>
            <div>
              <div className="text-white font-bold text-xs truncate max-w-[170px] sm:max-w-none">{cpuBoss.name}</div>
              <div className="text-[10px] text-purple-300 font-semibold">Lawan Raja Iblis ({cpuBoss.hp} HP)</div>
            </div>
          </div>
          <span className="text-[10px] bg-purple-950 text-purple-200 border border-purple-800 px-2 py-0.5 rounded font-mono">
            DEMON KING
          </span>
        </div>
      </div>

      {/* Tombol Masuk Arena */}
      <button
        onClick={onConfirm}
        className="w-full py-3.5 sm:py-4 px-6 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 font-black text-sm sm:text-base rounded-2xl shadow-[0_4px_20px_rgba(245,158,11,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>{customConfig?.selectionMenuText?.confirmButtonText || 'MASUK KE ARENA TEMPUR'}</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};
