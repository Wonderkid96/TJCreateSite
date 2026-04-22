"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * Super-basic snake game. Lives inside the <details> Snake Policy panel
 * in Contact as a footer easter egg. Pauses the moment the panel closes
 * (we gate everything on the `active` prop) so CPU goes back to 0 when
 * nobody's looking at it.
 *
 * Controls: arrow keys / WASD on desktop, swipe on mobile, on-screen
 * dpad below the board as a universal fallback.
 */

const COLS = 24;
const ROWS = 16;
const START_TICK_MS = 140;
const MIN_TICK_MS = 60;
// Ramp per food pickup — small enough that each bite is barely perceptible,
// big enough that a long run gets noticeably harder.
const SPEEDUP_MS = 5;

type Cell = { x: number; y: number };
type Dir = "up" | "down" | "left" | "right";

const DIR_DELTA: Record<Dir, Cell> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE: Record<Dir, Dir> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

const INITIAL_SNAKE: Cell[] = [
  { x: 8, y: 8 },
  { x: 7, y: 8 },
  { x: 6, y: 8 },
];

function randomFood(snake: Cell[]): Cell {
  // Rejection sample — grid is small enough that it's always fast.
  while (true) {
    const x = Math.floor(Math.random() * COLS);
    const y = Math.floor(Math.random() * ROWS);
    if (!snake.some((s) => s.x === x && s.y === y)) return { x, y };
  }
}

