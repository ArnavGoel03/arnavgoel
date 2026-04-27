/**
 * Tiny Web Audio API sound synthesizer.
 * No audio files — everything is synthesized via OscillatorNode.
 * All functions are no-ops in SSR (typeof window guard) and when the
 * user has audio cues disabled (localStorage key `audio-cues:enabled`).
 *
 * Two sounds:
 *   bell()  — soft ~440 Hz sine bell, 0.3 s fade-out. Page-load.
 *   click() — shorter ~620 Hz sine blip, 0.12 s. Nav-tab change.
 */

const STORAGE_KEY = "audio-cues:enabled";

/** Returns true only if the user has explicitly opted in. Default is OFF. */
export function audioCuesEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setAudioCues(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? "true" : "false");
  } catch {
    // localStorage unavailable — silently skip.
  }
}

/** Cached AudioContext (one per page load). */
let ctx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      ctx = new AudioContext();
    } catch {
      return null;
    }
  }
  return ctx;
}

/**
 * Plays a soft sine-wave bell chord (440 + 880 Hz) with a 0.3 s
 * exponential fade. Used on page-load.
 */
export function playBell(): void {
  if (!audioCuesEnabled()) return;
  const ac = getCtx();
  if (!ac) return;

  const now = ac.currentTime;
  const duration = 0.32;

  [440, 880].forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(i === 0 ? 0.09 : 0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(now);
    osc.stop(now + duration);
  });
}

/**
 * Plays a subtle ~620 Hz sine blip (0.12 s). Used on nav-tab change.
 */
export function playClick(): void {
  if (!audioCuesEnabled()) return;
  const ac = getCtx();
  if (!ac) return;

  const now = ac.currentTime;
  const duration = 0.12;

  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.value = 620;
  gain.gain.setValueAtTime(0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(now);
  osc.stop(now + duration);
}
