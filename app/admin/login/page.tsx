import type { Metadata } from "next";
import { Container } from "@/components/container";
import { loginAction } from "./actions";

export const metadata: Metadata = {
  title: "Admin · Sign in",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ from?: string; err?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { from, err } = await searchParams;
  const passwordConfigured = !!process.env.ADMIN_PASSWORD;

  return (
    <Container className="max-w-sm py-20">
      <div className="mb-10 flex items-baseline gap-2 text-[11px] uppercase tracking-[0.22em] text-stone-500">
        <span className="text-rose-400">❋</span>
        <span>Admin</span>
      </div>

      <h1 className="mb-2 font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
        Sign in<span className="text-rose-400">.</span>
      </h1>
      <p className="mb-8 font-serif text-lg italic text-stone-500">
        Private, the dashboard that commits to GitHub.
      </p>

      {!passwordConfigured ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-medium">ADMIN_PASSWORD is not set.</p>
          <p className="mt-1 text-amber-800">
            Auth is bypassed, anyone reaching this page goes straight to
            /admin. Set <code className="font-mono">ADMIN_PASSWORD</code>{" "}
            in Vercel environment variables to require sign-in.
          </p>
        </div>
      ) : (
        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="from" value={from ?? "/admin"} />
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs uppercase tracking-wider text-stone-500"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoFocus
              required
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition-colors focus:border-stone-900"
            />
          </div>

          {err && (
            <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
              Wrong password.
            </p>
          )}

          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-6 text-sm font-medium text-white transition-colors hover:bg-stone-800"
          >
            Sign in
          </button>
        </form>
      )}
    </Container>
  );
}
