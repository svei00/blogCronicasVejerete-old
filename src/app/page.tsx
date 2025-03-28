import React from "react"; // Import React to ensure JSX types are available
import Link from "next/link";
import CallToAction from "./components/CallToAction";
import RecentPost from "./components/RecentPosts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// Define a type for post data (using an index signature to allow additional properties)
// This interface is preserved for potential future use.
interface PostData {
  [key: string]: unknown;
}

// The Home page is declared as an async function to fetch data before rendering.
// We annotate the return type as Promise<React.ReactElement> to avoid namespace errors.
export default async function Home(): Promise<React.ReactElement> {
  // Initialize a variable to hold the posts; defaulting to null.
  // Note: 'posts' is currently not used in the rendered output, but is preserved for potential future use.
  let posts: PostData[] | null = null;

  try {
    // Send a POST request to the API endpoint to fetch posts.
    const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/get`, {
      method: "POST", // Using POST method as per API design.
      headers: {
        "Content-Type": "application/json", // Specify that the request body is JSON.
      },
      // Request body includes parameters to limit the posts and set the order to descending.
      body: JSON.stringify({ limit: 9, order: "desc" }),
      // 'no-store' ensures that the data is always fetched fresh and not cached.
      cache: "no-store",
    });

    // If the response status is not OK, throw an error with the status text.
    if (!result.ok) {
      throw new Error(`Failed to fetch posts: ${result.statusText}`);
    }

    // Parse the JSON response from the API.
    const data = await result.json();
    // Extract posts from the response data.
    posts = data.posts;
  } catch (error) {
    // Log any error that occurs during the fetch operation.
    console.error("Error getting posts:", error);
  }

  // Return the JSX layout for the Home page.
  return (
    <div className="flex flex-col justify-center items-center">
      {/* Main content section with a header, description, and a link to view all posts */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl text-purple-500 font-bold lg:text-6xl">
          Bienvenidos al Blog de Cro{"\u0301"}nicas del Vejerete{" "}
          {/* The Unicode sequence \u0301 adds an accent mark; you can also use &oacute; as an alternative */}
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Blog sobre diferentes temas desde un punto de vista personal
        </p>
        <Link
          href="/search"
          className="text-xs sm:text-sm text-orange-500 font-bold hover:text-purple-600"
        >
          Ver todas las publicaciones
        </Link>
      </div>

      {/* Call to Action section with background styling for light/dark modes */}
      <div className="p-3 bg-slate-100 dark:bg-slate-700">
        <CallToAction />
      </div>

      {/* Section for recent posts */}
      <div className="p-3 flex flex-col gap-8 py-7">
        {/* Display the RecentPost component; limit prop is set to 9 */}
        <RecentPost limit={9} />
        <Link
          href="/search?category=null"
          className="text-lg text-orange-500 font-bold hover:text-purple-600 text-center"
        >
          Ver todas las publicaciones
        </Link>
      </div>
    </div>
  );
}
