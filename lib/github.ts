const API = "https://api.github.com";

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function branch(): string {
  return process.env.GITHUB_BRANCH ?? "main";
}

function repoUrl(repoPath: string): string {
  return `${API}/repos/${env("GITHUB_OWNER")}/${env("GITHUB_REPO")}/contents/${repoPath}`;
}

function authHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${env("GITHUB_TOKEN")}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function getFile(
  repoPath: string,
): Promise<{ sha: string; content: string } | null> {
  const r = await fetch(`${repoUrl(repoPath)}?ref=${branch()}`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (r.status === 404) return null;
  if (!r.ok) {
    throw new Error(`GitHub GET ${repoPath} failed: ${r.status} ${await r.text()}`);
  }
  const data = (await r.json()) as { sha: string; content: string; encoding: string };
  const content =
    data.encoding === "base64"
      ? Buffer.from(data.content, "base64").toString("utf8")
      : data.content;
  return { sha: data.sha, content };
}

export async function readRepoFile(repoPath: string): Promise<string | null> {
  const file = await getFile(repoPath);
  return file?.content ?? null;
}

export async function commitRepoFile(args: {
  path: string;
  content: string;
  message: string;
  expectExisting?: boolean;
}): Promise<{ commit: string }> {
  const existing = await getFile(args.path);
  if (existing && args.expectExisting === false) {
    throw new Error(`Refusing to overwrite existing file: ${args.path}`);
  }
  const body = {
    message: args.message,
    content: Buffer.from(args.content, "utf8").toString("base64"),
    branch: branch(),
    ...(existing ? { sha: existing.sha } : {}),
  };
  const r = await fetch(repoUrl(args.path), {
    method: "PUT",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    throw new Error(
      `GitHub PUT ${args.path} failed: ${r.status} ${await r.text()}`,
    );
  }
  const data = (await r.json()) as { commit: { sha: string } };
  return { commit: data.commit.sha };
}
