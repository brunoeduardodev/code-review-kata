"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_DESIGN_THEME,
  DESIGN_THEMES,
  DESIGN_THEME_STORAGE_KEY,
  DesignThemeId,
} from "@/lib/design-themes";

const themeIdSet = new Set<DesignThemeId>(DESIGN_THEMES.map((theme) => theme.id));

const swatchByTheme: Record<DesignThemeId, string> = {
  "midnight-lab": "linear-gradient(135deg, #55e6c1, #f7b955)",
  "obsidian-ember": "linear-gradient(135deg, #f39b5d, #ffcf84)",
  "cyan-circuit": "linear-gradient(135deg, #69f7ff, #62b4ff)",
  "crimson-audit": "linear-gradient(135deg, #ff6477, #ff9a6a)",
  "forest-relay": "linear-gradient(135deg, #4ddb8d, #93c862)",
  "polar-terminal": "linear-gradient(135deg, #9dd8ff, #d5f4ff)",
};

function isThemeId(value: string): value is DesignThemeId {
  return themeIdSet.has(value as DesignThemeId);
}

function applyTheme(themeId: DesignThemeId) {
  document.documentElement.setAttribute("data-theme", themeId);
}

export function DesignSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<DesignThemeId>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_DESIGN_THEME;
    }

    const stored = window.localStorage.getItem(DESIGN_THEME_STORAGE_KEY);
    if (stored && isThemeId(stored)) {
      return stored;
    }

    return DEFAULT_DESIGN_THEME;
  });

  useEffect(() => {
    applyTheme(activeTheme);
  }, [activeTheme]);

  function handleThemeChange(themeId: DesignThemeId) {
    setActiveTheme(themeId);
    applyTheme(themeId);
    window.localStorage.setItem(DESIGN_THEME_STORAGE_KEY, themeId);
    window.dispatchEvent(new CustomEvent("design-theme-change", { detail: { themeId } }));
    setIsOpen(false);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex max-w-[320px] flex-col items-end gap-2">
      {isOpen ? (
        <div className="w-[290px] rounded-2xl border border-[var(--line)] bg-[color:var(--surface)]/96 p-3 shadow-2xl backdrop-blur-sm">
          <p className="wire-label px-1">Design Proposals</p>
          <p className="mt-1 px-1 text-xs text-[var(--muted)]">Choose one of six dark themes.</p>
          <div className="mt-3 space-y-2">
            {DESIGN_THEMES.map((theme) => {
              const isActive = theme.id === activeTheme;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => handleThemeChange(theme.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                    isActive
                      ? "border-[var(--accent)] bg-[color:var(--accent)]/12"
                      : "border-[var(--line)] bg-[color:var(--surface-2)] hover:border-[var(--accent)]/55"
                  }`}
                >
                  <span
                    className="h-6 w-6 shrink-0 rounded-full border border-black/25"
                    style={{ backgroundImage: swatchByTheme[theme.id] }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-[var(--ink)]">{theme.name}</span>
                    <span className="block truncate text-xs text-[var(--muted)]">{theme.mood}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[color:var(--surface)]/96 px-4 py-2.5 text-sm font-semibold text-[var(--ink)] shadow-xl backdrop-blur-sm transition hover:border-[var(--accent)]/60"
      >
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundImage: swatchByTheme[activeTheme] }}
          aria-hidden
        />
        Theme: {DESIGN_THEMES.find((theme) => theme.id === activeTheme)?.name}
      </button>
    </div>
  );
}
