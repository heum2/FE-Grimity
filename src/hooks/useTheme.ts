import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const THEME_KEY = "theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    let stored: Theme | null = null;
    try {
      stored = localStorage.getItem(THEME_KEY) as Theme | null;
    } catch {}

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial: Theme = stored ?? (prefersDark ? "dark" : "light");

    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      let hasManualOverride = false;
      try {
        hasManualOverride = !!localStorage.getItem(THEME_KEY);
      } catch {}
      if (!hasManualOverride) {
        const next: Theme = e.matches ? "dark" : "light";
        setTheme(next);
        document.documentElement.setAttribute("data-theme", next);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
  };

  return { theme, toggleTheme };
}
