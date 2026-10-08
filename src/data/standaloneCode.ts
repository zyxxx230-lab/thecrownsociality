export const STANDALONE_HTML = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <!-- meta viewport: wajib agar tampilan di HP pas & tidak zoom otomatis saat tombol dipencet cepat -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>The Crown Sociality Minigames</title>
  <!-- Menghubungkan file styling CSS -->
  <link rel="stylesheet" href="style.css" />
</head>
<body>

  <!-- ================= LAYAR 1: START SCREEN ================= -->
  <div id="screen-start" class="screen active">
    <div class="crown-icon">👑</div>
    <h1 class="game-title">The Crown Sociality</h1>
    <p class="game-subtitle">1 VS 1 TACTICAL FIGHTING - CPU HARD</p>
    
    <div class="url-config-box">
      <label for="win-url-input">🔗 Link Hadiah / Tujuan Saat Menang (WIN):</label>
      <input type="text" id="win-url-input" value="https://google.com" placeholder="https://..." />
      <small>Bisa diubah ke link Instagram, WhatsApp, atau website buatanmu!</small>
    </div>

    <button id="btn-start" class="btn btn-primary">⚔️ MULAI PERMAINAN</button>
  </div>

  <!-- ================= LAYAR 2: PILIH KARAKTER ================= -->
  <div id="screen-select" class="screen">
    <h2>👑 PILIH PENDEKAR MAHKOTA</h2>
    <p class="info-text">Pilih gaya bertarungmu untuk menghadapi CPU Hard</p>
    
    <div class="character-grid" id="character-grid">
      <!-- Daftar kartu karakter akan di-generate otomatis oleh JavaScript -->
    </div>

    <div class="select-actions">
      <button id="btn-back-start" class="btn btn-secondary">⬅️ KEMBALI</button>
      <button id="btn-confirm-char" class="btn btn-primary" disabled>MASUK ARENA ⚔️</button>
    </div>
  </div>

  <!-- ================= LAYAR 3: ARENA PERTARUNGAN ================= -->
  <div id="screen-battle" class="screen">
    
    <!-- Top Bar: Status HP, Nama, dan Timer -->
    <header class="battle-header">
      <!-- Status Player 1 -->
      <div class="fighter-hud player-hud">
        <div class="fighter-info">
          <span class="fighter-tag">P1 (KAMU)</span>
          <span id="p1-name" class="fighter-name">Knight</span>
        </div>
        <div class="bar-container hp-bar-bg">
          <div id="p1-hp-bar" class="bar-fill hp-fill"></div>
          <span id="p1-hp-text" class="bar-text">300/300</span>
        </div>
        <div class="bar-container mana-bar-bg">
          <div id="p1-mana-bar" class="bar-fill mana-fill"></div>
          <span class="bar-text">SPECIAL ENERGY</span>
        </div>
      </div>

      <!-- Timer & Jarak Indikator di Tengah -->
      <div class="hud-center">
        <div id="battle-timer" class="timer-display">99</div>
        <div id="distance-indicator" class="distance-badge">Jarak: 50m</div>
      </div>

      <!-- Status CPU Hard -->
      <div class="fighter-hud cpu-hud">
        <div class="fighter-info">
          <span class="fighter-tag cpu-tag">CPU (HARD)</span>
          <span id="cpu-name" class="fighter-name">Lord Malakor</span>
        </div>
        <div class="bar-container hp-bar-bg">
          <div id="cpu-hp-bar" class="bar-fill hp-fill"></div>
          <span id="cpu-hp-text" class="bar-text">300/300</span>
        </div>
        <div class="bar-container mana-bar-bg">
          <div id="cpu-mana-bar" class="bar-fill mana-fill cpu-mana"></div>
          <span class="bar-text">CPU ENERGY</span>
        </div>
      </div>
    </header>

    <!-- Panggung / Area Pertarungan Visual -->
    <main class="battle-stage" id="battle-stage">
      <div class="stage-bg-art">🏰 THE ROYAL THRONE</div>
      
      <!-- Pemberitahuan aksi di tengah layar (FIGHT, MISS, PARRY) -->
      <div id="combat-toast" class="combat-toast">SIAP?</div>

      <!-- Karakter Player -->
      <div id="fighter-player" class="fighter-sprite">
        <div class="status-bubble" id="p1-status"></div>
        <div class="sprite-body" id="p1-avatar">👑</div>
        <div class="sprite-shadow"></div>
      </div>

      <!-- Karakter CPU -->
      <div id="fighter-cpu" class="fighter-sprite">
        <div class="status-bubble" id="cpu-status"></div>
        <div class="sprite-body" id="cpu-avatar">💀</div>
        <div class="sprite-shadow"></div>
      </div>
    </main>

    <!-- Kontrol Layar Sentuh Mobile Android -->
    <footer class="battle-controls">
      <!-- Tombol Arah (Jari Kiri) -->
      <div class="control-cluster movement-cluster">
        <button id="btn-move-left" class="touch-btn move-btn" aria-label="Mundur">⬅️</button>
        <button id="btn-move-right" class="touch-btn move-btn" aria-label="Maju">➡️</button>
      </div>

      <!-- Tombol Aksi (Jari Kanan) -->
      <div class="control-cluster action-cluster">
        <button id="btn-block" class="touch-btn block-btn" aria-label="Tangkis">
          <span class="btn-icon">🛡️</span>
          <span class="btn-label">TANGKIS</span>
        </button>
        <button id="btn-attack" class="touch-btn attack-btn" aria-label="Serang">
          <span class="btn-icon">👊</span>
          <span class="btn-label">SERANG</span>
        </button>
        <button id="btn-special" class="touch-btn special-btn" aria-label="Jurus Spesial">
          <span class="btn-icon">⚡</span>
          <span class="btn-label">SPESIAL</span>
        </button>
      </div>
    </footer>
  </div>

  <!-- ================= LAYAR 4: HASIL (WIN / LOSE) ================= -->
  <div id="screen-result" class="screen">
    <div class="result-card">
      <div id="result-icon" class="result-badge">🏆</div>
      <h2 id="result-title">KAMU MENANG!</h2>
      <p id="result-desc">Mahkota Kerajaan berhasil dipertahankan dari cengkeraman musuh.</p>
      
      <!-- Box Redirect Khusus Pemenang -->
      <div id="win-redirect-section" class="win-box">
        <p class="redirect-info">🎉 Selamat! Kamu berhak atas hadiah/tautan kemenangan.</p>
        <p id="countdown-text" class="countdown-highlight">Membuka tautan otomatis dalam 3 detik...</p>
        <a id="win-link-button" href="#" target="_blank" class="btn btn-gold">
          🚀 Buka Link Kemenangan Sekarang
        </a>
      </div>

      <div class="result-buttons">
        <button id="btn-rematch" class="btn btn-primary">🔄 TARUNG ULANG</button>
        <button id="btn-menu" class="btn btn-secondary">🏠 MENU UTAMA</button>
      </div>
    </div>
  </div>

  <!-- Menghubungkan Logika Game JavaScript -->
  <script src="script.js"></script>
