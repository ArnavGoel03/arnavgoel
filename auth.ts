import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Auth.js v5 configuration. Single-tenant admin auth: only the email
 * listed in ALLOWED_ADMIN_EMAIL can sign in. If no allow-list is
 * configured, nobody gets through.
 *
 * The Google provider and AUTH_SECRET are checked at runtime (not at
 * module load), so the build succeeds even before env vars are set on
 * Vercel. The /admin/login page renders a "not configured" banner in
 * that case and blocks the flow cleanly.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      // Auth.js reads env by default; listing explicitly avoids any
      // implicit-discovery surprises during edge/runtime initialization.
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
    }),
  ],

  // Secret is required by Auth.js v5. Fall back to an obviously-fake
  // string so the module can load in environments where AUTH_SECRET
  // hasn't been configured yet. The sign-in flow still rejects
  // everything without real credentials.
  secret: process.env.AUTH_SECRET ?? "build-time-placeholder-do-not-use",

  trustHost: true,

  callbacks: {
    /**
     * Runs after Google returns a successful OAuth response but before
     * the session is created. We reject any sign-in whose email
     * doesn't match the configured admin email.
     */
    async signIn({ user }) {
      const allowed = (process.env.ALLOWED_ADMIN_EMAIL ?? "")
        .toLowerCase()
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);
      if (allowed.length === 0) return false;
      const email = user.email?.toLowerCase();
      if (!email) return false;
      return allowed.includes(email);
    },

    async session({ session, token }) {
      if (token.email && session.user) {
        session.user.email = token.email;
      }
      return session;
    },
  },

  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },

  session: { strategy: "jwt" },
});