export default function SnakeGame({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Refs so the tick loop can read/write without re-rendering 8× per second.
  const snakeRef = useRef<Cell[]>([...INITIAL_SNAKE]);
  const dirRef = useRef<Dir>("right");
  const pendingDirRef = useRef<Dir>("right");
  const foodRef = useRef<Cell>({ x: 16, y: 8 });

  const [score, setScore] = useState(0);
  const [length, setLength] = useState(INITIAL_SNAKE.length);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning] = useState(false);
  // Tick interval lives in state so a speedup rebuilds the setInterval with
  // the new cadence. Starts slow, drops by SPEEDUP_MS on each pickup down
  // to MIN_TICK_MS — floors out before it becomes unplayable.
  const [tickMs, setTickMs] = useState(START_TICK_MS);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const cellW = w / COLS;
    const cellH = h / ROWS;

    // Board bg — very subtle paper tint so the grid doesn't look washed out.
    ctx.fillStyle = "rgba(10,10,10,1)";
    ctx.fillRect(0, 0, w, h);

    // Grid lines — barely-there for a playfield feel.
    ctx.strokeStyle = "rgba(244,241,233,0.05)";
    ctx.lineWidth = 1;
    for (let i = 1; i < COLS; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellW, 0);
      ctx.lineTo(i * cellW, h);
      ctx.stroke();
    }
    for (let i = 1; i < ROWS; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * cellH);
      ctx.lineTo(w, i * cellH);
      ctx.stroke();
    }

    // Food — orange full stop (site accent).
    const f = foodRef.current;
    const fx = f.x * cellW + cellW / 2;
    const fy = f.y * cellH + cellH / 2;
    const r = Math.min(cellW, cellH) * 0.32;
    ctx.fillStyle = "#E6352A";
    ctx.beginPath();
    ctx.arc(fx, fy, r, 0, Math.PI * 2);
    ctx.fill();

    // Snake — head is paper-bright, body fades slightly tail-ward.
    const snake = snakeRef.current;
    const pad = Math.max(1, Math.min(cellW, cellH) * 0.12);
    for (let i = 0; i < snake.length; i++) {
      const s = snake[i];
      const alpha = Math.max(0.45, 0.95 - i * 0.025);
      ctx.fillStyle = i === 0
        ? "#f4f1e9"
        : `rgba(244,241,233,${alpha})`;
      ctx.fillRect(
        s.x * cellW + pad,
        s.y * cellH + pad,
        cellW - pad * 2,
        cellH - pad * 2,
      );
    }
  }, []);

  const reset = useCallback(() => {
    snakeRef.current = [...INITIAL_SNAKE];
    dirRef.current = "right";
    pendingDirRef.current = "right";
    foodRef.current = randomFood(snakeRef.current);
    setScore(0);
    setLength(INITIAL_SNAKE.length);
    setGameOver(false);
    setTickMs(START_TICK_MS);
  }, []);

  const turn = useCallback((dir: Dir) => {
    // Can't 180° into yourself — silently ignore.
    if (OPPOSITE[dir] === dirRef.current) return;
    pendingDirRef.current = dir;
  }, []);

  // Tick loop — setInterval is fine for this grid-stepped movement; a rAF
  // loop would need its own time-accumulator to stay at TICK_MS.
  useEffect(() => {
    if (!running || gameOver) return;
    const id = window.setInterval(() => {
      const dir = pendingDirRef.current;
      dirRef.current = dir;
      const delta = DIR_DELTA[dir];
      const head = snakeRef.current[0];
      const nextHead: Cell = {
        x: head.x + delta.x,
        y: head.y + delta.y,
      };

      // Wall collision.
      if (
        nextHead.x < 0 ||
        nextHead.x >= COLS ||
        nextHead.y < 0 ||
        nextHead.y >= ROWS
      ) {
        setGameOver(true);
        setRunning(false);
        return;
      }
      // Self collision — ignore tail cell since it'll move out this tick.
      const bodyWithoutTail = snakeRef.current.slice(0, -1);
      if (bodyWithoutTail.some((s) => s.x === nextHead.x && s.y === nextHead.y)) {
        setGameOver(true);
        setRunning(false);
        return;
      }

      const ate =
        nextHead.x === foodRef.current.x && nextHead.y === foodRef.current.y;
      const newSnake = [nextHead, ...snakeRef.current];
      if (!ate) newSnake.pop();
      snakeRef.current = newSnake;

      if (ate) {
        foodRef.current = randomFood(newSnake);
        setScore((s) => s + 1);
        setLength(newSnake.length);
        setTickMs((ms) => Math.max(MIN_TICK_MS, ms - SPEEDUP_MS));
      }

      draw();
    }, tickMs);
    return () => window.clearInterval(id);
  }, [running, gameOver, draw, tickMs]);

  // Canvas sizing — ResizeObserver keeps it pixel-perfect for any breakpoint
  // and for devicePixelRatio changes (zoom, external monitor, etc.).
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const apply = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      draw();
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(container);
    return () => ro.disconnect();
  }, [draw]);

  // Start / stop with the panel.
  useEffect(() => {
    if (active) {
      reset();
      setRunning(true);
    } else {
      setRunning(false);
    }
  }, [active, reset]);

  // Keyboard — only while the panel is open, and only preventDefault on
  // the keys we actually use so we don't eat unrelated shortcuts.
  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      let dir: Dir | null = null;
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          dir = "up";
          break;
        case "ArrowDown":
        case "s":
        case "S":
          dir = "down";
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          dir = "left";
          break;
        case "ArrowRight":
        case "d":
        case "D":
          dir = "right";
          break;
      }
      if (!dir) return;
      e.preventDefault();
      turn(dir);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, turn]);

  // Touch swipe on the board itself.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    let sx = 0;
    let sy = 0;
    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      sx = t.clientX;
      sy = t.clientY;
    };
    const onEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - sx;
      const dy = t.clientY - sy;
      const MIN = 18;
      if (Math.abs(dx) < MIN && Math.abs(dy) < MIN) return;
      turn(
        Math.abs(dx) > Math.abs(dy)
          ? dx > 0
            ? "right"
            : "left"
          : dy > 0
            ? "down"
            : "up",
      );
    };
    canvas.addEventListener("touchstart", onStart, { passive: true });
    canvas.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      canvas.removeEventListener("touchstart", onStart);
      canvas.removeEventListener("touchend", onEnd);
    };
  }, [active, turn]);

  const restart = () => {
    reset();
    setRunning(true);
  };

  return (
    <div className="mt-4 border-t border-paper/15 pt-4 flex flex-col gap-3">
      {/* Stats bar spans the full panel width — sits above the board, never
          overlaps it. Mono so the numbers stay fixed-width as they tick. */}
      <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/70">
        <span className="inline-flex items-baseline gap-1.5">
          Score
          <span className="text-accent tabular-nums">
            {String(score).padStart(3, "0")}
          </span>
        </span>
        <span className="inline-flex items-baseline gap-1.5">
          Length
          <span className="text-accent tabular-nums">
            {String(length).padStart(2, "0")}
          </span>
        </span>
        <button
          type="button"
          onClick={restart}
          data-cursor="hover"
          className="hover:text-accent transition-colors"
        >
          [{gameOver ? "Play again" : "Restart"}]
        </button>
      </div>

      {/* Board fills the whole disclosure panel width. Height is driven by
          the grid's natural aspect so it looks right on every screen;
          max-h clamps vertical footprint on tall narrow viewports so the
          expanded panel never pushes past a single viewport height. */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-[2px] border border-paper/15 bg-[#0a0a0a] touch-none"
        style={{ aspectRatio: `${COLS} / ${ROWS}`, maxHeight: "58svh" }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-label="Snake game board"
          role="img"
        />

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[rgba(10,10,10,0.72)] backdrop-blur-[2px]">
            <div className="font-display text-xl md:text-2xl tracking-tight text-paper">
              Game <span className="italic">over</span>
              <span className="text-accent">.</span>
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/75">
              Score {score} · Length {length}
            </div>
            <button
              type="button"
              onClick={restart}
              data-cursor="hover"
              className="mt-1.5 px-3 py-1 rounded-full border border-paper/25 font-mono text-[9px] uppercase tracking-[0.2em] text-paper/85 hover:border-accent hover:text-accent transition-colors"
            >
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