</body>
</html>`;

export const STANDALONE_CSS = `/* ================= RESET & DASAR ================= */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent; /* Hilangkan kotak biru bawaan browser Android saat disentuh */
  user-select: none; /* Mencegah teks terblok saat tombol ditekan cepat */
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #0b0f19;
  color: #f1f5f9;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
}

/* ================= SISTEM LAYAR (SCREENS) ================= */
.screen {
  display: none; /* Semua layar disembunyikan secara default */
  width: 100%;
  height: 100%;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
}

.screen.active {
  display: flex; /* Hanya layar yang memiliki class .active yang muncul */
}

/* ================= 1. START SCREEN ================= */
#screen-start {
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, #1e1b4b 0%, #070913 100%);
  text-align: center;
  padding: 20px;
}

.crown-icon {
  font-size: 72px;
  animation: floatAnim 2.5s ease-in-out infinite alternate;
}

@keyframes floatAnim {
  0% { transform: translateY(0px) rotate(0deg); }
  100% { transform: translateY(-12px) rotate(4deg); }
}

.game-title {
  font-size: 32px;
  font-weight: 800;
  color: #fbbf24;
  text-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
  margin-top: 10px;
  letter-spacing: 1px;
}

.game-subtitle {
  font-size: 13px;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 3px;
  margin-bottom: 24px;
}

.url-config-box {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 16px;
  max-width: 360px;
  width: 100%;
  margin-bottom: 24px;
  text-align: left;
}

.url-config-box label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 8px;
}

.url-config-box input {
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #475569;
  background: #0f172a;
  color: #38bdf8;
  font-size: 14px;
  outline: none;
}

.url-config-box small {
  display: block;
  color: #64748b;
  font-size: 11px;
  margin-top: 6px;
}

/* ================= 2. CHARACTER SELECT ================= */
#screen-select {
  padding: 24px 16px;
  background: #0b0f19;
  align-items: center;
}

#screen-select h2 {
  color: #fbbf24;
  font-size: 20px;
  margin-bottom: 4px;
}

.info-text {
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 16px;
}

.character-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  width: 100%;
  max-width: 440px;
  flex: 1;
  overflow-y: auto;
}

.char-card {
  background: #1e293b;
  border: 2px solid #334155;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: transform 0.15s, border-color 0.15s;
}

.char-card.selected {
  border-color: #fbbf24;
  background: #283548;
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.3);
  transform: scale(1.02);
}

