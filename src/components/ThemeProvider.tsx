"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "light" | "dark";
type Ctx = { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void };

const ThemeCtx = createContext<Ctx | null>(null);

export const STORAGE_KEY = "tjcreate-theme";

// Inline script body — paste into a <Script strategy="beforeInteractive" />
// or into a plain <script dangerouslySetInnerHTML>. Reads saved preference and
// applies the data-theme attribute before paint, preventing a flash of the
// wrong theme.
export const NO_FLASH_SNIPPET = `
  try {
    var t = localStorage.getItem('${STORAGE_KEY}');
    if (t === 'dark' || t === 'light') {
      document.documentElement.setAttribute('data-theme', t);
    }
  } catch (_) {}
`;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  // Read initial theme from the already-applied html attribute (set by the
  // no-flash script) so we don't fight it on mount.
  useEffect(() => {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "dark" || attr === "light") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setThemeState(attr);
    }
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      // localStorage might be blocked — silent fail.
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <ThemeCtx.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) {
    // Fallback — returns a no-op if provider isn't mounted (SSR safety).
    return {
      theme: "light" as Theme,
      toggle: () => {},
      setTheme: () => {},
    };
  }
  return ctx;
}
