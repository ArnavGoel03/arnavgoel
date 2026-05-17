import { DEFAULT_THEME, THEME_STORAGE_KEY } from "@/lib/theme-constants";

// Inline script injected into <head> to apply the saved theme BEFORE
// React hydrates — avoids the "flash of light UI" when a user has
// chosen dark. Body is static (only build-time constants interpolated),
// so we authorize it via a SHA-256 CSP source-expression instead of a
// per-request nonce. That keeps app/layout.tsx free of `headers()`,
// which under Next 16 cacheComponents would otherwise mark the whole
// shell as dynamic and break /_not-found prerender.
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

// Precomputed SHA-256 of the exact byte sequence above. `node:crypto`
// is not available in Edge middleware, so the hash is baked in as a
// literal. If you edit `themeInitScript`, regenerate with:
//   node -e "const{createHash}=require('crypto');const{readFileSync}=require('fs');const m=readFileSync('lib/theme-script.ts','utf8').match(/themeInitScript = \`([\s\S]*?)\`/);console.log('sha256-'+createHash('sha256').update(m[1]).digest('base64'))"
export const themeInitScriptCspSource =
  "'sha256-oSd5tTgj4ePMIvXiwqre9x4DNHZhYDpz8ijH6cLAUzs='";