.char-avatar {
  font-size: 38px;
  margin-bottom: 6px;
}

.char-name {
  font-weight: 700;
  font-size: 14px;
  color: #f8fafc;
}

.char-stat {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 4px;
}

.select-actions {
  display: flex;
  gap: 12px;
  width: 100%;
  max-width: 440px;
  margin-top: 14px;
}

/* ================= 3. ARENA PERTARUNGAN ================= */
#screen-battle {
  background: #090d16;
  justify-content: space-between;
}

/* Top HUD (Bar Nyawa & Status) */
.battle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background: rgba(15, 23, 42, 0.95);
  border-bottom: 1px solid #1e293b;
  gap: 8px;
  z-index: 10;
}

.fighter-hud {
  flex: 1;
}

.fighter-info {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.fighter-tag {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  background: #0284c7;
  color: white;
  font-weight: 700;
}

.cpu-tag {
  background: #dc2626;
}

.fighter-name {
  font-size: 12px;
  font-weight: 700;
}

.hud-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
}

.timer-display {
  font-size: 22px;
  font-weight: 900;
  color: #fbbf24;
  font-family: monospace;
}

.distance-badge {
  font-size: 10px;
  color: #38bdf8;
  font-weight: 600;
  background: #0f172a;
  padding: 2px 6px;
  border-radius: 10px;
  border: 1px solid #1e293b;
}

.bar-container {
  height: 12px;
  background: #334155;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  margin-bottom: 3px;
}

.mana-bar-bg {
  height: 6px;
}

.bar-fill {
  height: 100%;
  width: 100%;
  transition: width 0.15s ease-out;
}

.hp-fill {
  background: linear-gradient(90deg, #22c55e, #16a34a);
}

.mana-fill {
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  width: 0%;
}

.cpu-mana {
  background: linear-gradient(90deg, #a855f7, #ec4899);
}

.bar-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 9px;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 2px rgba(0,0,0,0.8);
}

/* Arena Panggung Karakter */
.battle-stage {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at 50% 60%, #1e1b4b 0%, #090d16 100%);
  border-bottom: 3px solid #334155;
}

.stage-bg-art {
  position: absolute;
  top: 15%;
  width: 100%;
  text-align: center;
  font-size: 28px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.04);
  pointer-events: none;
}

.combat-toast {
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 22px;
  font-weight: 900;
  color: #fbbf24;
  text-shadow: 0 2px 10px rgba(0,0,0,0.8);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s, transform 0.2s;
}

.combat-toast.show {
  opacity: 1;
  transform: translateX(-50%) scale(1.1);
}

/* Karakter Sprite */
.fighter-sprite {
  position: absolute;
  bottom: 22px;
  width: 70px;
  height: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  transition: transform 0.08s ease-out;
}

.sprite-body {
  font-size: 56px;
  transition: transform 0.1s ease;
}

.sprite-shadow {
  width: 50px;
  height: 10px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  margin-top: -6px;
}

/* Status Bubble (Shield, Punch effect) */
.status-bubble {
  font-size: 20px;
  min-height: 24px;
}

/* Animasi Serang & Kena Pukul */
.attacking {
  transform: scale(1.15) translateY(-5px);
}

