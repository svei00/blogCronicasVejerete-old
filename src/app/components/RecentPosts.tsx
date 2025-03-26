import React from "react"; // Import React to ensure JSX types are available
import PostCard from "./PostCard";

// Define the props expected by the RecentPosts component.
interface RecentPostsProps {
  limit: number; // The number of posts to fetch.
}

// Define an interface for the post data.
// This includes the properties that PostCard is expected to use.
// You can expand this interface if you have additional properties.
interface PostData {
  _id: string;
  slug: string;
  image: string;
  title: string;
  category: string;
  [key: string]: unknown; // Allow additional properties if needed
}

// Async component that fetches recent posts from the API and renders them.
// The return type is annotated as Promise<React.ReactElement> to avoid issues with the JSX namespace.
export default async function RecentPosts({
  limit,
}: RecentPostsProps): Promise<React.ReactElement> {
  // Initialize a variable to hold the fetched posts; default is null.
  let posts: PostData[] | null = null;

  try {
    // Send a POST request to the API endpoint to fetch posts.
    // The request sends JSON data specifying the desired limit and descending order.
    const result = await fetch(process.env.NEXT_PUBLIC_URL + "/api/post/get", {
      method: "POST",
      body: JSON.stringify({ limit: limit, order: "desc" }),
      cache: "no-store", // 'no-store' ensures that fresh data is fetched on every request.
    });

    // Parse the JSON response from the API.
    const data = await result.json();
    // Extract the posts from the response data.
    posts = data.posts;
  } catch (error) {
    // Log any error that occurs during the fetch operation.
    console.log("Failed to fetch recent posts", error);
  }

  // Return the JSX layout for the recent posts section.
  return (
    <div className="flex flex-col justify-center items-center mb-5">
      {/* Section header */}
      <h1 className="text-xl mt-5">Últimas publicaciones</h1>
      {/* Container for displaying fetched posts */}
      <div className="flex flex-wrap gap-5 mt-5 justify-center">
        {/* If posts exist, map each post to a PostCard component */}
        {posts &&
          posts.map((post: PostData) => (
            <PostCard key={post._id} post={post} />
          ))}
      </div>
    </div>
  );
}
