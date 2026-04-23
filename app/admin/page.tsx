import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHeading } from "@/components/page-heading";
import { AdminTabs } from "./tabs";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <>
      <Container>
        <PageHeading
          eyebrow="Dashboard"
          title="Add content"
          description="Reviews commit to GitHub. Photo uploads go to Vercel Blob at original quality. Site rebuilds in ~30–60s after each save."
        />
      </Container>
      <Container className="pb-20">
        <div className="mx-auto mb-10 max-w-3xl rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>No auth is configured.</strong> Anyone who visits this URL can write
          to your repo. Keep the URL private until we add a password.
        </div>
        <AdminTabs />
      </Container>
    </>
  );
}