.blocking {
  filter: drop-shadow(0 0 10px #38bdf8);
}

.hit-hurt {
  animation: hurtShake 0.2s ease-in-out;
}

@keyframes hurtShake {
  0% { transform: translateX(0); filter: brightness(2) saturate(2); }
  25% { transform: translateX(-8px); }
  50% { transform: translateX(8px); }
  75% { transform: translateX(-4px); }
  100% { transform: translateX(0); filter: brightness(1); }
}

/* Animasi Kemenangan Sprite Juara (Victory Keyframe Animation) */
.victory-winner {
  animation: victoryCelebration 1.25s cubic-bezier(0.28, 0.84, 0.42, 1) infinite !important;
}

@keyframes victoryCelebration {
  0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
  15% { transform: translateY(5px) scale(1.15, 0.85); }
  35% { transform: translateY(-30px) scale(0.9, 1.15) rotate(-4deg); }
  50% { transform: translateY(-34px) scale(1) rotate(4deg); }
  70% { transform: translateY(-4px) scale(1.1, 0.9) rotate(-1deg); }
  85% { transform: translateY(-12px) scale(0.95, 1.05) rotate(1deg); }
}

/* Screen Shake Effect saat Serangan Berat Masuk */
.screen-shake {
  animation: screenShakeHeavy 0.42s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes screenShakeHeavy {
  0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
  10% { transform: translate3d(-10px, -6px, 0) rotate(-1.2deg); }
  20% { transform: translate3d(9px, 8px, 0) rotate(1.4deg); }
  30% { transform: translate3d(-8px, -5px, 0) rotate(-1deg); }
  45% { transform: translate3d(6px, 5px, 0) rotate(0.8deg); }
  60% { transform: translate3d(-4px, -3px, 0) rotate(-0.4deg); }
  80% { transform: translate3d(2px, 2px, 0) rotate(0.2deg); }
}

/* ================= 4. KONTROL TOUCH ANDROID ================= */
.battle-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px 18px 14px;
  background: #0f172a;
  border-top: 1px solid #1e293b;
  gap: 12px;
}

.control-cluster {
  display: flex;
  gap: 8px;
}

.touch-btn {
  background: #1e293b;
  color: white;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 12px;
  font-weight: 700;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  touch-action: manipulation;
  cursor: pointer;
  transition: transform 0.08s, background-color 0.08s;
  min-width: 62px;
  min-height: 62px;
}

.touch-btn:active {
  transform: scale(0.92);
}

.move-btn {
  font-size: 26px;
  width: 60px;
  height: 60px;
  background: #1e293b;
  border: 2px solid #475569;
}

.move-btn:active {
  background: #334155;
}

.attack-btn {
  background: #b91c1c;
  border: 2px solid #ef4444;
}

.attack-btn:active {
  background: #dc2626;
}

.block-btn {
  background: #0369a1;
  border: 2px solid #38bdf8;
}

.block-btn:active {
  background: #0284c7;
}

.special-btn {
  background: #854d0e;
  border: 2px solid #eab308;
  opacity: 0.5;
  cursor: not-allowed;
}

.special-btn.ready {
  background: #ca8a04;
  border-color: #facc15;
  opacity: 1;
  cursor: pointer;
  animation: pulseGold 1s infinite alternate;
}

@keyframes pulseGold {
  0% { box-shadow: 0 0 5px #eab308; }
  100% { box-shadow: 0 0 16px #facc15; }
}

.btn-icon {
  font-size: 20px;
}

.btn-label {
  font-size: 9px;
  margin-top: 2px;
  font-weight: 800;
  letter-spacing: 0.5px;
}

/* ================= 5. RESULT SCREEN ================= */
#screen-result {
  align-items: center;
  justify-content: center;
  background: rgba(7, 10, 19, 0.95);
  padding: 20px;
}

.result-card {
  background: #1e293b;
  border: 2px solid #334155;
  border-radius: 16px;
  padding: 24px;
  max-width: 380px;
  width: 100%;
  text-align: center;
}

.result-badge {
  font-size: 60px;
  margin-bottom: 8px;
}

#result-title {
  font-size: 26px;
  font-weight: 900;
  color: #fbbf24;
  margin-bottom: 8px;
}

#result-desc {
  font-size: 13px;
  color: #cbd5e1;
  margin-bottom: 20px;
}

.win-box {
  background: #142a1f;
  border: 1px solid #16a34a;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 18px;
  display: none;
}

.win-box.show {
  display: block;
}

.redirect-info {
  font-size: 12px;
  color: #86efac;
  margin-bottom: 6px;
}

.countdown-highlight {
  font-size: 14px;
  font-weight: 800;
  color: #facc15;
  margin-bottom: 10px;
}

.result-buttons {
  display: flex;
  gap: 10px;
}

/* ================= TOMBOL UMUM ================= */
.btn {
  flex: 1;
  padding: 12px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: transform 0.1s, opacity 0.1s;
}

.btn:active {
  transform: scale(0.96);
}

