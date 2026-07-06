/**
 * Falling-man animation — 82 transparent-alpha WebP frames, self-hosted
 * in /public/work/frames (~1.6MB total vs ~11MB for the original PNGs).
 *
 * We render via <canvas> + ctx.drawImage(HTMLImageElement) rather than:
 *   - HEVC+alpha MP4: only renders in Safari; dead for Chrome + Firefox.
 *   - <img src={url}> swapping: even with a preload, the rendered element
 *     kicks off its own decode per swap, causing visible flicker on fast
 *     scroll.
 *
 * `new Image()` loads the bytes and decodes them inside the Image element.
 * Once decoded, ctx.drawImage(img) draws directly from the image's internal
 * bitmap — instant, no per-frame decode.
 *
 * Loading strategy: frames load in sequential batches of CONCURRENCY (6)
 * so that early frames — visible first when scrolling — arrive before
 * later ones. On slow mobile connections this eliminates the old problem
 * where all 82 images fought for bandwidth and frames arrived out of
 * order, causing visible skips in the scroll-driven animation.
 *
 * When the exact requested frame hasn't decoded yet, `getFallingFrame`
 * and `getFallingFrameByIndex` return the nearest loaded neighbour
 * instead of null. This provides smooth degradation: a slightly "held"
 * frame is far less jarring than a blank canvas.
 */

const FRAME_BASE = "/work/frames/frame_";

export const FALLING_FRAME_COUNT = 82;
export const FALLING_FRAME_WIDTH = 726;
export const FALLING_FRAME_HEIGHT = 699;

export const FALLING_FRAMES: string[] = Array.from(
  { length: FALLING_FRAME_COUNT },
  (_, i) => `${FRAME_BASE}${String(i + 1).padStart(4, "0")}.webp`,
);

export const FALLING_FIRST_FRAME = FALLING_FRAMES[0];

// Preloaded image cache. Each entry is decoded and ready to drawImage().
const images: (HTMLImageElement | null)[] = new Array(FALLING_FRAME_COUNT).fill(
  null,
);

let preloadStarted = false;
let loadedCount = 0;
let isReady = false;

// "Scroll-ready": enough evenly-spaced frames have loaded that the
// scroll-driven hero animation looks smooth even if gaps remain.
// Threshold: every 3rd frame (≈28 frames). Remaining frames fill in
// behind the scenes so the animation only gets smoother over time.
const SCROLL_READY_STRIDE = 3;
let isScrollReady = false;
const scrollReadyCallbacks: Array<() => void> = [];

const readyCallbacks: Array<() => void> = [];

// How many images load simultaneously. Matches typical browser per-origin
// connection limit for HTTP/2 so we saturate without wasteful queuing.
const CONCURRENCY = 6;
// Queue of frame indices still to load — filled once at preload start.
const loadQueue: number[] = [];
let inFlight = 0;

function markOne() {
  loadedCount += 1;

  // Check scroll-ready: do we have a frame at every STRIDE position?
  if (!isScrollReady) {
    let scrollOk = true;
    for (let i = 0; i < FALLING_FRAME_COUNT; i += SCROLL_READY_STRIDE) {
      if (!images[i]) { scrollOk = false; break; }
    }
    if (scrollOk) {
      isScrollReady = true;
      for (const cb of scrollReadyCallbacks) cb();
      scrollReadyCallbacks.length = 0;
    }
  }

  if (loadedCount >= FALLING_FRAME_COUNT && !isReady) {
    isReady = true;
    // Also fire scroll-ready callbacks in case stride check never passed
    // (shouldn't happen, but belt-and-braces).
    if (!isScrollReady) {
      isScrollReady = true;
      for (const cb of scrollReadyCallbacks) cb();
      scrollReadyCallbacks.length = 0;
    }
    for (const cb of readyCallbacks) cb();
    readyCallbacks.length = 0;
  }

  // Kick off next queued download(s) to keep CONCURRENCY slots filled.
  pumpQueue();
}

