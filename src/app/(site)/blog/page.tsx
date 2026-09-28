import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/domain/blog-content";
import { ContactCTA } from "@/components/site/ContactCTA";

export const metadata: Metadata = {
  title: "Blog & Accounting Insights | RK & Associates",
  description:
    "Articles and insights on financial management, startup accountancy, bookkeeping, and tax planning by Arpit Khurana at RK & Associates.",
};

export default function BlogListingPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-slate-900 text-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            RK &amp; Associates
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            All Posts
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-300">
            Stay informed with our latest articles on financial management, tax strategies, and
            accountancy insights for Irish businesses and freelancers.
          </p>
        </div>
      </section>

      {/* Posts List */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-emerald-600 hover:shadow-md"
              >
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-xl font-bold tracking-tight text-slate-900 hover:text-emerald-800 transition">
                    <Link href={`/post/${post.slug}`}>{post.title}</Link>
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-4">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div>
                    <p className="font-semibold text-slate-900">{post.author}</p>
                    <p>
                      {post.date} &bull; {post.readTime}
                    </p>
                  </div>
                  <Link
                    href={`/post/${post.slug}`}
                    className="font-semibold text-emerald-800 hover:text-emerald-700"
                  >
                    Read &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section (Navigates to /contact-us) */}
      <ContactCTA
        title="Have Questions or Need Financial Guidance?"
        subtitle="CONTACT US"
        description="We’d love to hear from you! Please reach out with any comments, questions, or feedback."
      />
    </div>
  );
}