.btn-primary {
  background: linear-gradient(135deg, #eab308, #ca8a04);
  color: #0f172a;
}

.btn-secondary {
  background: #334155;
  color: white;
}

.btn-gold {
  background: #fbbf24;
  color: #0f172a;
  width: 100%;
  margin-top: 6px;
}
`;

export const STANDALONE_JS = `// ==========================================
// 1. DATA KARAKTER & KONFIGURASI GAME
// ==========================================

const CHARACTERS = [
  {
    id: "arthur",
    name: "Arthur Crown",
    avatar: "👑",
    role: "Ksatria Seimbang",
    hp: 300,
    attack: 20,
    speed: 7,
    specialName: "Excalibur Slash"
  },
  {
    id: "lyra",
    name: "Lyra Shadow",
    avatar: "🦅",
    role: "Ninja Cepat",
    hp: 260,
    attack: 24,
    speed: 10,
    specialName: "Shadow Flurry"
  },
  {
    id: "roland",
    name: "Roland Iron",
    avatar: "🛡️",
    role: "Tank Pertahanan",
    hp: 360,
    attack: 16,
    speed: 5,
    specialName: "Iron Fortress"
  },
  {
    id: "ignis",
    name: "Ignis Fire",
    avatar: "🔥",
    role: "Pendekar Api",
    hp: 270,
    attack: 26,
    speed: 8,
    specialName: "Crimson Dragon"
  }
];

// Musuh CPU dengan kecerdasan Hard
const CPU_DATA = {
  name: "Lord Malakor",
  avatar: "💀",
  hp: 320,
  attack: 22,
  speed: 7,
  specialName: "Dark Rupture"
};

// ==========================================
// 2. STATE / KONDISI GAME
// ==========================================

let gameState = {
  screen: "start",          // 'start' | 'select' | 'battle' | 'result'
  playerChar: null,         // Karakter yang dipilih pemain
  
  // Posisi posisi horizontal di arena (dalam satuan piksel relatif 0 - 100%)
  playerX: 18,              // Persentase posisi pemain dari kiri (18%)
  cpuX: 82,                 // Persentase posisi musuh dari kiri (82%)
  
  // HP & Status Tempur
  playerHp: 300,
  playerMaxHp: 300,
  playerMana: 0,            // 0 sampai 100 (untuk Special Attack)
  playerIsBlocking: false,

  cpuHp: 320,
  cpuMaxHp: 320,
  cpuMana: 0,
  cpuIsBlocking: false,

  // Timer & Loop
  timer: 99,
  gameLoopInterval: null,
  timerInterval: null,
  isGameOver: false,

  // Link Redirect Hadiah
  winUrl: "https://google.com",
  countdownTimer: null
};

// ==========================================
// 3. ELEMEN DOM (HTML)
// ==========================================

const screens = {
  start: document.getElementById("screen-start"),
  select: document.getElementById("screen-select"),
  battle: document.getElementById("screen-battle"),
  result: document.getElementById("screen-result")
};

// Tombol navigasi
const btnStart = document.getElementById("btn-start");
const btnBackStart = document.getElementById("btn-back-start");
const btnConfirmChar = document.getElementById("btn-confirm-char");
const btnRematch = document.getElementById("btn-rematch");
const btnMenu = document.getElementById("btn-menu");
const winUrlInput = document.getElementById("win-url-input");

// Elemen HUD Battle
const p1HpBar = document.getElementById("p1-hp-bar");
const p1HpText = document.getElementById("p1-hp-text");
const p1ManaBar = document.getElementById("p1-mana-bar");
const p1NameText = document.getElementById("p1-name");

const cpuHpBar = document.getElementById("cpu-hp-bar");
const cpuHpText = document.getElementById("cpu-hp-text");
const cpuManaBar = document.getElementById("cpu-mana-bar");
const cpuNameText = document.getElementById("cpu-name");

const battleTimerEl = document.getElementById("battle-timer");
const distanceIndicator = document.getElementById("distance-indicator");
const combatToast = document.getElementById("combat-toast");

// Sprite Elemen
const fighterPlayer = document.getElementById("fighter-player");
const fighterCpu = document.getElementById("fighter-cpu");
const p1Avatar = document.getElementById("p1-avatar");
const cpuAvatar = document.getElementById("cpu-avatar");
const p1Status = document.getElementById("p1-status");
const cpuStatus = document.getElementById("cpu-status");

// Kontrol Tombol Layar Sentuh
const btnMoveLeft = document.getElementById("btn-move-left");
const btnMoveRight = document.getElementById("btn-move-right");
const btnAttack = document.getElementById("btn-attack");
const btnBlock = document.getElementById("btn-block");
const btnSpecial = document.getElementById("btn-special");

// ==========================================
// 4. SOUND ENGINE (Web Audio API Murni)
// ==========================================

const AudioContextClass = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function playSound(type) {
  try {
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    if (type === "hit") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.12);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === "block") {
      osc.type = "square";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === "special") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    }
  } catch (e) {
    // Audio fallback aman jika browser memblokir audio
  }
}

// ==========================================
// 5. NAVIGASI LAYAR
// ==========================================

function switchScreen(screenName) {
  gameState.screen = screenName;
  Object.values(screens).forEach(screen => screen.classList.remove("active"));
  screens[screenName].classList.add("active");
}

