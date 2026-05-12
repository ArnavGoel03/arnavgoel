/**
 * Device-bound HMAC cookie used to gate /admin/* behind a "this is a
 * known browser" check, on top of Google OAuth + ALLOWED_ADMIN_EMAIL.
 *
 * Cookie value shape: `<id>.<hmac(ADMIN_DEVICE_SECRET, id)>`, where
 * `id` is 16 random bytes hex-encoded. The id is unique per device
 * stamp; the HMAC ties it to the server-side secret so a forged
 * cookie can't be constructed without knowing the secret.
 *
 * Implementation uses the Web Crypto API (`crypto.subtle`) so the
 * Edge runtime middleware (proxy.ts) can call into it without pulling
 * `node:crypto`. The same module is reused by the setup route running
 * in the Node runtime.
 */

export const DEVICE_COOKIE = "yg_device";

function bytesToHex(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, "0");
  }
  return out;
}

async function importKey(): Promise<CryptoKey | null> {
  const secret = process.env.ADMIN_DEVICE_SECRET;
  if (!secret) return null;
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

async function hmacHex(input: string): Promise<string | null> {
  const key = await importKey();
  if (!key) return null;
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(input),
  );
  return bytesToHex(new Uint8Array(sig));
}

export async function mintDeviceCookieValue(): Promise<string | null> {
  const idBytes = new Uint8Array(16);
  crypto.getRandomValues(idBytes);
  const id = bytesToHex(idBytes);
  const sig = await hmacHex(id);
  if (!sig) return null;
  return `${id}.${sig}`;
}

export async function verifyDeviceCookie(
  value: string | undefined,
): Promise<boolean> {
  if (!value) return false;
  const dot = value.indexOf(".");
  if (dot <= 0 || dot === value.length - 1) return false;
  const id = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  if (!/^[0-9a-f]+$/i.test(id) || !/^[0-9a-f]+$/i.test(sig)) return false;
  const expected = await hmacHex(id);
  if (!expected || expected.length !== sig.length) return false;
  // Constant-time string compare to avoid timing side channels.
  let diff = 0;
  for (let i = 0; i < sig.length; i++) {
    diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Verify a one-time setup token (from query string) against the
 * server-side env var. Constant-time to keep timing attacks off the
 * table even though the secret length is the same for every visit.
 */
export function verifySetupToken(provided: string | undefined): boolean {
  const expected = process.env.ADMIN_DEVICE_SETUP_TOKEN;
  if (!expected || !provided) return false;
  if (expected.length !== provided.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ provided.charCodeAt(i);
  }
  return diff === 0;
}
