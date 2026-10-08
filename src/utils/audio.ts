/**
 * Audio synthesis engine for Sylvan Focus
 * Provides meditative singing bowl chime, wooden tactile clicks,
 * and soothing procedural ambient soundscapes using the Web Audio API.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientNode: AudioNode | null = null;
  private ambientGain: GainNode | null = null;
  private isMuted: boolean = false;
  private activeSoundscape: 'none' | 'rain' | 'forest' | 'stream' | 'hearth' = 'none';

  private initCtx(): AudioContext {
    if (!this.ctx || this.ctx.state === 'suspended') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playWoodClick(volume = 0.25) {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.Q.setValueAtTime(3.0, ctx.currentTime);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // Audio context might be restricted before first gesture
    }
  }

  public playSingingBowl(volume = 0.6) {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const baseFreq = 432; // A=432Hz meditative tuning

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.5, now);
      masterGain.connect(ctx.destination);

      // Harmonics for singing bowl timbre: 1x, 2.76x, 5.4x, 8.9x
      const partials = [
        { freq: baseFreq, gain: 0.6, decay: 4.5 },
        { freq: baseFreq * 2.76, gain: 0.35, decay: 3.2 },
        { freq: baseFreq * 5.4, gain: 0.15, decay: 2.0 },
        { freq: baseFreq * 8.9, gain: 0.05, decay: 1.2 },
      ];

      partials.forEach(({ freq, gain, decay }) => {
        const osc = ctx.createOscillator();
        const pGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Subtle slow frequency shimmer
        osc.frequency.exponentialRampToValueAtTime(freq * 0.998, now + decay);

        pGain.gain.setValueAtTime(0, now);
        pGain.gain.linearRampToValueAtTime(gain, now + 0.08); // gentle strike attack
        pGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(pGain);
        pGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + decay);
      });
    } catch {
      // Silent fail if context locked
    }
  }

  public startSoundscape(type: 'rain' | 'forest' | 'stream' | 'hearth', volume = 0.3) {
    this.stopSoundscape();
    this.activeSoundscape = type;
    if (this.isMuted) return;

    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.001, now);
      master.gain.linearRampToValueAtTime(volume, now + 1.5);
      master.connect(ctx.destination);
      this.ambientGain = master;

      const bufferSize = ctx.sampleRate * 3;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Create brown/pink colored noise base
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'rain' || type === 'stream') {
          // Pink-ish noise
          output[i] = (lastOut * 0.95) + (white * 0.08);
          lastOut = output[i];
        } else {
          // Brown noise (deeper)
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
        }
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();

      if (type === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now);
        noiseSource.connect(filter);
        filter.connect(master);
      } else if (type === 'forest') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(450, now);
        filter.Q.setValueAtTime(0.8, now);

        // LFO for gentle wind swaying
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.15, now);
        lfoGain.gain.setValueAtTime(200, now);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();

        noiseSource.connect(filter);
        filter.connect(master);
      } else if (type === 'stream') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(900, now);
        filter.Q.setValueAtTime(1.5, now);

        // LFO for babbling water ripples
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.4, now);
        lfoGain.gain.setValueAtTime(350, now);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();

        noiseSource.connect(filter);
        filter.connect(master);
      } else if (type === 'hearth') {
        // Deep warm rumble
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, now);
        noiseSource.connect(filter);
        filter.connect(master);
      }

      noiseSource.start(0);
      this.ambientNode = noiseSource;
    } catch {
      // Ignored
    }
  }

  public setSoundscapeVolume(vol: number) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  public stopSoundscape() {
    if (this.ambientNode) {
      try {
        (this.ambientNode as AudioBufferSourceNode).stop();
        this.ambientNode.disconnect();
      } catch {
        // Ignored
      }
      this.ambientNode = null;
    }
    if (this.ambientGain) {
      try {
        this.ambientGain.disconnect();
      } catch {
        // Ignored
      }
      this.ambientGain = null;
    }
    this.activeSoundscape = 'none';
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopSoundscape();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getActiveSoundscape() {
    return this.activeSoundscape;
  }
}

export const sound = new SoundEngine();
