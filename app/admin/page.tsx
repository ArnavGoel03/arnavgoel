import type { Metadata } from "next";
import Link from "next/link";
import { Inbox, LogOut, Trash2 } from "lucide-react";
import { Container } from "@/components/container";
import { PageHeading } from "@/components/page-heading";
import { AdminTabs } from "./tabs";
import { EditList } from "./edit-list";
import { auth, signOut } from "@/auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  const email = session?.user?.email;

  async function doSignOut() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <>
      <Container>
        <PageHeading
          eyebrow="Dashboard"
          title="Manage content"
          description="Add or edit reviews and photos. Reviews commit to GitHub; photo uploads go to Vercel Blob at original quality. Site rebuilds in ~30-60s after each save."
        />
      </Container>
      <Container className="pb-20">
        {email && (
          <div className="mx-auto mb-8 flex max-w-3xl items-center justify-between gap-4 rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm">
            <div className="flex items-center gap-3 text-stone-600">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              <span>
                Signed in as{" "}
                <span className="font-medium text-stone-900">{email}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/admin/inbox"
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 px-3 py-1 text-xs text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900"
              >
                <Inbox className="h-3 w-3" />
                Inbox
              </Link>
              <Link
                href="/admin/trash"
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 px-3 py-1 text-xs text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900"
              >
                <Trash2 className="h-3 w-3" />
                Trash
              </Link>
              <form action={doSignOut}>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 px-3 py-1 text-xs text-stone-600 transition-colors hover:border-stone-900 hover:text-stone-900"
                >
                  <LogOut className="h-3 w-3" />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        )}
        <AdminTabs editList={<EditList />} />
      </Container>
    </>
  );
}
