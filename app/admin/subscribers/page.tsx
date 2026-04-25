import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/container";
import { PageHeading } from "@/components/page-heading";
import { commitRepoFile, readRepoFile } from "@/lib/github";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Subscribers",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const SUBSCRIBERS_PATH = "content/_subscribers.json";

type Subscriber = {
  id: string;
  email: string;
  source: string;
  confirmed: boolean;
  unsubscribed: boolean;
  unsubscribeToken: string;
  confirmToken: string;
  createdAt: string;
};

async function authorize(): Promise<void> {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase() ?? null;
  if (!email) redirect("/admin/login");
  const allowed = (process.env.ALLOWED_ADMIN_EMAIL ?? "")
    .toLowerCase()
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  if (allowed.length === 0 || !allowed.includes(email)) {
    redirect("/admin/login");
  }
}

async function loadSubscribers(): Promise<Subscriber[]> {
  try {
    const raw = await readRepoFile(SUBSCRIBERS_PATH);
    if (!raw) return [];
    return (JSON.parse(raw) as Subscriber[]).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  } catch {
    return [];
  }
}

async function deleteSub(formData: FormData): Promise<void> {
  "use server";
  await authorize();
  const id = formData.get("id");
  if (typeof id !== "string") return;
  const list = await loadSubscribers();
  const next = list.filter((s) => s.id !== id);
  await commitRepoFile({
    path: SUBSCRIBERS_PATH,
    content: JSON.stringify(next, null, 2) + "\n",
    message: `subscribers: remove ${id.slice(0, 8)}`,
  });
}

async function manuallyConfirm(formData: FormData): Promise<void> {
  "use server";
  await authorize();
  const id = formData.get("id");
  if (typeof id !== "string") return;
  const list = await loadSubscribers();
  const next = list.map((s) =>
    s.id === id ? { ...s, confirmed: true } : s,
  );
  await commitRepoFile({
    path: SUBSCRIBERS_PATH,
    content: JSON.stringify(next, null, 2) + "\n",
    message: `subscribers: manually confirm ${id.slice(0, 8)}`,
  });
}

function relTime(iso: string): string {
  const d = new Date(iso);
  const minutes = Math.round((Date.now() - d.getTime()) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return d.toLocaleDateString();
}

export default async function SubscribersPage() {
  await authorize();
  const subs = await loadSubscribers();
  const confirmed = subs.filter((s) => s.confirmed && !s.unsubscribed);
  const pending = subs.filter((s) => !s.confirmed && !s.unsubscribed);
  const gone = subs.filter((s) => s.unsubscribed);

  return (
    <>
      <Container>
        <div className="flex items-center justify-between pt-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          <span className="text-xs uppercase tracking-[0.18em] text-stone-400">
            {confirmed.length} confirmed · {pending.length} pending ·{" "}
            {gone.length} unsubscribed
          </span>
        </div>
        <PageHeading
          eyebrow="Subscriber list"
          title="The list."
          description="Confirmed addresses get the digest. Pending ones are awaiting opt-in. Manually confirm if Resend isn't wired yet, or delete a row entirely if it's spam."
        />
      </Container>
      <Container className="pb-20">
        <div className="mx-auto max-w-3xl space-y-12">
          {subs.length === 0 ? (
            <p className="rounded-2xl border border-stone-200 bg-stone-50 px-6 py-12 text-center text-sm italic text-stone-500">
              No subscribers yet. Drop the /subscribe link in a few places.
            </p>
          ) : (
            <>
              {confirmed.length > 0 && (
                <Section
                  title={`Confirmed (${confirmed.length})`}
                  rows={confirmed}
                  showConfirm={false}
                />
              )}
              {pending.length > 0 && (
                <Section
                  title={`Pending opt-in (${pending.length})`}
                  rows={pending}
                  showConfirm
                />
              )}
              {gone.length > 0 && (
                <Section
                  title={`Unsubscribed (${gone.length})`}
                  rows={gone}
                  showConfirm={false}
                />
              )}
            </>
          )}
        </div>
      </Container>
    </>
  );

  function Section({
    title,
    rows,
    showConfirm,
  }: {
    title: string;
    rows: Subscriber[];
    showConfirm: boolean;
  }) {
    return (
      <section>
        <h2 className="mb-4 font-serif text-2xl text-stone-900">{title}</h2>
        <ul className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
          {rows.map((s) => (
            <li
              key={s.id}
              className="flex flex-wrap items-baseline justify-between gap-3 border-b border-stone-100 px-5 py-3 text-sm last:border-none"
            >
              <span className="font-mono text-stone-900">{s.email}</span>
              <span className="text-xs text-stone-500" title={s.createdAt}>
                via {s.source} · {relTime(s.createdAt)}
              </span>
              <div className="flex items-center gap-3 text-xs">
                {showConfirm && (
                  <form action={manuallyConfirm}>
                    <input type="hidden" name="id" value={s.id} />
                    <button className="text-stone-500 underline-offset-4 hover:text-stone-900 hover:underline">
                      Confirm
                    </button>
                  </form>
                )}
                <form action={deleteSub}>
                  <input type="hidden" name="id" value={s.id} />
                  <button className="text-rose-600 underline-offset-4 hover:text-rose-700 hover:underline">
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </section>
    );
  }
}
