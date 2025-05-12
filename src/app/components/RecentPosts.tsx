import React from "react";
import PostCard from "./PostCard";

// Define the props expected by the RecentPosts component.
interface RecentPostsProps {
  limit: number; // The number of posts to fetch
  excludeSlug?: string; // Optional slug to exclude from the list
}

// Define an interface for the post data.
interface PostData {
  _id: string;
  slug: string;
  image: string;
  title: string;
  category: string;
  [key: string]: unknown; // Allow additional properties if needed
}

// Async component that fetches recent posts from the API and renders them.
export default async function RecentPosts({
  limit,
  excludeSlug,
}: RecentPostsProps): Promise<React.ReactElement> {
  let posts: PostData[] | null = null;

  try {
    const result = await fetch(process.env.NEXT_PUBLIC_URL + "/api/post/get", {
      method: "POST",
      body: JSON.stringify({
        limit: limit,
        order: "desc",
        excludeSlug: excludeSlug, // Add exclusion parameter to API call
      }),
      cache: "no-store",
    });

    const data = await result.json();
    posts = data.posts;
  } catch (error) {
    console.log("Failed to fetch recent posts", error);
  }

  return (
    <div className="flex flex-col justify-center items-center mb-5">
      <h1 className="text-xl mt-5">Últimas publicaciones</h1>
      <div className="flex flex-wrap gap-5 mt-5 justify-center">
        {posts &&
          posts
            // Filter out excluded post if specified
            .filter((post) => !excludeSlug || post.slug !== excludeSlug)
            // Map remaining posts to PostCard components
            .map((post: PostData) => <PostCard key={post._id} post={post} />)}
      </div>
    </div>
  );
}
