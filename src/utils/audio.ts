/**
 * Web Audio API synthesizer for the "Play Sound" locator alert beacon.
 * Generates a high-pitched sonar locator ping with exponential frequency sweep and reverb tail.
 */
let audioCtx: AudioContext | null = null;

export function playLocatorSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Create dual-oscillator for futuristic locator ping
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    // Start high frequency and sweep down slightly
    osc1.frequency.setValueAtTime(1760, now); // A6 note
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.3);

    osc2.frequency.setValueAtTime(2637, now); // E7 harmonic
    osc2.frequency.exponentialRampToValueAtTime(1318, now + 0.3);

    // Envelope
    gainNode.gain.setValueAtTime(0.01, now);
    gainNode.gain.linearRampToValueAtTime(0.4, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.85);
    osc2.stop(now + 0.85);

    // Play a secondary echo ping after 0.35s
    setTimeout(() => {
      if (!audioCtx) return;
      const echoNow = audioCtx.currentTime;
      const echoOsc = audioCtx.createOscillator();
      const echoGain = audioCtx.createGain();

      echoOsc.type = 'sine';
      echoOsc.frequency.setValueAtTime(1760, echoNow);
      echoOsc.frequency.exponentialRampToValueAtTime(880, echoNow + 0.25);

      echoGain.gain.setValueAtTime(0.01, echoNow);
      echoGain.gain.linearRampToValueAtTime(0.2, echoNow + 0.04);
      echoGain.gain.exponentialRampToValueAtTime(0.001, echoNow + 0.6);

      echoOsc.connect(echoGain);
      echoGain.connect(audioCtx.destination);

      echoOsc.start(echoNow);
      echoOsc.stop(echoNow + 0.65);
    }, 350);
  } catch (err) {
    console.warn('Audio play failed or context restricted:', err);
  }
}
