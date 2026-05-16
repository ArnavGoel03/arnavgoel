// Shared between the client `ThemeToggle` component and the server-side
// inline init script so they stay in lockstep — change one, both update.

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "yashgoel-theme";

// Dark is the house style: the editorial stone-on-near-black aesthetic
// looks right by default. Users who prefer light can still toggle, and
// the choice is persisted for next visit.
export const DEFAULT_THEME: Theme = "dark";
