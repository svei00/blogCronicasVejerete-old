// src/app/post/[slug]/page.tsx

"use client";
// We need "use client" so that this file can render the client-side CommentSection component.

import React from "react";
import { Button } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import CallToAction from "@/app/components/CallToAction";
import RecentPosts from "@/app/components/RecentPosts";
import CommentSection from "@/app/components/CommentSection"; // Import the comment UI

// Define the shape of a Post object
interface Post {
  title: string;
  category: string;
  image: string;
  content: string;
  createdAt: string;
}

// Props type for this page: params.slug will be provided by the router
interface PostPageProps {
  params: {
    slug: string;
  };
}

// This page component fetches its own data and then renders both server-side and client-side pieces
export default async function PostPage({ params }: PostPageProps) {
  const slug = params.slug;

  // Fetch the post data from your existing API endpoint
  let post: Post | null = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/get`, {
      method: "POST",
      body: JSON.stringify({ slug }),
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch post");
    }
    const data = await res.json();
    post = data.posts[0];
  } catch (err: unknown) {
    console.error("Error fetching post:", err);
    post = {
      title: "Failed to load post",
      category: "",
      image: "",
      content: "",
      createdAt: "",
    };
  }

  // If no post found or fetch failed, show a not-found message
  if (!post || post.title === "Failed to load post") {
    return (
      <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h2 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          Post not found
        </h2>
      </main>
    );
  }

  // Render the post along with CallToAction, RecentPosts, and CommentSection
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      {/* Post title */}
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post.title}
      </h1>

      {/* Button linking to category search */}
      <Link
        href={`/search?category=${encodeURIComponent(post.category)}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post.category}
        </Button>
      </Link>

      {/* Post image */}
      <Image
        src={post.image}
        alt={post.title}
        width={800}
        height={600}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />

      {/* Metadata: date and reading time */}
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {(post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>

      {/* Post content */}
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Call to action banner */}
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>

      {/* Recent posts section */}
      <RecentPosts limit={3} />

      {/* Comments section */}
      <section className="max-w-4xl mx-auto w-full mt-16">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        <CommentSection postId={slug} />
      </section>
    </main>
  );
}
