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

// Define the shape of a Post object
interface Post {
  id: string;
  [key: string]: any;
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
    <div className="font-bold text-white bg-purple-600 text-center">
      Test Search Page
    </div>
  );
}
