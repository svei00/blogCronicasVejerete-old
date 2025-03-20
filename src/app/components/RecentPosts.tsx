import PostCard from "./PostCard";

// Define the props expected by the RecentPosts component
interface RecentPostsProps {
  limit: number; // Number of posts to fetch
}

// The RecentPosts component is declared as an async function.
// It fetches recent posts from the API using the provided limit,
// then renders them using the PostCard component.
export default async function RecentPosts({
  limit,
}: RecentPostsProps): Promise<JSX.Element> {
  // Initialize a variable to hold the fetched posts; default is null.
  let posts: any = null;

  try {
    // Send a POST request to the API endpoint to fetch posts.
    // The request sends JSON data with the desired limit and order ("desc" for descending).
    const result = await fetch(process.env.NEXT_PUBLIC_URL + "/api/post/get", {
      method: "POST",
      body: JSON.stringify({ limit: limit, order: "desc" }),
      cache: "no-store", // 'no-store' ensures fresh data is fetched without caching.
    });

    // Parse the JSON response from the API.
    const data = await result.json();

    // Extract posts from the response data.
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