/** Load the next frame(s) from the queue, up to the concurrency cap. */
function pumpQueue() {
  while (inFlight < CONCURRENCY && loadQueue.length > 0) {
    const i = loadQueue.shift()!;
    inFlight += 1;
    loadOneFrame(i);
  }
}

function loadOneFrame(i: number) {
  const img = new window.Image();
  img.decoding = "async";
  // Frames are a background preload — on slow connections they must not
  // starve the webfonts and LCP resources, which would push the hero text's
  // final paint (and LCP) out by seconds.
  img.fetchPriority = "low";

  let settled = false;
  const settle = (ok: boolean) => {
    if (settled) return;
    settled = true;
    if (ok) images[i] = img;
    img.onload = null;
    img.onerror = null;
    inFlight -= 1;
    markOne();
  };

  img.onload = () => settle(true);
  img.onerror = () => settle(false);
  img.src = FALLING_FRAMES[i];

  // Cached hit: settle immediately if the browser already has this image.
  if (img.complete && img.naturalWidth > 0) {
    settle(true);
  }
}

/**
 * Kick off batched load + decode of every frame. Idempotent.
 *
 * Frames load in sequential order with a concurrency cap so that early
 * frames (visible first during scrolling) arrive before later ones.
 *
 * `onReady` fires when ALL frames are decoded.
 */
export function preloadFallingFrames(onReady?: () => void) {
  if (typeof window === "undefined") return;

  if (onReady) {
    if (isReady) onReady();
    else readyCallbacks.push(onReady);
  }

  if (preloadStarted) return;
  preloadStarted = true;

  // Fill queue in order: 0, 1, 2, … 81.
  for (let i = 0; i < FALLING_FRAME_COUNT; i++) {
    loadQueue.push(i);
  }
  pumpQueue();
}

export function fallingFramesReady(): boolean {
  return isReady;
}

/**
 * True once enough evenly-spaced frames have loaded for a smooth
 * scroll-driven animation. The splash screen uses this to dismiss
 * earlier on mobile rather than waiting for all 82 frames.
 */
export function fallingFramesScrollReady(): boolean {
  return isScrollReady;
}

export function onScrollReady(cb: () => void) {
  if (isScrollReady) cb();
  else scrollReadyCallbacks.push(cb);
}

export function fallingFramesProgress(): number {
  return loadedCount / FALLING_FRAME_COUNT;
}

/**
 * Find the nearest loaded frame to `idx`. Searches outward in both
 * directions so the caller always gets *something* to draw (unless
 * nothing has loaded at all, in which case returns null).
 */
function nearestLoaded(idx: number): HTMLImageElement | null {
  const clamped = Math.min(FALLING_FRAME_COUNT - 1, Math.max(0, idx));
  if (images[clamped]) return images[clamped];
  // Search outward: check idx-1, idx+1, idx-2, idx+2, …
  for (let d = 1; d < FALLING_FRAME_COUNT; d++) {
    const lo = clamped - d;
    const hi = clamped + d;
    if (lo >= 0 && images[lo]) return images[lo];
    if (hi < FALLING_FRAME_COUNT && images[hi]) return images[hi];
  }
  return null;
}

/**
 * Image element for the frame nearest to `progress` (0..1). If the
 * exact frame isn't decoded yet, returns the closest loaded neighbour
 * so the canvas always has something to draw.
 */
export function getFallingFrame(progress: number): HTMLImageElement | null {
  const clamped = Math.min(1, Math.max(0, progress));
  const idx = Math.min(
    FALLING_FRAME_COUNT - 1,
    Math.floor(clamped * FALLING_FRAME_COUNT),
  );
  return images[idx] ?? nearestLoaded(idx);
}

export function getFallingFrameByIndex(idx: number): HTMLImageElement | null {
  const clamped = Math.min(FALLING_FRAME_COUNT - 1, Math.max(0, idx));
  return images[clamped] ?? nearestLoaded(clamped);
}
