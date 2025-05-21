// /src/app/components/CommentSection.tsx
"use client";

import { useEffect, useState } from "react";
import { IComment } from "@/lib/models/comment.model"; // Type definition for a comment
import {
  fetchPostComments,
  createComment,
  likeComment,
} from "@/lib/actions/comments"; // Utility functions for calling our API
import { useUser, SignInButton } from "@clerk/nextjs"; // Clerk hooks & components

interface Props {
  postId: string; // ID of the post whose comments we load
}

export default function CommentSection({ postId }: Props) {
  // Local component state
  const [comments, setComments] = useState<IComment[]>([]); // Array of comments for this post
  const [newContent, setNewContent] = useState(""); // Text for a new comment
  const { isSignedIn } = useUser(); // Whether the user is currently signed in

  // 1) Fetch existing comments when the component mounts or when postId changes
  useEffect(() => {
    fetchPostComments(postId)
      .then(setComments) // Populate `comments` state
      .catch(
        (err) => console.error("Error fetching comments:", err) // Log on failure
      );
  }, [postId]);

  // 2) Handler for posting a new comment
  const handleCreate = async () => {
    const content = newContent.trim(); // Trim whitespace
    if (!content) return; // Do nothing if empty

    try {
      const created = await createComment(postId, content); // Call API to create
      setComments((prev) => [created, ...prev]); // Prepend the new comment
      setNewContent(""); // Clear textarea
    } catch (err) {
      console.error("Failed to create comment:", err); // Log on failure
    }
  };

  // 3) Handler for liking or unliking a comment
  const handleLike = async (commentId: string) => {
    try {
      const updated = await likeComment(commentId); // Toggle like in backend
      setComments((prev) =>
        prev.map((c) => (String(c._id) === commentId ? updated : c))
      ); // Update that comment in state
    } catch (err) {
      console.error("Failed to like comment:", err); // Log on failure
    }
  };

  return (
    <div className="space-y-6">
      {/* 4) Prompt to sign in if not authenticated and no comments exist */}
      {!isSignedIn && comments.length === 0 && (
        <div className="text-center text-gray-400">
          No comments yet.{" "}
          <SignInButton mode="modal">
            <button className="text-blue-500 underline">Sign in</button>
          </SignInButton>{" "}
          to post one.
        </div>
      )}

      {/* 5) New comment textarea (visible only to signed‑in users) */}
      {isSignedIn && (
        <div className="space-y-2">
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Write your comment..."
            rows={3}
            value={newContent} // Controlled input
            onChange={(e) => setNewContent(e.target.value)} // Update state on change
          />
          <div className="flex justify-end">
            <button
              onClick={handleCreate} // Submit new comment
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Post comment
            </button>
          </div>
        </div>
      )}

      {/* 6) Show empty‑state if signed in but no comments */}
      {isSignedIn && comments.length === 0 && (
        <p className="text-center text-gray-500">No comments yet.</p>
      )}

      {/* 7) Render each comment */}
      {comments.map((c) => (
        <div
          key={String(c._id)} // Unique key
          className="border p-4 rounded shadow-sm space-y-2"
        >
          <p>{c.content}</p>
          <div className="flex items-center space-x-4 text-sm">
            <button
              onClick={() => handleLike(String(c._id))} // Like toggle button
              className="text-blue-500 hover:underline"
            >
              Like ({c.numberOfLikes}) // Show like count
            </button>
            {/* Future: edit / delete buttons could go here */}
          </div>
        </div>
      ))}
    </div>
  );
}
