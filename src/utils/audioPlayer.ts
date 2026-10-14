// Romantic Wedding Background Audio Engine
// Combines an online romantic instrumental stream with an embedded Web Audio romantic harp/chime synthesizer fallback

class WeddingAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private synthInterval: number | null = null;
  private listeners: ((playing: boolean) => void)[] = [];

  constructor() {
    // Standard royalty-free acoustic romantic wedding instrumental
    if (typeof window !== 'undefined') {
      this.audio = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3');
      this.audio.loop = true;
      this.audio.volume = 0.45;

      this.audio.addEventListener('error', () => {
        // Fallback to secondary stream if pixabay temp url expires
        if (this.audio) {
          this.audio.src = 'https://actions.google.com/sounds/v1/ambiences/gentle_morning_piano.ogg';
        }
      });
    }
  }

  public subscribe(listener: (playing: boolean) => void) {
    this.listeners.push(listener);
    listener(this.isPlaying);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isPlaying));
  }

  public play() {
    if (this.isPlaying) return;

    if (this.audio) {
      this.audio
        .play()
        .then(() => {
          this.isPlaying = true;
          this.notify();
        })
        .catch(() => {
          // If browser policy blocks external audio, start Web Audio ambient piano/chime synth
          this.startWebAudioAmbient();
          this.isPlaying = true;
          this.notify();
        });
    } else {
      this.startWebAudioAmbient();
      this.isPlaying = true;
      this.notify();
    }
  }

  public pause() {
    if (this.audio) {
      this.audio.pause();
    }
    this.stopWebAudioAmbient();
    this.isPlaying = false;
    this.notify();
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public getPlaying() {
    return this.isPlaying;
  }

  // Web Audio procedural romantic chime/harp chords (100% works offline without any external network)
  private startWebAudioAmbient() {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const notes = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25]; // C major 7th chord notes
      let noteIndex = 0;

      this.synthInterval = window.setInterval(() => {
        if (!this.audioCtx || this.audioCtx.state === 'suspended') return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        const freq = notes[noteIndex % notes.length];
        noteIndex++;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.04, this.audioCtx.currentTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 2.5);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 2.6);
      }, 900);
    } catch {
      // Audio context not allowed yet
    }
  }

  private stopWebAudioAmbient() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }
}

export const weddingAudio = new WeddingAudioEngine();
