import { createHash } from "node:crypto";
import { DEFAULT_THEME, THEME_STORAGE_KEY } from "@/lib/theme-constants";

// Inline script injected into <head> to apply the saved theme BEFORE
// React hydrates — avoids the "flash of light UI" when a user has
// chosen dark. Keep this tiny; it runs on every navigation.
//
// The body is static (only build-time constants are interpolated), so
// we authorize it via a SHA-256 hash in CSP instead of a per-request
// nonce. That keeps app/layout.tsx free of `headers()`, which under
// Next 16 cacheComponents would otherwise mark the whole shell as
// dynamic and break /_not-found prerender.
export const themeInitScript = `
(function(){
  try {
    var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
    var theme = (stored === 'light' || stored === 'dark') ? stored : '${DEFAULT_THEME}';
    if (theme === 'dark') document.documentElement.classList.add('dark');
    document.documentElement.dataset.theme = theme;
  } catch (e) {
    document.documentElement.classList.add('dark');
    document.documentElement.dataset.theme = '${DEFAULT_THEME}';
  }
})();
`;

// CSP source-expression for the inline script above. Browsers compute
// the hash over the exact byte sequence between <script> and </script>,
// so this MUST match `themeInitScript` verbatim — any edit to the
// string above regenerates the hash automatically.
export const themeInitScriptCspSource = `'sha256-${createHash("sha256")
  .update(themeInitScript)
  .digest("base64")}'`;
