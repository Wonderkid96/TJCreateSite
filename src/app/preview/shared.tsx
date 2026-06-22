import { type Project } from "@/lib/content";

/**
 * Resolve a still image for a project tile. Prefers an explicit image,
 * falls back to a video poster, then to null (caller shows a colour field).
 * Used by both prototype routes so work tiles always have something to show.
 */
export function posterFor(project: Project): string | null {
  return project.image ?? project.videoPoster ?? null;
}

/** Small fixed banner marking these routes as throwaway prototypes. */
export function PreviewBanner({ label }: { label: string }) {
  return (
    <div className="fixed bottom-3 left-1/2 z-[120] -translate-x-1/2 rounded-full border border-white/20 bg-black/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/80 backdrop-blur">
      Prototype · {label} · draft copy
    </div>
  );
}
