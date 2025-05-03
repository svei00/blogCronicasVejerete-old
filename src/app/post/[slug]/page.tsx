// src/app/post/[slug]/page.tsx

import React from "react";
import { Button } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import CallToAction from "@/app/components/CallToAction";
import RecentPosts from "@/app/components/RecentPosts";
import CommentSection from "@/app/components/CommentSection"; // Client component

// Shape of your post data
interface Post {
  title: string;
  category: string;
  image: string;
  content: string;
  createdAt: string;
}

// Props for this page: params.slug is provided directly
interface PostPageProps {
  params: {
    slug: string;
  };
}

// This is a SERVER component (no "use client" here)
// so we can fetch data with await.
export default async function PostPage({ params }: PostPageProps) {
  const slug = params.slug;

  // Fetch the post data
  let post: Post | null = null;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/get`, {
      method: "POST",
      body: JSON.stringify({ slug }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch post");
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

  if (!post || post.title === "Failed to load post") {
    return (
      <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h2 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          Post not found
        </h2>
      </main>
    );
  }

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post.title}
      </h1>

      <Link
        href={`/search?category=${encodeURIComponent(post.category)}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post.category}
        </Button>
      </Link>

      <Image
        src={post.image}
        alt={post.title}
        width={800}
        height={600}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />

      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {(post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>

      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>

      <RecentPosts limit={3} />

      {/* Now rendering the client-only Comments UI */}
      <section className="max-w-4xl mx-auto w-full mt-16">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        <CommentSection postId={slug} />
      </section>
    </main>
  );
}
