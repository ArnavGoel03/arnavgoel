import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { slugifyHeading } from "@/lib/utils";

/**
 * Editorial sidenote / margin note. Use inline in MDX:
 *
 *   <Aside>Ceramides degrade in sunlight — hence opaque tubes.</Aside>
 *
 * Floats to the right gutter on wide screens so the main read isn't
 * interrupted; inlines above the next paragraph on mobile.
 */
function Aside({
  children,
  label,
}: {
  children?: React.ReactNode;
  label?: string;
}) {
  return (
    <aside className="not-prose my-5 rounded-md border-l-2 border-rose-300 bg-rose-50/60 px-4 py-3 font-serif text-sm italic leading-relaxed text-stone-700 sm:my-6 lg:float-right lg:clear-right lg:-mr-4 lg:ml-6 lg:w-60 lg:rounded-none lg:border-l lg:bg-transparent lg:px-0 lg:pl-4">
      {label && (
        <p className="mb-1 font-sans text-[10px] uppercase not-italic tracking-[0.2em] text-rose-500">
          {label}
        </p>
      )}
      {children}
    </aside>
  );
}

/**
 * Stable, deterministic heading IDs so TOCs and deep-links work. We
 * only slugify when children is a single string — complex JSX headings
 * would need a full AST walk.
 */
function textOf(node: React.ReactNode): string | null {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) {
    const parts = node.map(textOf);
    if (parts.some((p) => p === null)) return null;
    return parts.join("");
  }
  return null;
}

const mdxComponents = {
  Aside,
  h2: ({ children, ...rest }: { children?: React.ReactNode }) => {
    const text = textOf(children);
    const id = text ? slugifyHeading(text) : undefined;
    return (
      <h2 id={id} {...rest}>
        {children}
      </h2>
    );
  },
  h3: ({ children, ...rest }: { children?: React.ReactNode }) => {
    const text = textOf(children);
    const id = text ? slugifyHeading(text) : undefined;
    return (
      <h3 id={id} {...rest}>
        {children}
      </h3>
    );
  },
};

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-normal prose-h2:mt-10 prose-h2:scroll-mt-28 prose-h2:text-2xl prose-h3:text-xl prose-h3:scroll-mt-28 prose-p:leading-relaxed prose-a:text-stone-900 prose-a:underline-offset-4 prose-strong:text-stone-900 dark:prose-invert dark:prose-a:text-stone-100 dark:prose-strong:text-stone-100">
      <MDXRemote
        source={source}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        components={mdxComponents}
      />
    </div>
  );
}
