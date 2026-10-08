import React, { useState, useEffect } from 'react';
import { Character, CombatStats } from '../types';
import { RotateCcw, Home, ExternalLink, Sparkles, Shield, Swords, Clock, Zap, Flame } from 'lucide-react';

interface Props {
  result: 'win' | 'lose';
  playerChar?: Character;
  stats: CombatStats;
  winUrl: string;
  onRematch: () => void;
  onBackToMenu: () => void;
}

export const GameOverModal: React.FC<Props> = ({
  result,
  playerChar,
  stats,
  winUrl,
  onRematch,
  onBackToMenu,
}) => {
  const [countdown, setCountdown] = useState<number>(5);
  const [redirectCancelled, setRedirectCancelled] = useState<boolean>(false);

  const isWin = result === 'win';
  const targetUrl = winUrl || 'https://forms.gle/cTiWvirxKgVkKB7D9';

  useEffect(() => {
    if (!isWin || redirectCancelled) return;

    setCountdown(5);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Automatically redirect to the designated forms link after 5 seconds pause
          try {
            window.location.href = targetUrl;
          } catch {
            window.open(targetUrl, '_self');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isWin, redirectCancelled, targetUrl]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-neutral-900 border-2 border-neutral-700 w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl text-center relative overflow-hidden">
        {/* Ambient Glow */}
        <div
          className={`absolute -top-16 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full blur-3xl pointer-events-none ${
            isWin ? 'bg-amber-500/30' : 'bg-red-500/25'
          }`}
        />

        {/* Winning Character Sprite Display / Defeat Badge */}
        <div className="relative mb-3 flex flex-col items-center justify-center">
          {isWin && playerChar ? (
            <div className="relative flex flex-col items-center">
              {/* Floating Crown above winning head */}
              <div className="text-3xl sm:text-4xl animate-crown-bob mb-1 select-none pointer-events-none">
                👑
              </div>

              {/* Sparkles around winning sprite */}
              <div className="absolute top-2 -left-6 text-amber-300 text-base animate-sparkle-1 pointer-events-none">✨</div>
              <div className="absolute top-0 text-yellow-200 text-lg animate-sparkle-2 pointer-events-none">⭐</div>
              <div className="absolute top-3 -right-6 text-amber-400 text-base animate-sparkle-3 pointer-events-none">✨</div>

              {/* Winning Character Avatar with Keyframe Jump Celebration & Aura */}
              <div className="animate-victory-sprite">
                <div
                  className={`w-20 h-24 rounded-2xl bg-gradient-to-t ${playerChar.color} p-1.5 shadow-xl flex flex-col items-center justify-center relative animate-victory-aura ring-4 ring-amber-300 ring-offset-2 ring-offset-neutral-950`}
                >
                  <span className="text-4xl drop-shadow-md">{playerChar.avatar}</span>
                  <span className="text-[10px] font-black uppercase mt-1 px-1.5 py-0.5 rounded bg-amber-400 text-neutral-950 font-extrabold shadow-sm">
                    CHAMPION
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-xl mx-auto border bg-neutral-800 border-red-800 text-red-500 animate-pulse">
                😵
              </div>
              <span className="text-[10px] font-extrabold uppercase mt-2 px-2 py-0.5 bg-red-950 text-red-300 border border-red-800 rounded-full">
                K.O. - JANGAN MENYERAH!
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className={`text-2xl sm:text-3xl font-black font-serif mb-1 ${isWin ? 'text-amber-400' : 'text-rose-400'}`}>
          {isWin ? 'VICTORY! KAMU MENANG!' : 'DEFEAT! KAMU KALAH'}
        </h2>
        {isWin && playerChar && (
          <div className="text-xs font-bold text-amber-300 mb-1">
            {playerChar.name} · {playerChar.title}
          </div>
        )}
        <p className="text-xs text-neutral-300 mb-3">
          {isWin
            ? 'Luar biasa! Kamu berhasil menaklukkan Demon King dan dinobatkan sebagai penguasa tahta!'
            : 'Demon King masih menguasai arena. Ulangi pertarungan sampai kamu berhasil menang!'}
        </p>

        {/* Battle Stats Summary */}
        <div className="grid grid-cols-2 gap-2 bg-neutral-950 p-3 rounded-2xl border border-neutral-800 mb-3 text-left text-xs">
          <div className="flex items-center gap-2 text-neutral-300">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Durasi: <strong className="text-white">{stats.durationSeconds}s</strong></span>
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <Swords className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>Sabetan Kena: <strong className="text-white">{stats.hitsLanded}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Parry Berhasil: <strong className="text-white">{stats.blocksSuccessful}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <Zap className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span>Jurus Pamungkas: <strong className="text-white">{stats.specialsUsed}</strong></span>
          </div>
        </div>

        {/* WIN SPECIAL: 5-second pause countdown before redirecting to Google Form */}
        {isWin ? (
          <div className="bg-gradient-to-r from-amber-950/60 via-emerald-950/60 to-amber-950/60 border-2 border-amber-400/70 rounded-2xl p-4 mb-4 text-left shadow-lg">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300 mb-2">
              <span className="flex items-center gap-1.5 text-sm">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" /> Masuk ke Google Form Hadiah
              </span>
              {!redirectCancelled && countdown > 0 && (
                <span className="text-xs font-mono font-black text-amber-200 bg-amber-500/30 border border-amber-400/50 px-2.5 py-1 rounded-full animate-pulse">
                  Mengarahkan dlm {countdown}s
                </span>
              )}
            </div>

            {/* Visual 5-second progress bar */}
            {!redirectCancelled && (
              <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden mb-3 border border-amber-500/30">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${Math.max(0, (countdown / 5) * 100)}%` }}
                />
              </div>
            )}

            <p className="text-[11px] text-neutral-300 mb-3 leading-relaxed">
              Selamat! Kamu dialihkan otomatis ke Google Form dalam hitungan mundur 5 detik. Atau klik tombol di bawah untuk langsung masuk sekarang:
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href={targetUrl}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-neutral-950 font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <ExternalLink className="w-4 h-4" /> Masuk ke Link Sekarang ({countdown}s)
              </a>
              {!redirectCancelled && countdown > 0 && (
                <button
                  onClick={() => setRedirectCancelled(true)}
                  className="py-2 px-3 bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 text-[11px] rounded-xl font-medium"
                >
                  Batal Auto-Redirect
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-red-950/30 border border-red-800/40 rounded-2xl p-3.5 mb-4 text-left text-xs text-neutral-300">
            <div className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-400" /> Coba Lagi Sampai Menang!
            </div>
            <p className="text-[11px] text-neutral-400">
              Pertahankan posisi dengan tombol <strong className="text-cyan-300">[TANGKIS]</strong> saat musuh mendekat untuk memicu parry pedang, lalu balas dengan <strong className="text-amber-300">[BERAT]</strong> dan <strong className="text-yellow-300">[JURUS]</strong>! Kamu bisa mengulang terus tanpa batas.
            </p>
          </div>
        )}

        {/* Action Buttons: Replay until win */}
        <div className="flex gap-2.5">
          <button
            onClick={onRematch}
            className="flex-1 py-4 px-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> {isWin ? 'TARUNG LAGI' : 'ULANGI PERTARUNGAN (REPLAY)'}
          </button>
          <button
            onClick={onBackToMenu}
            className="py-4 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <Home className="w-4 h-4" /> Menu
          </button>
        </div>
      </div>
    </div>
  );
};