// Render Kartu Karakter di Layar Pilih
function renderCharacterSelect() {
  const container = document.getElementById("character-grid");
  container.innerHTML = "";
  
  CHARACTERS.forEach(char => {
    const card = document.createElement("div");
    card.className = "char-card" + (gameState.playerChar?.id === char.id ? " selected" : "");
    card.innerHTML = \`
      <div class="char-avatar">\${char.avatar}</div>
      <div class="char-name">\${char.name}</div>
      <div class="char-stat">\${char.role}</div>
      <div class="char-stat">HP: \${char.hp} | ATK: \${char.attack}</div>
    \`;
    card.addEventListener("click", () => {
      gameState.playerChar = char;
      document.querySelectorAll(".char-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      btnConfirmChar.removeAttribute("disabled");
    });
    container.appendChild(card);
  });
}

// ==========================================
// 6. LOGIKA PERTARUNGAN (COMBAT SYSTEM)
// ==========================================

// Menghitung jarak antara pemain dan musuh
function getDistance() {
  return Math.abs(gameState.cpuX - gameState.playerX);
}

// Update tampilan posisi dan HUD
function updateDisplay() {
  fighterPlayer.style.left = gameState.playerX + "%";
  fighterCpu.style.left = (gameState.cpuX - 10) + "%";

  // HP Bar
  const p1Percent = Math.max(0, (gameState.playerHp / gameState.playerMaxHp) * 100);
  const cpuPercent = Math.max(0, (gameState.cpuHp / gameState.cpuMaxHp) * 100);
  p1HpBar.style.width = p1Percent + "%";
  cpuHpBar.style.width = cpuPercent + "%";
  p1HpText.textContent = \`\${Math.ceil(gameState.playerHp)}/\${gameState.playerMaxHp}\`;
  cpuHpText.textContent = \`\${Math.ceil(gameState.cpuHp)}/\${gameState.cpuMaxHp}\`;

  // Mana Bar
  p1ManaBar.style.width = gameState.playerMana + "%";
  cpuManaBar.style.width = gameState.cpuMana + "%";

  if (gameState.playerMana >= 100) {
    btnSpecial.classList.add("ready");
  } else {
    btnSpecial.classList.remove("ready");
  }

  // Jarak
  const dist = Math.round(getDistance());
  distanceIndicator.textContent = \`Jarak: \${dist}%\`;
  if (dist <= 18) {
    distanceIndicator.style.color = "#ef4444";
    distanceIndicator.textContent = \`Jarak: \${dist}% [DEKAT!]\`;
  } else {
    distanceIndicator.style.color = "#38bdf8";
  }
}

// Menampilkan pesan pop-up singkat di arena
function showToast(msg) {
  combatToast.textContent = msg;
  combatToast.classList.add("show");
  setTimeout(() => combatToast.classList.remove("show"), 600);
}

// ==========================================
// 7. AKSI PLAYER (SERANG / TANGKIS / JURUS)
// ==========================================

function playerMove(direction) {
  if (gameState.isGameOver) return;
  const speed = (gameState.playerChar.speed || 7) * 0.45;
  
  if (direction === "left") {
    gameState.playerX = Math.max(4, gameState.playerX - speed);
  } else if (direction === "right") {
    // Jangan izinkan melewati musuh
    gameState.playerX = Math.min(gameState.cpuX - 12, gameState.playerX + speed);
  }
  updateDisplay();
}

function playerAttack() {
  if (gameState.isGameOver) return;
  const distance = getDistance();

  // ATURAN WAJIB: Harus dekat untuk bisa memukul!
  if (distance > 18) {
    showToast("TERLALU JAUH! DEKATI MUSUH");
    fighterPlayer.classList.add("attacking");
    setTimeout(() => fighterPlayer.classList.remove("attacking"), 150);
    return;
  }

  // Animasi serang
  fighterPlayer.classList.add("attacking");
  setTimeout(() => fighterPlayer.classList.remove("attacking"), 150);

  // Jika musuh menangkis:
  if (gameState.cpuIsBlocking) {
    const reducedDmg = Math.ceil(gameState.playerChar.attack * 0.25);
    gameState.cpuHp = Math.max(0, gameState.cpuHp - reducedDmg);
    playSound("block");
    showToast("DITANGKIS CPU! -" + reducedDmg);
  } else {
    // Serangan masuk telak!
    const dmg = gameState.playerChar.attack;
    gameState.cpuHp = Math.max(0, gameState.cpuHp - dmg);
    fighterCpu.classList.add("hit-hurt");
    setTimeout(() => fighterCpu.classList.remove("hit-hurt"), 250);
    playSound("hit");
    showToast("-" + dmg);
    // Tambah mana
    gameState.playerMana = Math.min(100, gameState.playerMana + 20);
  }

  updateDisplay();
  checkGameOver();
}

function playerBlock(active) {
  if (gameState.isGameOver) return;
  gameState.playerIsBlocking = active;
  if (active) {
    fighterPlayer.classList.add("blocking");
    p1Status.textContent = "🛡️";
  } else {
    fighterPlayer.classList.remove("blocking");
    p1Status.textContent = "";
  }
}

function playerSpecial() {
  if (gameState.isGameOver || gameState.playerMana < 100) return;
  const distance = getDistance();

  if (distance > 22) {
    showToast("JURUS BUTUH JARAK LEBIH DEKAT!");
    return;
  }

  gameState.playerMana = 0;
  playSound("special");
  showToast("💥 " + gameState.playerChar.specialName + "!");
  
  // Spesial tembus block atau memberi damage besar
  const dmg = 50;
  gameState.cpuHp = Math.max(0, gameState.cpuHp - dmg);
  fighterCpu.classList.add("hit-hurt");
  setTimeout(() => fighterCpu.classList.remove("hit-hurt"), 300);

  updateDisplay();
  checkGameOver();
}

// ==========================================
// 8. LOGIKA AI CPU (HARD DIFFICULTY)
// ==========================================

function cpuThinkAndAct() {
  if (gameState.isGameOver) return;

  const distance = getDistance();
  const cpuSpeed = CPU_DATA.speed * 0.4;

  // 1. Logika Jarak: Jika jauh, CPU mendekat secara agresif
  if (distance > 18) {
    gameState.cpuX = Math.max(gameState.playerX + 12, gameState.cpuX - cpuSpeed);
    gameState.cpuIsBlocking = false;
    cpuStatus.textContent = "";
  } 
  // 2. Jika sudah dekat, CPU bertarung secara cerdas (Tangkis / Serang / Mundur)
  else {
    const decision = Math.random();

    // CPU punya peluang 40% menangkis jika mendeteksi ancaman
    if (decision < 0.35) {
      gameState.cpuIsBlocking = true;
      fighterCpu.classList.add("blocking");
      cpuStatus.textContent = "🛡️";
    } 
    // CPU memakai serangan spesial jika energinya penuh
    else if (gameState.cpuMana >= 100) {
      gameState.cpuMana = 0;
      playSound("special");
      showToast("💀 DARK RUPTURE DARI CPU!");
      
      const dmg = 45;
      if (gameState.playerIsBlocking) {
        gameState.playerHp = Math.max(0, gameState.playerHp - 15);
        showToast("KAMU MENANGKIS SPESIAL! -15");
      } else {
        gameState.playerHp = Math.max(0, gameState.playerHp - dmg);
        fighterPlayer.classList.add("hit-hurt");
        setTimeout(() => fighterPlayer.classList.remove("hit-hurt"), 250);
      }
    } 
    // CPU Melancarkan Pukulan Biasa
    else if (decision < 0.8) {
      gameState.cpuIsBlocking = false;
      cpuStatus.textContent = "";
      
      fighterCpu.classList.add("attacking");
      setTimeout(() => fighterCpu.classList.remove("attacking"), 150);

      if (gameState.playerIsBlocking) {
        const reduced = Math.ceil(CPU_DATA.attack * 0.25);
        gameState.playerHp = Math.max(0, gameState.playerHp - reduced);
        playSound("block");
        showToast("KAMU MENANGKIS! -" + reduced);
      } else {
        const dmg = CPU_DATA.attack;
        gameState.playerHp = Math.max(0, gameState.playerHp - dmg);
        fighterPlayer.classList.add("hit-hurt");
        setTimeout(() => fighterPlayer.classList.remove("hit-hurt"), 250);
        playSound("hit");
        showToast("CPU MEMUKUL -" + dmg);
        gameState.cpuMana = Math.min(100, gameState.cpuMana + 15);
      }
    } 
    // CPU Taktik Mundur / Spacing agar sulit dipukul terus-menerus
    else {
      gameState.cpuX = Math.min(94, gameState.cpuX + cpuSpeed * 1.5);
      gameState.cpuIsBlocking = false;
      cpuStatus.textContent = "";
    }
  }

  updateDisplay();
  checkGameOver();
}

// ==========================================
// 9. AKHIR PERMAINAN (WIN / LOSE & REDIRECT)
// ==========================================

function checkGameOver() {
  if (gameState.isGameOver) return;

  if (gameState.playerHp <= 0) {
    endGame("lose");
  } else if (gameState.cpuHp <= 0) {
    endGame("win");
  }
}

function endGame(result) {
  gameState.isGameOver = true;
  clearInterval(gameState.gameLoopInterval);
  clearInterval(gameState.timerInterval);

  const resultTitle = document.getElementById("result-title");
  const resultDesc = document.getElementById("result-desc");
  const resultIcon = document.getElementById("result-icon");
  const winRedirectSection = document.getElementById("win-redirect-section");
  const winLinkButton = document.getElementById("win-link-button");
  const countdownText = document.getElementById("countdown-text");

  if (result === "win") {
    resultIcon.textContent = "👑";
    resultTitle.textContent = "VICTORY! KAMU JUARA!";
    resultDesc.textContent = "Hebat! Kamu berhasil menaklukkan CPU Hard dalam The Crown Sociality!";
    
    // Tampilkan bagian redirect link
    winRedirectSection.classList.add("show");
    const targetUrl = gameState.winUrl || "https://google.com";
    winLinkButton.href = targetUrl;

    // Hitung mundur 3 detik untuk membuka link otomatis
    let countdown = 3;
    countdownText.textContent = \`Membuka link hadiah dalam \${countdown} detik...\`;
    
    gameState.countdownTimer = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        countdownText.textContent = \`Membuka link hadiah dalam \${countdown} detik...\`;
      } else {
        clearInterval(gameState.countdownTimer);
        countdownText.textContent = "Membuka link...";
        window.open(targetUrl, "_blank");
      }
    }, 1000);

  } else {
    resultIcon.textContent = "💀";
    resultTitle.textContent = "DEFEAT! KAMU KALAH!";
    resultDesc.textContent = "CPU Hard berhasil memojokkanmu. Ingat gunakan tombol Tangkis [🛡️] saat CPU menyerang!";
    winRedirectSection.classList.remove("show");
    clearInterval(gameState.countdownTimer);
  }

  switchScreen("result");
}

// Memulai Ronde Pertarungan
function startBattle() {
  if (!gameState.playerChar) return;

  // Reset Data Tempur
  gameState.isGameOver = false;
  gameState.playerHp = gameState.playerChar.hp;
  gameState.playerMaxHp = gameState.playerChar.hp;
  gameState.playerMana = 0;
  gameState.playerX = 18;
  gameState.playerIsBlocking = false;

  gameState.cpuHp = CPU_DATA.hp;
  gameState.cpuMaxHp = CPU_DATA.hp;
  gameState.cpuMana = 0;
  gameState.cpuX = 82;
  gameState.cpuIsBlocking = false;

  gameState.timer = 99;

  // Set teks nama & avatar
  p1NameText.textContent = gameState.playerChar.name;
  p1Avatar.textContent = gameState.playerChar.avatar;
  cpuNameText.textContent = CPU_DATA.name;
  cpuAvatar.textContent = CPU_DATA.avatar;

  switchScreen("battle");
  updateDisplay();
  showToast("ROUND 1... FIGHT!");

  // Interval loop game: CPU berpikir setiap 380 milidetik (Hard reaction)
  gameState.gameLoopInterval = setInterval(cpuThinkAndAct, 380);

  // Interval timer waktu mundur
  gameState.timerInterval = setInterval(() => {
    gameState.timer--;
    battleTimerEl.textContent = gameState.timer;
    if (gameState.timer <= 0) {
      if (gameState.playerHp > gameState.cpuHp) endGame("win");
      else endGame("lose");
    }
  }, 1000);
}

// ==========================================
// 10. EVENT LISTENERS
// ==========================================

btnStart.addEventListener("click", () => {
  // Simpan input link yang diketik user
  const inputUrl = winUrlInput.value.trim();
  if (inputUrl) gameState.winUrl = inputUrl;
  
  renderCharacterSelect();
  switchScreen("select");
});

btnBackStart.addEventListener("click", () => switchScreen("start"));
btnConfirmChar.addEventListener("click", startBattle);
btnRematch.addEventListener("click", startBattle);
btnMenu.addEventListener("click", () => switchScreen("start"));

// Kontrol Arah Layar Sentuh & Mouse
btnMoveLeft.addEventListener("touchstart", (e) => { e.preventDefault(); playerMove("left"); });
btnMoveLeft.addEventListener("click", () => playerMove("left"));

btnMoveRight.addEventListener("touchstart", (e) => { e.preventDefault(); playerMove("right"); });
btnMoveRight.addEventListener("click", () => playerMove("right"));

// Kontrol Serang
btnAttack.addEventListener("touchstart", (e) => { e.preventDefault(); playerAttack(); });
btnAttack.addEventListener("click", playerAttack);

// Kontrol Tangkis (Tekan dan Tahan)
btnBlock.addEventListener("touchstart", (e) => { e.preventDefault(); playerBlock(true); });
btnBlock.addEventListener("touchend", (e) => { e.preventDefault(); playerBlock(false); });
btnBlock.addEventListener("mousedown", () => playerBlock(true));
btnBlock.addEventListener("mouseup", () => playerBlock(false));

// Kontrol Spesial
btnSpecial.addEventListener("touchstart", (e) => { e.preventDefault(); playerSpecial(); });
btnSpecial.addEventListener("click", playerSpecial);

// Dukungan Keyboard Desktop (Bisa dimainkan di Komputer / Laptop juga!)
window.addEventListener("keydown", (e) => {
  if (gameState.screen !== "battle") return;
  if (e.key === "ArrowLeft" || e.key === "a") playerMove("left");
  if (e.key === "ArrowRight" || e.key === "d") playerMove("right");
  if (e.key === "j" || e.key === "z") playerAttack();
  if (e.key === "k" || e.key === "x") playerBlock(true);
  if (e.key === "l" || e.key === "c") playerSpecial();
});

window.addEventListener("keyup", (e) => {
  if (e.key === "k" || e.key === "x") playerBlock(false);
});
`;
