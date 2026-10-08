import React, { useState } from 'react';
import { BookOpen, Code, Copy, Check, ExternalLink, Sparkles, Terminal, FileCode, Play, Smartphone } from 'lucide-react';
import { STANDALONE_HTML, STANDALONE_CSS, STANDALONE_JS } from '../data/standaloneCode';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTestGame: () => void;
}

export const LearningGuideModal: React.FC<Props> = ({ isOpen, onClose, onTestGame }) => {
  const [activeTab, setActiveTab] = useState<'panduan' | 'html' | 'css' | 'js'>('panduan');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const downloadStandaloneHTML = () => {
    const combined = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>The Crown Sociality Minigames (Standalone)</title>
  <style>
${STANDALONE_CSS}
  </style>
</head>
<body>
${STANDALONE_HTML.replace(/<!DOCTYPE html>[\s\S]*?<body>/, '').replace(/<\/body>[\s\S]*?<\/html>/, '').replace(/<script src="script.js"><\/script>/, '')}
  <script>
${STANDALONE_JS}
  </script>
</body>
</html>`;

    const blob = new Blob([combined], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'the-crown-sociality-minigame.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="bg-neutral-900 border border-amber-500/30 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-lg">
              👑
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-amber-300 font-serif">
                Laboratorium Guru Pemrograman
              </h2>
              <p className="text-xs text-neutral-400">
                Belajar Membangun Game Dari 0: HTML, CSS, & JS Murni (Android Friendly)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadStandaloneHTML}
              className="px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Unduh 1 file HTML yang bisa langsung dibuka di browser Android"
            >
              📥 Download File .HTML
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium transition-all"
            >
              Tutup ✕
            </button>
          </div>
        </div>

        {/* Tab Navigasi */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/60 px-4 pt-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('panduan')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'panduan'
                ? 'border-amber-400 text-amber-300 bg-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            10 Bagian Panduan Belajar
          </button>
          <button
            onClick={() => setActiveTab('html')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'html'
                ? 'border-amber-400 text-amber-300 bg-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileCode className="w-4 h-4 text-orange-400" />
            index.html
          </button>
          <button
            onClick={() => setActiveTab('css')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'css'
                ? 'border-amber-400 text-amber-300 bg-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileCode className="w-4 h-4 text-cyan-400" />
            style.css
          </button>
          <button
            onClick={() => setActiveTab('js')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'js'
                ? 'border-amber-400 text-amber-300 bg-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileCode className="w-4 h-4 text-yellow-400" />
            script.js
          </button>
        </div>

        {/* Isi Tab */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 text-sm text-neutral-300 space-y-6">
          {activeTab === 'panduan' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Pesan Sambutan Guru */}
              <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-base mb-1">
                  <Sparkles className="w-5 h-5" />
                  Halo Muridku! Selamat Datang di Dunia Game Development!
                </div>
                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
                  Membuat game fighting 1v1 dari 0 menggunakan HP Android itu sangat mungkin dan menyenangkan! Kamu hanya membutuhkan 3 pondasi utama: 
                  <strong className="text-amber-300"> HTML</strong> (kerangka tulang), 
                  <strong className="text-cyan-300"> CSS</strong> (baju & kosmetik), dan 
                  <strong className="text-yellow-300"> JavaScript</strong> (otak & jantung game).
                </p>
              </div>

              {/* Rekomendasi Aplikasi Coding di Android */}
              <div className="p-4 bg-neutral-800/60 border border-neutral-700 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <Smartphone className="w-4 h-4" />
                  Aplikasi Coding Gratis Terbaik di Android (Google Play Store):
                </div>
                <ul className="text-xs text-neutral-300 list-disc list-inside space-y-1">
                  <li><strong>TrebEdit</strong> (Sangat ramah pemula, ada tombol Play langsung)</li>
                  <li><strong>Acode - code editor</strong> (Cepat, ringan, mirip VS Code versi Android)</li>
                  <li><strong>Spck Editor</strong> (Lengkap dengan preview browser langsung)</li>
                </ul>
              </div>

              {/* Rangkuman 10 Bagian */}
              <div className="space-y-4">
                <div className="p-4 bg-neutral-950/70 border border-neutral-800 rounded-xl">
                  <h3 className="font-bold text-amber-300 text-base mb-2">1. Konsep Jarak (Distance) & CPU Medium (Tingkat Sedang)</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Kunci utama game ini adalah variabel <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-amber-300">getDistance()</code>. 
                    Jika jarak player dan musuh &gt; 18%, serangan kamu tidak akan kena ("Terlalu Jauh!"). 
                    Kamu harus menekan tombol <strong className="text-white">[➡️ Maju]</strong> terlebih dahulu. 
                    <strong>CPU Medium</strong> dirancang dengan kelemahan seimbang: bot akan kelelahan (fatigue) setelah melancarkan 3 serangan, memberikan jendela emas bagi pemain untuk membalas tanpa khawatir dicounter terus-menerus!
                  </p>
                </div>

                <div className="p-4 bg-neutral-950/70 border border-neutral-800 rounded-xl">
                  <h3 className="font-bold text-amber-300 text-base mb-2">2. Fitur Menangkis (Block & Guard)</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Saat kamu menahan tombol <strong className="text-white">[🛡️ Tangkis]</strong>, variabel <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-amber-300">playerIsBlocking = true</code>.
                    Ketika CPU memukulmu, damage akan dipotong 65-75%! Ini membuat pertarungan berjalan sengit dan taktikal.
                  </p>
                </div>

                <div className="p-4 bg-neutral-950/70 border border-neutral-800 rounded-xl">
                  <h3 className="font-bold text-amber-300 text-base mb-2">3. Fitur Redirect Link Saat Menang (WIN) & Kembali ke Menu Saat Kalah</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Saat pemain menang (<code className="bg-neutral-800 px-1.5 py-0.5 rounded text-amber-300">cpuHp &lt;= 0</code>), layar piala akan muncul dan otomatis mengarahkan ke formulir hadiah setelah 5 detik. 
                    Sedangkan <strong>ketika pemain kalah</strong>, game akan langsung mengembalikan pemain ke menu tampilan awal agar pemain dapat segera mencoba kembali tanpa terhalang popup berulang.
                  </p>
                </div>

                <div className="p-4 bg-neutral-950/70 border border-neutral-800 rounded-xl">
                  <h3 className="font-bold text-amber-300 text-base mb-2">4. Mekanik Lompat (Jump) & Efek Serangan Berat</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Pemain dapat menekan tombol <strong className="text-amber-400">[🦘 Lompat]</strong> (atau keyboard W / Panah Atas) untuk melompat tinggi dan <strong>melewati musuh ke sisi seberang</strong> (cross-up). 
                    Saat Serangan Berat (Heavy Attack) berhasil mengenai lawan, efek <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-amber-300">animate-impact-flash</code> (kilatan layar) dan <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-amber-300">animate-shockwave</code> (gelombang kejut radial) akan meledak di titik hantaman!
                  </p>
                </div>

                <div className="p-4 bg-neutral-950/70 border border-neutral-800 rounded-xl">
                  <h3 className="font-bold text-amber-300 text-base mb-2">5. Aturan Anti-Spam (Cooldown 2s & 5s) & Taktik Bertarung</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Untuk mencegah spam tombol, sistem cooldown aktif otomatis: <strong>Serangan</strong> dan <strong>Tangkis</strong> masuk ke cooldown 2 detik setelah 3 kali pemakaian berturut-turut. <strong>Jurus Spesial</strong> memiliki cooldown 5 detik dan membutuhkan mana penuh 100%. Demon King juga memiliki jeda stamina setelah melancarkan 3 serangan, membuka celah emas untuk serangan balasan!
                  </p>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onTestGame();
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-neutral-950 font-bold rounded-xl shadow-lg hover:from-amber-400 hover:to-yellow-500 transition-all flex items-center gap-2 mx-auto"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Coba Mainkan Game Sekarang di Layar
                </button>
              </div>
            </div>
          )}

          {activeTab === 'html' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400">File: project/index.html</span>
                <button
                  onClick={() => copyToClipboard(STANDALONE_HTML, 'html')}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  {copiedType === 'html' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedType === 'html' ? 'Tersalin ke Clipboard!' : 'Salin Kode HTML'}
                </button>
              </div>
              <pre className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-300 overflow-x-auto whitespace-pre leading-relaxed select-text">
                {STANDALONE_HTML}
              </pre>
            </div>
          )}

          {activeTab === 'css' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400">File: project/style.css</span>
                <button
                  onClick={() => copyToClipboard(STANDALONE_CSS, 'css')}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-cyan-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  {copiedType === 'css' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedType === 'css' ? 'Tersalin ke Clipboard!' : 'Salin Kode CSS'}
                </button>
              </div>
              <pre className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-300 overflow-x-auto whitespace-pre leading-relaxed select-text">
                {STANDALONE_CSS}
              </pre>
            </div>
          )}

          {activeTab === 'js' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400">File: project/script.js</span>
                <button
                  onClick={() => copyToClipboard(STANDALONE_JS, 'js')}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-yellow-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  {copiedType === 'js' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedType === 'js' ? 'Tersalin ke Clipboard!' : 'Salin Kode JS'}
                </button>
              </div>
              <pre className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-300 overflow-x-auto whitespace-pre leading-relaxed select-text">
                {STANDALONE_JS}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 text-center text-xs text-neutral-400">
          Kode di atas 100% Vanilla (HTML + CSS + JS Murni). Dapat di-copy paste langsung ke Android Code Editor.
        </div>
      </div>
    </div>
  );
};
