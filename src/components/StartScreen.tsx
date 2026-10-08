import React from 'react';
import { Swords, BookOpen, Volume2, VolumeX, Sparkles, ShieldAlert, RotateCcw, Zap, Shield } from 'lucide-react';
import { soundFx } from '../utils/sound';
import tcsCrownLogo from '../assets/images/tcs_crown_profile_logo_1791461323571.jpg';

interface Props {
  onStart: () => void;
  onOpenGuide: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  customStartBg?: string;
  customLogo?: string;
  hasDefeatHistory?: boolean;
}

export const StartScreen: React.FC<Props> = ({
  onStart,
  onOpenGuide,
  soundEnabled,
  setSoundEnabled,
  customStartBg,
  customLogo,
  hasDefeatHistory,
}) => {
  const displayLogo = customLogo || tcsCrownLogo;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[90vh] px-3 sm:px-4 py-6 text-center max-w-lg mx-auto overflow-hidden">
      {/* Start Screen Background Image if configured */}
      {customStartBg && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src={customStartBg}
            alt="Start Screen Banner"
            className="w-full h-full object-cover opacity-25"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950/80 to-neutral-950" />
        </div>
      )}

      {/* Top Floating Utility Bar (Sound Only - No Edit) */}
      <div className="absolute top-2 right-2 flex items-center gap-2 z-20">
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
          className="p-2 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:text-amber-400 transition-all backdrop-blur-sm cursor-pointer shadow-sm"
          title="Toggle Suara & Musik Kerajaan"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
        </button>
      </div>

      {/* Defeat Notification Banner if returning after loss */}
      {hasDefeatHistory && (
        <div className="w-full mb-4 p-3 rounded-2xl bg-red-950/70 border border-red-600/70 text-red-200 text-xs text-left animate-in fade-in slide-in-from-top-2 duration-300 relative z-10 shadow-md">
          <div className="flex items-center gap-2 font-bold text-amber-300 mb-1">
            <RotateCcw className="w-4 h-4 text-red-400 shrink-0" />
            <span>Kamu Kembali ke Menu Setelah Kalah</span>
          </div>
          <p className="text-[11px] text-neutral-300 leading-relaxed">
            Demon King memiliki kelemahan stamina setelah 3 serangan! Manfaatkan tombol <strong>[TANGKIS]</strong> lalu balas saat ia kelelahan.
          </p>
        </div>
      )}

      {/* Crown Banner & Icon Profile - TCS Royal Emblem Photo */}
      <div className="relative mb-4 z-10">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-800 p-[3px] shadow-[0_0_35px_rgba(245,158,11,0.45)] flex items-center justify-center">
          <div className="w-full h-full bg-neutral-950 rounded-[21px] flex items-center justify-center p-1 overflow-hidden ring-1 ring-amber-400/40">
            <img
              src={displayLogo}
              alt="The Crown Sociality TCS Emblem"
              className="w-full h-full object-cover rounded-2xl drop-shadow-md select-none pointer-events-none"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Judul Game */}
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 font-serif drop-shadow-sm mb-1.5 z-10">
        The Crown Sociality
      </h1>
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-black tracking-wide uppercase mb-4 z-10 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" /> 1 vs 1 against the demon king
      </div>

      {/* Aturan Anti-Spam Cooldown & Bot Deficiencies */}
      <div className="w-full bg-neutral-900/90 border border-neutral-800/80 rounded-2xl p-3.5 sm:p-4 mb-4 text-left shadow-lg z-10 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
          <Shield className="w-4 h-4 text-amber-400" />
          <span>Sistem Stamina & Aturan Anti-Spam</span>
        </div>
        <p className="text-[11px] text-neutral-300 leading-relaxed">
          Pertarungan taktikal mencegah pemain dan musuh melakukan spam tombol berlebihan:
        </p>
        <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] sm:text-[11px]">
          <div className="p-2 rounded-xl bg-neutral-950/80 border border-neutral-800 text-neutral-300">
            <div className="font-bold text-red-400 flex items-center gap-1">
              <Swords className="w-3 h-3" /> Cooldown Serangan
            </div>
            <span>Cooldown 2 detik setelah 3 kali memukul</span>
          </div>
          <div className="p-2 rounded-xl bg-neutral-950/80 border border-neutral-800 text-neutral-300">
            <div className="font-bold text-cyan-400 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Cooldown Tangkis
            </div>
            <span>Cooldown 2 detik setelah 3 kali menangkis</span>
          </div>
          <div className="p-2 col-span-2 rounded-xl bg-neutral-950/80 border border-neutral-800 text-neutral-300">
            <div className="font-bold text-yellow-400 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Cooldown Jurus Spesial (5 Detik)
            </div>
            <span>Jurus pamungkas membutuhkan mana 100% dan jeda 5 detik</span>
          </div>
        </div>
      </div>

      {/* Info Lawan Demon King */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-200 text-xs mb-4 w-full text-left z-10">
        <ShieldAlert className="w-4 h-4 shrink-0 text-purple-400" />
        <span className="text-[11px]">
          <strong>Lawan Demon King:</strong> Musuh memiliki pola seimbang dan jeda stamina setelah 3 serangan, membuka celah untuk diserang balik!
        </span>
      </div>

      {/* Tombol Utama */}
      <div className="flex flex-col gap-2.5 w-full z-10">
        <button
          onClick={() => {
            if (soundEnabled) {
              soundFx.startRoyalBgm();
            }
            onStart();
          }}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 font-extrabold text-sm sm:text-base rounded-2xl shadow-[0_4px_25px_rgba(245,158,11,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 tracking-wide cursor-pointer"
        >
          <Swords className="w-5 h-5 fill-current" />
          MASUK KE ARENA BERTARUNG
        </button>

        <button
          onClick={onOpenGuide}
          className="w-full py-3 px-4 bg-neutral-900/90 hover:bg-neutral-850 border border-neutral-800 hover:border-amber-500/50 text-neutral-200 hover:text-amber-300 font-semibold text-xs rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          Laboratorium Kode & Panduan
        </button>
      </div>

      <div className="mt-5 text-neutral-500 text-[10px] sm:text-[11px] z-10">
        Dirancang khusus untuk layar sentuh Android • The Crown Sociality Studio
      </div>
    </div>
  );
};
