// src/app/post/[slug]/page.tsx

// Import necessary components and modules
import CallToAction from "@/app/components/CallToAction";
import RecentPosts from "@/app/components/RecentPosts";
import { Button } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import CommentSection from "@/app/components/CommentSection";

// Define the structure of a Post object
interface Post {
  title: string;
  category: string;
  image: string;
  content: string;
  createdAt: string;
}

// Define the type for page props. Note that `params` is a Promise resolving to an object with a `slug` string.
interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// The PostPage component is declared as an async function because it performs asynchronous data fetching.
const PostPage = async ({ params }: PostPageProps) => {
  // Await the params promise to extract the slug parameter.
  const { slug } = await params;

  let post: Post | null = null;

  try {
    // Fetch the post data from the API using the slug.
    // We use POST here and send the slug in the request body.
    // The 'no-store' cache option ensures that fresh data is fetched each time.
    const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/get`, {
      method: "POST",
      body: JSON.stringify({ slug }),
      cache: "no-store",
    });

    // If the API response is not OK, throw an error.
    if (!result.ok) {
      throw new Error("Failed to fetch post");
    }

    // Parse the JSON response and assign the first post from the returned array.
    const data = await result.json();
    post = data.posts[0];
  } catch (error) {
    // Log the error to the console and set a fallback post object in case of failure.
    console.error("Error fetching post:", error);
    post = {
      title: "Failed to load post",
      category: "",
      image: "",
      content: "",
      createdAt: "",
    };
  }

  // If no valid post data is found, render a "Post not found" message.
  if (!post || post.title === "Failed to load post") {
    return (
      <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h2 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          Post not found
        </h2>
      </main>
    );
  }

  // Render the post details along with additional components.
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      {/* Display the post title */}
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post.title}
      </h1>
      {/* A link to search posts by the current post's category */}
      <Link
        href={`/search?category=${post.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post.category}
        </Button>
      </Link>
      {/* Use Next.js' Image component for optimized image rendering */}
      <Image
        src={post.image}
        alt={post.title}
        width={800} // Set the width in pixels
        height={600} // Set the height in pixels
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      {/* Display metadata: creation date and estimated reading time */}
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {(post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      {/* Render the post content. Using dangerouslySetInnerHTML allows HTML content to be rendered directly. */}
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>
      {/* Correctly pass slug as postId */}
      <section className="max-w-4xl mx-auto w-full mt-16">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        <CommentSection postId={slug} />
      </section>
      {/* Render the CallToAction component */}
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      {/* Render the RecentPosts component with a limit of 3 posts */}
      <RecentPosts limit={3} />
    </main>
  );
};

// Export the PostPage component as the default export
export default PostPage;
