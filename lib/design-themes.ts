export type DesignThemeId =
  | "midnight-lab"
  | "obsidian-ember"
  | "cyan-circuit"
  | "crimson-audit"
  | "forest-relay"
  | "polar-terminal";

export type DesignTheme = {
  id: DesignThemeId;
  name: string;
  mood: string;
};

export const DESIGN_THEMES: DesignTheme[] = [
  {
    id: "midnight-lab",
    name: "Midnight Lab",
    mood: "Cyan and amber control-room look",
  },
  {
    id: "obsidian-ember",
    name: "Obsidian Ember",
    mood: "Burnt copper editorial night mode",
  },
  {
    id: "cyan-circuit",
    name: "Cyan Circuit",
    mood: "Electric terminal with cool signals",
  },
  {
    id: "crimson-audit",
    name: "Crimson Audit",
    mood: "High-risk redline review console",
  },
  {
    id: "forest-relay",
    name: "Forest Relay",
    mood: "Deep green operations board",
  },
  {
    id: "polar-terminal",
    name: "Polar Terminal",
    mood: "Steel blue precision cockpit",
  },
];

export const DEFAULT_DESIGN_THEME: DesignThemeId = "midnight-lab";
export const DESIGN_THEME_STORAGE_KEY = "reviewforge-theme-v1";
