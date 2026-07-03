import { useEffect, useState } from "react";

type Theme = "light" | "dark";
export type ThemeMode = "system" | "light" | "dark";

const THEME_KEY = "theme";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [theme, setTheme] = useState<Theme>("light");

  const applyTheme = (next: Theme) => {
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(THEME_KEY);
    } catch {}

    const initialMode: ThemeMode = stored === "light" || stored === "dark" ? stored : "system";
    setModeState(initialMode);
    applyTheme(initialMode === "system" ? getSystemTheme() : initialMode);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      let hasManualOverride = false;
      try {
        const s = localStorage.getItem(THEME_KEY);
        hasManualOverride = s === "light" || s === "dark";
      } catch {}
      if (!hasManualOverride) {
        applyTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    if (next === "system") {
      try {
        localStorage.removeItem(THEME_KEY);
      } catch {}
      applyTheme(getSystemTheme());
    } else {
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {}
      applyTheme(next);
    }
  };

  const toggleTheme = () => {
    setMode(theme === "light" ? "dark" : "light");
  };

  return { theme, mode, setMode, toggleTheme };
}
