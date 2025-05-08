// src/app/post/[slug]/page.tsx

import React from "react";
import { Button } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import CallToAction from "@/app/components/CallToAction";
import RecentPosts from "@/app/components/RecentPosts";
import CommentSection from "@/app/components/CommentSection";
import type { Metadata } from "next";

/**
 * Type definition for blog post data returned from the API
 */
type Post = {
  title: string;
  category: string;
  image: string;
  content: string;
  createdAt: string;
  slug: string;
};

// Add proper PageProps type for Next.js dynamic routes
type PageProps = {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

/**
 * Page component for individual blog post view
 * @param params - Route parameters containing the post slug
 * @returns JSX.Element - The rendered post page
 */
export default async function Page({ params }: PageProps) {
  const { slug } = params;

  // Fetch post data from API
  let post: Post | null = null;
  try {
    const apiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/post/get`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }),
        cache: "no-store",
      }
    );

    if (!apiResponse.ok) {
      throw new Error(`HTTP error! status: ${apiResponse.status}`);
    }

    const responseData = await apiResponse.json();
    post = responseData.posts[0];

    if (!post) {
      throw new Error("No post found with the provided slug");
    }
  } catch (error) {
    console.error("Error loading post:", error);
    return (
      <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h2 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          Post not found
        </h2>
        <p className="text-center text-red-500 mt-4">
          The requested post could not be loaded.
        </p>
      </main>
    );
  }

  // Calculate reading time in minutes
  const readingTime = Math.ceil(post.content.length / 1000);

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      {/* Post Header Section */}
      <article>
        <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          {post.title}
        </h1>

        {/* Category Badge */}
        <div className="self-center mt-5">
          <Link href={`/search?category=${encodeURIComponent(post.category)}`}>
            <Button color="gray" pill size="xs">
              {post.category}
            </Button>
          </Link>
        </div>

        {/* Featured Image */}
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

        {/* Post Metadata */}
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

      {/* Post Content */}
      <section
        className="p-3 max-w-2xl mx-auto w-full post-content prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Call to Action Section */}
      <div className="max-w-4xl mx-auto w-full my-12">
        <CallToAction />
      </div>

      {/* Related Posts */}
      <div className="my-12">
        <h2 className="text-2xl font-bold mb-6 text-center">
          More Recent Posts
        </h2>
        <RecentPosts limit={3} excludeSlug={post.slug} />
      </div>

      {/* Comments Section */}
      <section className="max-w-4xl mx-auto w-full mt-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Join the Discussion
        </h2>
        <CommentSection postId={slug} />
      </section>
    </main>
  );
}
