import React from "react"; // Import React to ensure JSX types are available
import PostCard from "./PostCard";

// Define the props expected by the RecentPosts component.
interface RecentPostsProps {
  limit: number; // The number of posts to fetch.
}

// Async component that fetches recent posts from the API and renders them.
// The return type is annotated as Promise<React.ReactElement> to avoid issues with the JSX namespace.
export default async function RecentPosts({
  limit,
}: RecentPostsProps): Promise<React.ReactElement> {
  // Initialize a variable to hold the fetched posts; default is null.
  let posts: any = null;

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
          posts.map((post: any) => <PostCard key={post._id} post={post} />)}
      </div>
    </div>
  );
}
