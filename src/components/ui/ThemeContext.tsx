import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// --- Types ---
type Theme = "light" | "dark" | "orange" | "leaf";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
  setPreviewTheme: (theme: Theme | null) => void; // ✅ ADDED
}

// --- Context Creation ---
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// --- Provider Component ---
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // 🔹 Saved theme (final applied)
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme") as Theme | null;
      if (saved) return saved;

      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return "light";
  });

  // 🔹 Temporary hover preview theme
  const [previewTheme, setPreviewThemeState] = useState<Theme | null>(null);

  // 🔹 Dark mode logic (unchanged)
  const isDarkMode = theme === "dark";

  // 🔹 Apply theme to <html>
  useEffect(() => {
    const root = document.documentElement;
    const activeTheme = previewTheme ?? theme;

    localStorage.setItem("theme", theme);

    root.classList.remove("light", "dark", "orange", "leaf");
    root.classList.add(activeTheme);
  }, [theme, previewTheme]);

  // 🔹 Set permanent theme (click)
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // 🔹 Preview theme (hover)
  const setPreviewTheme = (theme: Theme | null) => {
    setPreviewThemeState(theme);
  };

  // 🔹 Toggle Light / Dark only (your original logic)
  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isDarkMode,
        setPreviewTheme, // ✅ PROVIDED
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// --- Hook ---
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
