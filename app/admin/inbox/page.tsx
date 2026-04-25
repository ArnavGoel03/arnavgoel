import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/container";
import { PageHeading } from "@/components/page-heading";
import { commitRepoFile, readRepoFile } from "@/lib/github";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Inbox",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const INBOX_PATH = "content/_inbox.json";

type InboxEntry = {
  id: string;
  kind: string;
  slug: string;
  name?: string;
  note: string;
  createdAt: string;
  read: boolean;
  ip?: string;
  ua?: string;
};

async function loadInbox(): Promise<InboxEntry[]> {
  try {
    const raw = await readRepoFile(INBOX_PATH);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as InboxEntry[];
    return parsed.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

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

async function toggleRead(formData: FormData): Promise<void> {
  "use server";
  await authorize();
  const id = formData.get("id");
  if (typeof id !== "string") return;
  const list = await loadInbox();
  const next = list.map((e) =>
    e.id === id ? { ...e, read: !e.read } : e,
  );
  await commitRepoFile({
    path: INBOX_PATH,
    content: JSON.stringify(next, null, 2) + "\n",
    message: `inbox: toggle read on ${id.slice(0, 8)}`,
  });
}

async function deleteEntry(formData: FormData): Promise<void> {
  "use server";
  await authorize();
  const id = formData.get("id");
  if (typeof id !== "string") return;
  const list = await loadInbox();
  const next = list.filter((e) => e.id !== id);
  await commitRepoFile({
    path: INBOX_PATH,
    content: JSON.stringify(next, null, 2) + "\n",
    message: `inbox: delete ${id.slice(0, 8)}`,
  });
}

function relTime(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const minutes = Math.round(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return d.toLocaleDateString();
}

export default async function InboxPage() {
  await authorize();
  const entries = await loadInbox();
  const unread = entries.filter((e) => !e.read);
  const read = entries.filter((e) => e.read);

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
            {unread.length} unread · {entries.length} total
          </span>
        </div>
        <PageHeading
          eyebrow="Reader inbox"
          title="What people are saying."
          description="Private notes from readers. Nothing here is publicly visible. Mark read once you have processed; delete anything spammy."
        />
      </Container>
      <Container className="pb-20">
        <div className="mx-auto max-w-3xl">
          {entries.length === 0 ? (
            <p className="rounded-2xl border border-stone-200 bg-stone-50 px-6 py-12 text-center text-sm italic text-stone-500">
              Quiet inbox. No reader notes yet.
            </p>
          ) : (
            <>
              {unread.length > 0 && (
                <Section title="Unread" entries={unread} />
              )}
              {read.length > 0 && <Section title="Read" entries={read} />}
            </>
          )}
        </div>
      </Container>
    </>
  );
}

function Section({
  title,
  entries,
}: {
  title: string;
  entries: InboxEntry[];
}) {
  return (
    <section className="mb-12">
      <h2 className="mb-4 font-serif text-2xl text-stone-900">{title}</h2>
      <ul className="space-y-4">
        {entries.map((e) => (
          <li
            key={e.id}
            className={
              "rounded-2xl border bg-white p-5 transition-colors " +
              (e.read
                ? "border-stone-200 opacity-70"
                : "border-stone-300 shadow-sm")
            }
          >
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2 text-xs">
              <Link
                href={`/${e.kind}/${e.slug}`}
                target="_blank"
                className="text-stone-500 underline-offset-4 transition-colors hover:text-stone-900 hover:underline"
              >
                {e.kind}/{e.slug} ↗
              </Link>
              <span className="text-stone-400" title={e.createdAt}>
                {relTime(e.createdAt)}
              </span>
            </div>
            <p className="whitespace-pre-wrap font-serif text-base leading-relaxed text-stone-800">
              {e.note}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-stone-500">
              <span>
                {e.name ? (
                  <>
                    From <span className="text-stone-700">{e.name}</span>
                  </>
                ) : (
                  <span className="italic">Anonymous</span>
                )}
              </span>
              <span aria-hidden>·</span>
              <form action={toggleRead}>
                <input type="hidden" name="id" value={e.id} />
                <button
                  type="submit"
                  className="text-stone-500 underline-offset-4 transition-colors hover:text-stone-900 hover:underline"
                >
                  {e.read ? "Mark unread" : "Mark read"}
                </button>
              </form>
              <form action={deleteEntry}>
                <input type="hidden" name="id" value={e.id} />
                <button
                  type="submit"
                  className="text-rose-600 underline-offset-4 transition-colors hover:text-rose-700 hover:underline"
                >
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
