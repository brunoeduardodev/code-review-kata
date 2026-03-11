"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_DESIGN_THEME,
  DESIGN_THEME_STORAGE_KEY,
  DesignThemeId,
} from "@/lib/design-themes";

const themeIdSet = new Set<DesignThemeId>([
  "midnight-lab",
  "obsidian-ember",
  "cyan-circuit",
  "crimson-audit",
  "forest-relay",
  "polar-terminal",
]);

function isThemeId(value: string): value is DesignThemeId {
  return themeIdSet.has(value as DesignThemeId);
}

function readThemeFromBrowser(): DesignThemeId {
  if (typeof window === "undefined") {
    return DEFAULT_DESIGN_THEME;
  }

  const stored = window.localStorage.getItem(DESIGN_THEME_STORAGE_KEY);
  if (stored && isThemeId(stored)) {
    return stored;
  }

  const attr = document.documentElement.getAttribute("data-theme");
  if (attr && isThemeId(attr)) {
    return attr;
  }

  return DEFAULT_DESIGN_THEME;
}

export function useActiveDesignTheme() {
  const [activeTheme, setActiveTheme] = useState<DesignThemeId>(() => readThemeFromBrowser());

  useEffect(() => {
    const onThemeChange = (event: Event) => {
      const custom = event as CustomEvent<{ themeId?: string }>;
      const next = custom.detail?.themeId;

      if (next && isThemeId(next)) {
        setActiveTheme(next);
        return;
      }

      setActiveTheme(readThemeFromBrowser());
    };

    window.addEventListener("design-theme-change", onThemeChange as EventListener);
    window.addEventListener("storage", onThemeChange as EventListener);

    return () => {
      window.removeEventListener("design-theme-change", onThemeChange as EventListener);
      window.removeEventListener("storage", onThemeChange as EventListener);
    };
  }, []);

  return activeTheme;
}
