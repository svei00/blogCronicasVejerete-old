// src/app/post/[slug]/page.tsx

import React from "react";
import { Button } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import CallToAction from "@/app/components/CallToAction";
import RecentPosts from "@/app/components/RecentPosts";
import CommentSection from "@/app/components/CommentSection";

// Define the shape of the post data returned by your API
type Post = {
  title: string;
  category: string;
  image: string;
  content: string;
  createdAt: string;
};

/**
 * This is the Next.js App Router page for /post/[slug].
 *    - Must be named `Page`
 *    - Props: { params: { slug: string } }
 */
export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // 1. Fetch the post data
  let post: Post;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/get`, {
      method: "POST",
      body: JSON.stringify({ slug }),
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch post: ${res.status}`);
    }
    const json = await res.json();
    post = json.posts[0];
    if (!post) {
      throw new Error("No post returned");
    }
  } catch (err: unknown) {
    console.error("Error loading post:", err);
    // Early return "not found" page if fetch fails
    return (
      <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h2 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          Post not found
        </h2>
      </main>
    );
  }

  // 2. Render the post content + comments
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      {/* Title */}
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post.title}
      </h1>

      {/* Category link */}
      <Link
        href={`/search?category=${encodeURIComponent(post.category)}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post.category}
        </Button>
      </Link>

      {/* Image */}
      <Image
        src={post.image}
        alt={post.title}
        width={800}
        height={600}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />

      {/* Metadata */}
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {(post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>

      {/* HTML content */}
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Call to Action */}
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>

      {/* Recent Posts */}
      <RecentPosts limit={3} />

      {/* Comments Section */}
      <section className="max-w-4xl mx-auto w-full mt-16">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        <CommentSection postId={slug} />
      </section>
    </main>
  );
}
