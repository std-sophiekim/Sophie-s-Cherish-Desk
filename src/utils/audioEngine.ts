import { SpeakerMode } from '../types/desk';

class DeskAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private lofiTimer: number | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private currentMode: SpeakerMode = 'off';
  private volume = 0.45;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public setMode(mode: SpeakerMode): void {
    if (mode === this.currentMode) return;
    this.stopAmbient();
    this.currentMode = mode;

    if (mode === 'lofi') {
      this.startLofiChords();
    } else if (mode === 'rain') {
      this.startSoftRain();
    }
  }

  private stopAmbient(): void {
    if (this.lofiTimer !== null) {
      window.clearInterval(this.lofiTimer);
      this.lofiTimer = null;
    }
    if (this.noiseSource) {
      try {
        this.noiseSource.stop();
        this.noiseSource.disconnect();
      } catch {
        // Ignore already stopped source
      }
      this.noiseSource = null;
    }
  }

  private startLofiChords(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    // Gentle warm Rhodes-like progression: Fmaj7 -> Em7 -> Dm7 -> Cmaj7
    const chords = [
      [174.61, 220.0, 261.63, 329.63],
      [164.81, 196.0, 246.94, 293.66],
      [146.83, 174.61, 220.0, 261.63],
      [130.81, 164.81, 196.0, 246.94],
    ];
    let step = 0;

    const triggerChord = () => {
      if (!this.ctx || !this.masterGain || this.currentMode !== 'lofi') return;
      const now = this.ctx.currentTime;
      const notes = chords[step % chords.length];
      step += 1;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(760, now);
      filter.connect(this.masterGain);

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.045);

        noteGain.gain.setValueAtTime(0.0001, now + idx * 0.045);
        noteGain.gain.linearRampToValueAtTime(0.065, now + idx * 0.045 + 0.18);
        noteGain.gain.exponentialRampToValueAtTime(0.0008, now + 3.0);

        osc.connect(noteGain);
        noteGain.connect(filter);
        osc.start(now + idx * 0.045);
        osc.stop(now + 3.1);
      });
    };

    triggerChord();
    this.lofiTimer = window.setInterval(triggerChord, 3200);
  }

  private startSoftRain(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Smooth brown-ish noise for warm rain ambience
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.03 * white) / 1.03;
      lastOut = data[i];
      data[i] *= 1.8;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 620;
    filter.Q.value = 0.6;

    const rainGain = ctx.createGain();
    rainGain.gain.value = 0.25;

    source.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain);
    source.start();
    this.noiseSource = source;
  }

  public playPomodoroChime(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    const chimeNotes = [523.25, 659.25, 783.99];
    chimeNotes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.14);

      gain.gain.setValueAtTime(0.0001, now + i * 0.14);
      gain.gain.linearRampToValueAtTime(0.12, now + i * 0.14 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + i * 0.14 + 1.1);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now + i * 0.14);
      osc.stop(now + i * 0.14 + 1.2);
    });
  }

  public dispose(): void {
    this.stopAmbient();
    this.currentMode = 'off';
  }
}

export const deskAudio = new DeskAudioEngine();
