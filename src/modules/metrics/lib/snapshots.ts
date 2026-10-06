 import type { Mode, Snapshot } from "../types";

const KEY_PREFIX = "poc:snapshot:";
export const SNAPSHOT_EVENT = "poc:snapshot";

export function saveSnapshot(mode: Mode, snapshot: Snapshot): void {
  try {
    window.sessionStorage.setItem(KEY_PREFIX + mode, JSON.stringify(snapshot));
    window.dispatchEvent(new Event(SNAPSHOT_EVENT));
  } catch {
    // Storage can be blocked (private mode). The live numbers still work.
  }
}

export function readSnapshot(mode: Mode): Snapshot | null {
  try {
    const raw = window.sessionStorage.getItem(KEY_PREFIX + mode);
    return raw ? (JSON.parse(raw) as Snapshot) : null;
  } catch {
    return null;
  }
}

export function clearSnapshots(): void {
  try {
    window.sessionStorage.removeItem(KEY_PREFIX + "before");
    window.sessionStorage.removeItem(KEY_PREFIX + "after");
    window.dispatchEvent(new Event(SNAPSHOT_EVENT));
  } catch {
    // ignore
  }
}

/** Percentage drop from `before` to `after` (positive = improvement). */
export function percentDrop(before: number, after: number): number | null {
  if (before <= 0) return null;
  return Math.round((1 - after / before) * 100);
}
