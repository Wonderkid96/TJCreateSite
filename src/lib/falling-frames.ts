/**
 * Falling-man animation — 82 transparent-alpha PNG frames hosted on R2.
 *
 * We render via <canvas> + ctx.drawImage(HTMLImageElement) rather than:
 *   - HEVC+alpha MP4: only renders in Safari; dead for Chrome + Firefox.
 *   - <img src={url}> swapping: even with a preload, the rendered element
 *     kicks off its own decode per swap, causing visible flicker on fast
 *     scroll.
 *   - createImageBitmap via fetch(): R2's public bucket doesn't return CORS
 *     headers on preflights, so fetch() fails outright.
 *
 * `new Image()` loads the bytes and decodes them inside the Image element
 * without a fetch() and without requiring CORS for basic rendering. Once
 * decoded, ctx.drawImage(img) draws directly from the image's internal
 * bitmap — instant, no per-frame decode. The canvas ends up tainted (no
 * pixel readback) but we never need that.
 */

const FRAME_BASE =
  "https://pub-32701e0732b04900831d917fc70dbc90.r2.dev/frame_";

export const FALLING_FRAME_COUNT = 82;
export const FALLING_FRAME_WIDTH = 726;
export const FALLING_FRAME_HEIGHT = 699;

export const FALLING_FRAMES: string[] = Array.from(
  { length: FALLING_FRAME_COUNT },
  (_, i) => `${FRAME_BASE}${String(i + 1).padStart(4, "0")}.png`,
);

export const FALLING_FIRST_FRAME = FALLING_FRAMES[0];

// Preloaded image cache. Each entry is decoded and ready to drawImage().
const images: (HTMLImageElement | null)[] = new Array(FALLING_FRAME_COUNT).fill(
  null,
);

let preloadStarted = false;
let loadedCount = 0;
let isReady = false;
const readyCallbacks: Array<() => void> = [];

function markOne() {
  loadedCount += 1;
  if (loadedCount >= FALLING_FRAME_COUNT && !isReady) {
    isReady = true;
    for (const cb of readyCallbacks) cb();
    readyCallbacks.length = 0;
  }
}

/**
 * Kick off parallel load + decode of every frame. Idempotent. Passing
 * `onReady` registers a callback that fires exactly once when every
 * frame is decoded and safe to draw.
 */
export function preloadFallingFrames(onReady?: () => void) {
  if (typeof window === "undefined") return;

  if (onReady) {
    if (isReady) onReady();
    else readyCallbacks.push(onReady);
  }

  if (preloadStarted) return;
  preloadStarted = true;

  for (let i = 0; i < FALLING_FRAME_COUNT; i++) {
    const img = new window.Image();
    img.decoding = "async";
    // No crossOrigin attribute — R2's public bucket sends no CORS headers,
    // which would make a CORS-requested image fail to load. Without the
    // attribute, the browser loads it as a same-origin-ish resource (the
    // canvas ends up tainted, which we don't care about).

    // Guard against double-settle. `onload` may fire asynchronously OR
    // synchronously-complete for cached images may mean it never fires
    // at all; the complete-check below covers that.
    let settled = false;
    const settle = (ok: boolean) => {
      if (settled) return;
      settled = true;
      if (ok) images[i] = img;
      img.onload = null;
      img.onerror = null;
      markOne();
    };

    img.onload = () => settle(true);
    img.onerror = () => settle(false);
    img.src = FALLING_FRAMES[i];

    // Cached hit: when the image is already in the browser's image cache,
    // some engines fire `onload` synchronously during `src` assignment (or
    // not at all, depending on timing). `img.complete && naturalWidth > 0`
    // is the canonical "already loaded" signal — settle immediately.
    if (img.complete && img.naturalWidth > 0) {
      settle(true);
    }
  }
}

export function fallingFramesReady(): boolean {
  return isReady;
}

export function fallingFramesProgress(): number {
  return loadedCount / FALLING_FRAME_COUNT;
}

/**
 * Image element for the frame nearest to `progress` (0..1). Returns null
 * if that frame isn't decoded yet — caller should leave the canvas as is
 * and try again on the next tick.
 */
export function getFallingFrame(progress: number): HTMLImageElement | null {
  const clamped = Math.min(1, Math.max(0, progress));
  const idx = Math.min(
    FALLING_FRAME_COUNT - 1,
    Math.floor(clamped * FALLING_FRAME_COUNT),
  );
  return images[idx];
}

export function getFallingFrameByIndex(idx: number): HTMLImageElement | null {
  const clamped = Math.min(FALLING_FRAME_COUNT - 1, Math.max(0, idx));
  return images[clamped];
}
