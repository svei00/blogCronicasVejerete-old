import React from "react"; // Import React to ensure JSX types are available
import Link from "next/link";
import CallToAction from "./components/CallToAction";
import RecentPost from "./components/RecentPosts";

// The Home page is declared as an async function to fetch data before rendering.
// We annotate the return type as Promise<React.ReactElement> to avoid namespace errors.
export default async function Home(): Promise<React.ReactElement> {
  // Note: Data fetching has been moved to the RecentPost component for component-based data management
  // while preserving the API endpoint structure for potential future use.

  try {
    // Preserved API endpoint reference for documentation purposes:
    // const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/get`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ limit: 9, order: "desc" }),
    //   cache: "no-store",
    // });
    // Example error handling preservation:
    // if (!result.ok) throw new Error(`Failed to fetch posts: ${result.statusText}`);
  } catch (error) {
    // Maintain error logging infrastructure
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
