import React from "react";
import { Button } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import CallToAction from "@/app/components/CallToAction";
import RecentPosts from "@/app/components/RecentPosts";
import CommentSection from "@/app/components/CommentSection";

type Post = {
  title: string;
  category: string;
  image: string;
  content: string;
  createdAt: string;
  slug: string;
};

export default async function Page(props: { params: { slug: string } }) {
  const { params } = props;
  const { slug } = params;

  let post: Post | null = null;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/post/get`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
        cache: "no-store",
      }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    post = data.posts[0];

    if (!post) throw new Error("Post not found");
  } catch (error) {
    console.error("Error loading post:", error);
    return (
      <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h2 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          Post not found
        </h2>
      </main>
    );
  }

  const readingTime = Math.ceil(post.content.length / 1000);

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <article>
        <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          {post.title}
        </h1>

        <div className="self-center mt-5">
          <Link href={`/search?category=${encodeURIComponent(post.category)}`}>
            <Button color="gray" pill size="xs">
              {post.category}
            </Button>
          </Link>
        </div>

        <div className="mt-10 p-3">
          <Image
            src={post.image}
            alt={post.title}
            width={800}
            height={600}
            className="max-h-[600px] w-full object-cover rounded-lg shadow-xl"
            priority
          />
        </div>

        <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          <time dateTime={post.createdAt}>
            {new Date(post.createdAt).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span>{readingTime} min read</span>
        </div>
      </article>

      <section
        className="p-3 max-w-2xl mx-auto w-full post-content prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="max-w-4xl mx-auto w-full my-12">
        <CallToAction />
      </div>

      <div className="my-12">
        <h2 className="text-2xl font-bold mb-6 text-center">
          More Recent Posts
        </h2>
        <RecentPosts limit={3} excludeSlug={post.slug} />
      </div>

      <section className="max-w-4xl mx-auto w-full mt-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Join the Discussion
        </h2>
        <CommentSection postId={slug} />
      </section>
    </main>
  );
}
