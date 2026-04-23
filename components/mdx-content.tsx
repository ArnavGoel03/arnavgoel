import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-normal prose-h2:mt-10 prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-a:text-stone-900 prose-a:underline-offset-4 prose-strong:text-stone-900">
      <MDXRemote
        source={source}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      />
    </div>
  );
}
