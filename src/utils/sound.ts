// Web Audio API Synthesizer for Retro, Sword Combat Sounds & Epic Royal Soundtrack
class SoundController {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private bgmGainNode: GainNode | null = null;
  private isBgmActive: boolean = false;
  private bgmIntervalId: number | null = null;
  private bgmStep: number = 0;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // =========================================================================
  // EPIC ROYAL SOUNDTRACK (Web Audio Procedural Orchestral & Brass Music Loop)
  // Royal Theme in D-Minor / F-Major: Majestic Fanfares, Timpani Drums, Strings
  // =========================================================================
  startRoyalBgm() {
    if (!this.enabled || this.isBgmActive) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      this.isBgmActive = true;
      this.bgmGainNode = this.ctx.createGain();
      this.bgmGainNode.gain.setValueAtTime(0.28, this.ctx.currentTime);
      this.bgmGainNode.connect(this.ctx.destination);

      this.bgmStep = 0;
      this.scheduleBgmLoop();
    } catch {
      // Audio fallback
    }
  }

  stopRoyalBgm() {
    this.isBgmActive = false;
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
    if (this.bgmGainNode && this.ctx) {
      try {
        this.bgmGainNode.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      } catch {}
    }
  }

  toggleRoyalBgm(): boolean {
    if (this.isBgmActive) {
      this.stopRoyalBgm();
      return false;
    } else {
      this.startRoyalBgm();
      return true;
    }
  }

  isBgmPlaying(): boolean {
    return this.isBgmActive;
  }

  private scheduleBgmLoop() {
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
    }

    // BPM: 112 (~535ms per beat, 16 steps per bar cycle)
    const beatTime = 0.27; // sixteenth note length

    // Epic Royal Motif notes (frequencies in Hz)
    // Progression: Dm -> Bb -> F -> C / Am -> Dm
    const chordNotes = [
      // Bar 1 & 2: Dm - Royal Fanfare Call
      [146.83, 220.00, 293.66], // D3, A3, D4
      [146.83, 220.00, 349.23], // D3, A3, F4
      [146.83, 261.63, 392.00], // D3, C4, G4
      [146.83, 220.00, 440.00], // D3, A3, A4
      // Bar 3 & 4: Bb Major - Imperial Might
      [116.54, 233.08, 349.23], // Bb2, Bb3, F4
      [116.54, 293.66, 466.16], // Bb2, D4, Bb4
      [116.54, 349.23, 523.25], // Bb2, F4, C5
      [116.54, 293.66, 466.16], // Bb2, D4, Bb4
      // Bar 5 & 6: F Major / C - Golden Citadel
      [174.61, 261.63, 349.23], // F3, C4, F4
      [174.61, 329.63, 523.25], // F3, E4, C5
      [130.81, 261.63, 392.00], // C3, C4, G4
      [130.81, 329.63, 523.25], // C3, E4, C5
      // Bar 7 & 8: A7 -> Dm - Grand Climax Fanfare
      [220.00, 277.18, 440.00], // A3, C#4, A4
      [220.00, 329.63, 554.37], // A3, E4, C#5
      [146.83, 220.00, 587.33], // D3, A3, D5 (Triumphant High D)
      [146.83, 293.66, 440.00], // D3, D4, A4
    ];

    const playStep = () => {
      if (!this.isBgmActive || !this.enabled || !this.ctx || !this.bgmGainNode) return;
      const now = this.ctx.currentTime;
      const step = this.bgmStep % 16;
      this.bgmStep++;

      const currentChord = chordNotes[step];

      // 1. Royal Brass & Strings Melody Chord (Sawtooth + Triangle rich blend)
      currentChord.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        const filter = this.ctx!.createBiquadFilter();

        osc.type = idx === 0 ? 'triangle' : 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.frequency.exponentialRampToValueAtTime(700, now + beatTime * 0.9);

        const vol = idx === 0 ? 0.22 : 0.12;
        noteGain.gain.setValueAtTime(vol, now);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + beatTime * 0.88);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.bgmGainNode!);

        osc.start(now);
        osc.stop(now + beatTime);
      });

      // 2. War Drum / Timpani on beats 0, 4, 8, 12, with offbeat syncopation
      if (step === 0 || step === 4 || step === 8 || step === 12 || step === 14) {
        const drumOsc = this.ctx.createOscillator();
        const drumGain = this.ctx.createGain();
        drumOsc.type = 'sine';
        drumOsc.frequency.setValueAtTime(step === 0 || step === 8 ? 90 : 75, now);
        drumOsc.frequency.exponentialRampToValueAtTime(32, now + 0.24);

        drumGain.gain.setValueAtTime(0.35, now);
        drumGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        drumOsc.connect(drumGain);
        drumGain.connect(this.bgmGainNode);
        drumOsc.start(now);
        drumOsc.stop(now + 0.26);

        // Snare/Marching armor rattle on beats 4 and 12
        if (step === 4 || step === 12) {
          const bufferSize = this.ctx.sampleRate * 0.08;
          const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
          const noise = this.ctx.createBufferSource();
          noise.buffer = buffer;
          const nFilter = this.ctx.createBiquadFilter();
          nFilter.type = 'bandpass';
          nFilter.frequency.setValueAtTime(2200, now);
          const nGain = this.ctx.createGain();
          nGain.gain.setValueAtTime(0.18, now);
          nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

          noise.connect(nFilter);
          nFilter.connect(nGain);
          nGain.connect(this.bgmGainNode);
          noise.start(now);
        }
      }
    };

    // Run interval
    this.bgmIntervalId = window.setInterval(playStep, beatTime * 1000);
    playStep();
  }

  // =========================================================================
  // SWORD ATTACK SOUND (Crisp, High-Speed Metallic Blade Swish & Slash)
  // =========================================================================
  playSwordAttack() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Blade air cutting noise (wind whip)
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.frequency.exponentialRampToValueAtTime(750, now + 0.14);
      filter.Q.setValueAtTime(4.0, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.65, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);

      // 2. High steel ring / metallic whistle
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.16);

      oscGain.gain.setValueAtTime(0.48, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.17);
    } catch {}
  }

  // Backward compatibility alias
  playSwordSlash() {
    this.playSwordAttack();
  }

  // =========================================================================
  // LOUDER SWORD ATTACK SOUND (High Impact Heavy Blade Clang & Heavy Slash)
  // Substantially louder, booming metal crunch, visceral bass impact!
  // =========================================================================
  playLouderSwordAttack() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Heavy Bass Thud & Sub Impact (Booming Punch)
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(160, now);
      subOsc.frequency.exponentialRampToValueAtTime(38, now + 0.28);
      subGain.gain.setValueAtTime(0.85, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.29);

      // 2. Screaming Steel Cleave & Heavy Clang (Sawtooth harmonics)
      const steel1 = this.ctx.createOscillator();
      const steel2 = this.ctx.createOscillator();
      const steelGain = this.ctx.createGain();

      steel1.type = 'sawtooth';
      steel1.frequency.setValueAtTime(1420, now);
      steel1.frequency.exponentialRampToValueAtTime(120, now + 0.25);

      steel2.type = 'square';
      steel2.frequency.setValueAtTime(2150, now);
      steel2.frequency.exponentialRampToValueAtTime(320, now + 0.22);

      steelGain.gain.setValueAtTime(0.75, now);
      steelGain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

      steel1.connect(steelGain);
      steel2.connect(steelGain);
      steelGain.connect(this.ctx.destination);
      steel1.start(now);
      steel2.start(now);
      steel1.stop(now + 0.27);
      steel2.stop(now + 0.27);

      // 3. Huge rushing blade whoosh noise
      const bufferSize = this.ctx.sampleRate * 0.22;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(4500, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.22);

      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.70, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      noise.connect(filter);
      filter.connect(nGain);
      nGain.connect(this.ctx.destination);
      noise.start(now);
    } catch {}
  }

  // Backward compatibility alias
  playSwordHeavySlash() {
    this.playLouderSwordAttack();
  }

  // =========================================================================
  // DEATH SOUND OF PLAYER (Tragic Heroic Defeat & Mournful Bell Chime)
  // =========================================================================
  playPlayerDeath() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Crushing Armor Shatter Impact
      const crushOsc = this.ctx.createOscillator();
      const crushGain = this.ctx.createGain();
      crushOsc.type = 'sawtooth';
      crushOsc.frequency.setValueAtTime(180, now);
      crushOsc.frequency.exponentialRampToValueAtTime(30, now + 0.55);
      crushGain.gain.setValueAtTime(0.75, now);
      crushGain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);
      crushOsc.connect(crushGain);
      crushGain.connect(this.ctx.destination);
      crushOsc.start(now);
      crushOsc.stop(now + 0.6);

      // 2. Tragic Royal Mourn Chimes (Eb4 -> C4 -> Ab3 -> G3 -> C3)
      const funeralTones = [
        { freq: 311.13, delay: 0.12, dur: 0.45 }, // Eb4
        { freq: 261.63, delay: 0.45, dur: 0.50 }, // C4
        { freq: 207.65, delay: 0.85, dur: 0.55 }, // Ab3
        { freq: 196.00, delay: 1.25, dur: 0.65 }, // G3
        { freq: 130.81, delay: 1.70, dur: 1.10 }, // C3 (Final Deep Requiem)
      ];

      funeralTones.forEach((tone) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = now + tone.delay;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(tone.freq, startTime);

        gain.gain.setValueAtTime(0.45, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + tone.dur);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(startTime);
        osc.stop(startTime + tone.dur + 0.05);
      });
    } catch {}
  }

  // Backward compatibility alias
  playDefeat() {
    this.playPlayerDeath();
  }

  // =========================================================================
  // DEATH SOUND OF ENEMY / DEMON KING (Demonic Roar, Abyssal Disintegration)
  // Thunderous dark king destruction explosion and screeching void collapse!
  // =========================================================================
  playEnemyDeath() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Abyssal Demonic Roar & Sub Rumble (Earthquake collapse)
      const rumble = this.ctx.createOscillator();
      const rumbleGain = this.ctx.createGain();
      rumble.type = 'sawtooth';
      rumble.frequency.setValueAtTime(95, now);
      rumble.frequency.linearRampToValueAtTime(140, now + 0.3);
      rumble.frequency.exponentialRampToValueAtTime(25, now + 1.2);

      rumbleGain.gain.setValueAtTime(0.85, now);
      rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

      rumble.connect(rumbleGain);
      rumbleGain.connect(this.ctx.destination);
      rumble.start(now);
      rumble.stop(now + 1.3);

      // 2. Demonic Screech / Void Rift Distortion
      const screech = this.ctx.createOscillator();
      const screechGain = this.ctx.createGain();
      screech.type = 'square';
      screech.frequency.setValueAtTime(620, now);
      screech.frequency.exponentialRampToValueAtTime(80, now + 0.9);

      screechGain.gain.setValueAtTime(0.40, now);
      screechGain.gain.exponentialRampToValueAtTime(0.001, now + 0.92);

      screech.connect(screechGain);
      screechGain.connect(this.ctx.destination);
      screech.start(now);
      screech.stop(now + 0.95);

      // 3. Crackling Explosion Noise (Demonic core burst)
      const bufferSize = this.ctx.sampleRate * 0.9;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.35));
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const nFilter = this.ctx.createBiquadFilter();
      nFilter.type = 'lowpass';
      nFilter.frequency.setValueAtTime(1800, now);
      nFilter.frequency.exponentialRampToValueAtTime(150, now + 0.9);

      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.75, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      noise.connect(nFilter);
      nFilter.connect(nGain);
      nGain.connect(this.ctx.destination);
      noise.start(now);
    } catch {}
  }

  // Sword Parry Sound / Benturan Pedang Tangkis (Metallic Spark Clang)
  playSwordParry() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // High resonant metallic frequencies
      const freqs = [1480, 2150, 3200];
      freqs.forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = idx === 0 ? 'square' : 'triangle';
        osc.frequency.setValueAtTime(f, now);
        osc.frequency.exponentialRampToValueAtTime(f * 0.75, now + 0.28);

        const initialVol = idx === 0 ? 0.42 : 0.32;
        gain.gain.setValueAtTime(initialVol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      });

      // Quick spark noise transient
      const bufferSize = this.ctx.sampleRate * 0.04;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.35, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      noise.connect(nGain);
      nGain.connect(this.ctx.destination);
      noise.start(now);
    } catch {}
  }

  playPunch() {
    this.playSwordAttack();
  }

  playBlock() {
    this.playSwordParry();
  }

  playSpecial() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Energy beam explosion + magical blade burst
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(320, now);
      osc1.frequency.exponentialRampToValueAtTime(60, now + 0.5);

      osc2.frequency.setValueAtTime(600, now);
      osc2.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
      osc2.frequency.exponentialRampToValueAtTime(100, now + 0.5);

      gain.gain.setValueAtTime(0.65, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.52);
      osc2.stop(now + 0.52);
    } catch {}
  }

  playMiss() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.09);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  // Victory Sound (Triumphant Royal Fanfare Chords & Shimmer)
  playVictory() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const notes = [
        { freq: 261.63, delay: 0.0, dur: 0.22 },  // C4
        { freq: 329.63, delay: 0.14, dur: 0.22 }, // E4
        { freq: 392.00, delay: 0.28, dur: 0.24 }, // G4
        { freq: 523.25, delay: 0.44, dur: 0.8 },  // C5 (held)
        { freq: 659.25, delay: 0.52, dur: 0.72 }, // E5
        { freq: 783.99, delay: 0.60, dur: 0.65 }, // G5
        { freq: 1046.5, delay: 0.70, dur: 0.75 }, // C6 high shimmer
      ];

      notes.forEach((note) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = now + note.delay;

        osc.type = note.freq > 700 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(note.freq, startTime);

        gain.gain.setValueAtTime(0.35, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.dur);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(startTime);
        osc.stop(startTime + note.dur + 0.05);
      });
    } catch {}
  }

  playWin() {
    this.playVictory();
  }

  playLose() {
    this.playPlayerDeath();
  }
}

export const soundFx = new SoundController();

