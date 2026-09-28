import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogPostBySlug, blogPosts } from "@/lib/domain/blog-content";
import { ContactForm } from "@/components/site/ContactForm";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  return {
    title: post ? `${post.title} | RK & Associates` : "Blog | RK & Associates",
    description: post?.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const recentPosts = blogPosts.filter((p) => p.slug !== post.slug);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-slate-900 text-white py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-emerald-400 transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-emerald-400 transition">
              All Posts
            </Link>
            <span>/</span>
            <span className="text-emerald-400">Article</span>
          </div>

          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                AK
              </div>
              <span className="font-medium text-white">{post.author}</span>
            </div>
            <span>&bull;</span>
            <span>{post.date}</span>
            <span>&bull;</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="prose prose-slate prose-lg max-w-none">
            {post.content.map((paragraph, idx) => (
              <p key={idx} className="mb-6 text-base leading-relaxed text-slate-700 sm:text-lg">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-8">
            <h3 className="text-xl font-bold text-emerald-950">
              Ready to Optimize Your Business Financials?
            </h3>
            <p className="mt-2 text-sm text-emerald-900 leading-relaxed">
              Take the first step towards financial success and contact us today to schedule a
              consultation. Let us take the stress out of financial management so you can focus on
              what you do best &ndash; growing your business.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/book-online"
                className="rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
              >
                Book a Consultation Online
              </Link>
              <a
                href="tel:+353899660987"
                className="inline-flex items-center rounded-lg border border-emerald-300 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-900 hover:bg-emerald-100 transition"
              >
                Call: +353 89 966 0987
              </a>
            </div>
          </div>

          {/* Recent Posts */}
          <div className="mt-16 border-t border-slate-200 pt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Recent Posts</h2>
              <Link
                href="/blog"
                className="text-sm font-semibold text-emerald-800 hover:text-emerald-700"
              >
                See All &rarr;
              </Link>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {recentPosts.map((rPost) => (
                <div
                  key={rPost.slug}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 transition hover:border-emerald-600 hover:bg-white"
                >
                  <p className="text-xs text-slate-500">{rPost.date} &bull; {rPost.readTime}</p>
                  <h3 className="mt-2 font-bold text-slate-900">
                    <Link href={`/post/${rPost.slug}`}>{rPost.title}</Link>
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 line-clamp-2">{rPost.excerpt}</p>
                  <Link
                    href={`/post/${rPost.slug}`}
                    className="mt-4 inline-block text-xs font-semibold text-emerald-800 hover:underline"
                  >
                    Read More &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">Contact Us</h2>
            <p className="mt-2 text-sm text-slate-600">
              We&apos;d love to hear from you! Please reach out with any comments or feedback.
            </p>
          </div>
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
