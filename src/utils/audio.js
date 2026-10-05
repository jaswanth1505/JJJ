// ============================================================================
// Audio Helper: Subtle romantic sound effects & gentle melody generator
// Safe for all browsers, zero external dependencies!
// ============================================================================

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Gentle chime when unboxing the gift
export function playGiftChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.0);
    });
  } catch (_) {}
}

// Sparkle / Heart pop sound effect
export function playHeartPop() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.4);
  } catch (_) {}
}

// Arrow hit romantic chord
export function playArrowHit() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    [440, 554.37, 659.25, 880].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.04);
      gain.gain.setValueAtTime(0.08, now + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 0.7);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.04);
      osc.stop(now + i * 0.04 + 0.8);
    });
  } catch (_) {}
}

// Background soft romantic lullaby synthesizer (fallback when no mp3 exists)
class RomanticSynthesizer {
  constructor() {
    this.isPlaying = false;
    this.timer = null;
    this.ctx = null;
    this.gainNode = null;
  }

  start() {
    if (this.isPlaying) return;
    this.ctx = getAudioContext();
    if (!this.ctx) return;
    this.isPlaying = true;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.045, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    // Warm, heartfelt chord progression: Cmaj7 -> Am9 -> Fmaj7 -> Gsus4 -> C
    const melody = [
      261.63, 329.63, 392.00, 493.88, // Cmaj7
      220.00, 261.63, 329.63, 392.00, // Am7
      174.61, 220.00, 261.63, 329.63, // Fmaj7
      196.00, 246.94, 293.66, 392.00, // G
    ];

    let step = 0;
    const playNote = () => {
      if (!this.isPlaying || !this.ctx) return;
      const note = melody[step % melody.length];
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, now);

      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(0.07, now + 0.08);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(noteGain);
      noteGain.connect(this.gainNode);

      osc.start(now);
      osc.stop(now + 1.3);

      step++;
      this.timer = setTimeout(playNote, 420);
    };

    playNote();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  setVolume(vol) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(vol * 0.05, this.ctx.currentTime);
    }
  }
}

export const romanticSynth = new RomanticSynthesizer();
