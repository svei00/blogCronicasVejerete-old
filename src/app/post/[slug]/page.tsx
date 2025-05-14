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
  slug: string;
};

/**
 * This is the Next.js App Router page for /post/[slug].
 *    - Must be named `Page`
 *    - Props: { params: { slug: string }
 */
export default async function Page({
  params, // Destructure params from props
}: {
  params: { slug: string }; // Inline type definition for Next.js compatibility
}) {
  const { slug } = params;

  // 1. Fetch the post data
  let post: Post;
  try {
    // API request to get post by slug
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Required for POST requests
      },
      body: JSON.stringify({ slug }), // Send slug as request body
      cache: "no-store", // Bypass cache for fresh data
    });

    // Handle HTTP errors
    if (!res.ok) {
      throw new Error(`Failed to fetch post: ${res.status}`);
    }

    // Parse JSON response
    const data = await res.json();
    post = data.posts[0];

    // Handle empty response
    if (!post) {
      throw new Error("No post returned from API");
    }
  } catch (err: unknown) {
    // Error handling with logging
    console.error("Error loading post:", err);

    // Return not found UI
    return (
      <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h2 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          Post no encontrado
        </h2>
        <p className="text-center text-red-500 mt-4">
          El post solicitado no pudo ser cargado.
        </p>
      </main>
    );
  }

  // 2. Calculate reading time
  const readingTime = Math.ceil(post.content.length / 1000);

  // 3. Render post content
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      {/* Post Header Section */}
      <article>
        {/* Post Title */}
        <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          {post.title}
        </h1>

        {/* Category Badge */}
        <div className="self-center mt-5">
          <Link
            href={`/search?category=${encodeURIComponent(post.category)}`}
            className="hover:underline"
          >
            <Button color="gray" pill size="xs">
              {post.category}
            </Button>
          </Link>
        </div>

        {/* Featured Image */}
        <div className="mt-10 p-3">
          <Image
            src={post.image}
            alt={`Imagen destacada para ${post.title}`}
            width={800}
            height={600}
            className="max-h-[600px] w-full object-cover rounded-lg shadow-xl"
            priority // Prioritize loading for LCP
          />
        </div>

        {/* Post Metadata */}
        <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          {/* Publication Date */}
          <time dateTime={post.createdAt}>
            {new Date(post.createdAt).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>

          {/* Reading Time */}
          <span>{readingTime} min de lectura</span>
        </div>
      </article>

      {/* Post Content (HTML from CMS) */}
      <section
        className="p-3 max-w-2xl mx-auto w-full post-content prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Call to Action Section */}
      <div className="max-w-4xl mx-auto w-full my-12">
        <CallToAction />
      </div>

      {/* Related Posts Section */}
      <div className="my-12">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Más publicaciones recientes
        </h2>
        <RecentPosts limit={3} excludeSlug={post.slug} />
      </div>

      {/* Comments Section */}
      <section className="max-w-4xl mx-auto w-full mt-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Únete a la conversación
        </h2>
        <CommentSection postId={slug} />
      </section>
    </main>
  );
}
