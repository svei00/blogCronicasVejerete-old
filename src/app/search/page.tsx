"use client";

import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PostCard from "../components/PostCard";

// Define the shape of the sidebar state
interface SideBarData {
  searchTerm: string;
  sort: string;
  category: string;
}

// Define the shape of a Post object, but allow additional properties
interface Post {
  id: string; // Mandatory field
  [key: string]: any; // Allow additional properties without explicitly typing them
}

export default function Search() {
  const [sideBarData, setSideBarData] = useState<SideBarData>({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams.toString());
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSideBarData((prev) => ({
        ...prev,
        searchTerm: searchTermFromUrl || "",
        sort: sortFromUrl || "desc",
        category: categoryFromUrl || "uncategorized",
      }));
    }

    const fetchPosts = async () => {
      setLoading(true);

      try {
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

        if (!res.ok) throw new Error("Failed to fetch posts");

        const data = await res.json();
        setPosts(data.posts);
        setShowMore(data.posts.length === 9);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchParams]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(searchParams.toString());
    urlParams.set("searchTerm", sideBarData.searchTerm || "");
    urlParams.set("sort", sideBarData.sort);
    urlParams.set("category", sideBarData.category);

    router.push(`/search?${urlParams.toString()}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;

    try {
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

      const data = await res.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setShowMore(data.posts.length === 9);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
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
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select onChange={handleChange} id="sort">
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
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
          <Button type="submit" gradientDuoTone="purpleToBlue" outline>
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Posts Results
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No Post Have been Found</p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post.id} post={post} />)}
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
