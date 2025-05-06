// src/app/post/[slug]/page.tsx

import React from "react";
import { Button } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import CallToAction from "@/app/components/CallToAction";
import RecentPosts from "@/app/components/RecentPosts";
import CommentSection from "@/app/components/CommentSection";

// Define the shape of a Post object as returned by your API
type Post = {
  title: string;
  category: string;
  image: string;
  content: string;
  createdAt: string;
};

// This page lives at /post/[slug]
// Next.js will call it with a props object that contains `params.slug`
export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

  // Fetch post data from your backend API
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
    // Log error and render a fallback
    console.error("Error loading post:", err);
    return (
      <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h2 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          Post not found
        </h2>
      </main>
    );
  }

  // Render the post along with comments
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

      {/* Main image */}
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

      {/* Content HTML */}
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Call to action */}
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>

      {/* Recent posts */}
      <RecentPosts limit={3} />

      {/* Comments section */}
      <section className="max-w-4xl mx-auto w-full mt-16">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        <CommentSection postId={slug} />
      </section>
    </main>
  );
}
