import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light" | "system";

const STORAGE_KEY = "theme";

const ThemeProviderContext = createContext<{
    theme: Theme;
    setTheme: (theme: Theme) => void;
}>({ theme: "system", setTheme: () => null });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>(
        () =>
            (typeof localStorage !== "undefined" &&
                (localStorage.getItem(STORAGE_KEY) as Theme)) ||
            "system",
    );

    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const apply = () =>
            document.documentElement.classList.toggle(
                "dark",
                theme === "dark" || (theme === "system" && media.matches),
            );

        apply();
        media.addEventListener("change", apply);
        return () => media.removeEventListener("change", apply);
    }, [theme]);

    return (
        <ThemeProviderContext.Provider
            value={{
                theme,
                setTheme: (theme) => {
                    localStorage.setItem(STORAGE_KEY, theme);
                    setTheme(theme);
                },
            }}
        >
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeProviderContext);
