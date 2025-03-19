"use client";

// Import Flowbite components and necessary React hooks/types
import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Import a custom PostCard component to display individual posts
import PostCard from "../components/PostCard";

// Define the shape of the sidebar/filter state
interface SideBarData {
  searchTerm: string;
  sort: string;
  category: string;
}

// Define the shape of a Post object; additional properties are allowed
interface Post {
  id: string; // Mandatory field
  [key: string]: any; // Allow extra properties without explicitly typing them
}

// Main Search component
export default function Search() {
  // State to store filter options for the sidebar
  const [sideBarData, setSideBarData] = useState<SideBarData>({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });

  // State to store fetched posts
  const [posts, setPosts] = useState<Post[]>([]);

  // State to indicate whether posts are currently being loaded
  const [loading, setLoading] = useState<boolean>(false);

  // State to control whether the "Show More" button should be displayed
  const [showMore, setShowMore] = useState<boolean>(false);

  // Retrieve URL search parameters from the router and Next.js router instance for navigation
  const searchParams = useSearchParams();
  const router = useRouter();

  // useEffect: Runs whenever the URL search parameters change.
  // It updates the sidebar filter state and fetches posts based on the parameters.
  useEffect(() => {
    // Create URLSearchParams instance from current URL parameters
    const urlParams = new URLSearchParams(searchParams.toString());

    // Extract individual filter parameters from the URL
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");

    // If any filter is present, update the sidebar state with those values.
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSideBarData((prev) => ({
        ...prev,
        searchTerm: searchTermFromUrl || "",
        sort: sortFromUrl || "desc",
        category: categoryFromUrl || "uncategorized",
      }));
    }

    // Function to fetch posts based on the URL filters
    const fetchPosts = async () => {
      setLoading(true); // Indicate loading has started
      try {
        // Send a POST request to the API with the current filters.
        const res = await fetch("/api/post/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            limit: 9,
            order: sortFromUrl || "desc",
            category: categoryFromUrl || "uncategorized",
            searchTerm: searchTermFromUrl || "",
          }),
        });
        // If the response isn't OK, throw an error.
        if (!res.ok) throw new Error("Failed to fetch posts");
        // Parse the JSON data from the response.
        const data = await res.json();
        // Update the posts state with the fetched posts.
        setPosts(data.posts);
        // If exactly 9 posts are returned, show the "Show More" button.
        setShowMore(data.posts.length === 9);
      } catch (error) {
        console.error(error);
      } finally {
        // Loading is complete.
        setLoading(false);
      }
    };
    // Call the fetchPosts function.
    fetchPosts();
  }, [searchParams]);

  // Handler for changes in any input or select element in the filter form
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    // Update the appropriate field in sideBarData based on the element's id
    if (id === "searchTerm") {
      setSideBarData((prev) => ({ ...prev, searchTerm: value }));
    } else if (id === "sort") {
      setSideBarData((prev) => ({ ...prev, sort: value || "desc" }));
    } else if (id === "category") {
      setSideBarData((prev) => ({
        ...prev,
        category: value || "uncategorized",
      }));
    }
  };

  // Handler for the form submission that applies filters
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    // Create a new URLSearchParams instance based on current search parameters
    const urlParams = new URLSearchParams(searchParams.toString());
    // Update the URL parameters with current sidebar filter values
    urlParams.set("searchTerm", sideBarData.searchTerm || "");
    urlParams.set("sort", sideBarData.sort);
    urlParams.set("category", sideBarData.category);
    // Navigate to the updated URL, triggering a re-fetch of posts with the new filters
    router.push(`/search?${urlParams.toString()}`);
  };

  // Handler for loading additional posts when "Show More" is clicked
  const handleShowMore = async () => {
    const numberOfPosts = posts.length; // Current number of loaded posts
    const startIndex = numberOfPosts; // Calculate start index for the next batch
    try {
      // Request more posts from the API with the current filters and startIndex
      const res = await fetch("/api/post/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limit: 9,
          order: sideBarData.sort,
          category: sideBarData.category,
          searchTerm: sideBarData.searchTerm,
          startIndex,
        }),
      });
      if (!res.ok) throw new Error("Failed to fetch more posts");
      // Parse the response data
      const data = await res.json();
      // Append the new posts to the existing posts array
      setPosts((prev) => [...prev, ...data.posts]);
      // Update showMore based on whether the full batch was returned
      setShowMore(data.posts.length === 9);
    } catch (error) {
      console.error(error);
    }
  };

  // Render the UI
  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar: Contains the filter form */}
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          {/* Search Term Input */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sideBarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          {/* Sort Selection */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select onChange={handleChange} id="sort">
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          {/* Category Selection */}
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <Select onChange={handleChange} id="category">
              <option value="uncategorized">Uncategorized</option>
              <option value="alucines">Alucines</option>
              <option value="pensamientos">Pensamientos</option>
              <option value="announcements">Announcements</option>
              <option value="draft">Draft</option>
            </Select>
          </div>
          {/* Submit button to apply filters */}
          <Button type="submit" gradientDuoTone="purpleToBlue" outline>
            Apply Filters
          </Button>
        </form>
      </div>

      {/* Main content: Displays the list of posts */}
      <div className="w-full">
        {/* Header for the posts results section */}
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Posts Results
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {/* Show message if no posts found */}
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No Post Have been Found</p>
          )}
          {/* Display loading message */}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {/* Render a PostCard component for each post */}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post.id} post={post} />)}
          {/* "Show More" button to load additional posts */}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-orange-500 text-lg hover:text-purple-600 p-7 w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
