// /src/app/components/CommentSection.tsx
"use client";

import { useEffect, useState } from "react";
import { IComment } from "@/lib/models/comment.model"; // Comment type
import {
  fetchPostComments,
  createComment,
  likeComment,
} from "@/lib/actions/comments"; // API helper functions
import { useUser, SignInButton } from "@clerk/nextjs"; // Clerk auth hooks
import { Textarea, Button, Alert } from "flowbite-react"; // Flowbite UI components
import { FaThumbsUp } from "react-icons/fa"; // Thumbs-up icon
import Link from "next/link"; // Next.js Link component

interface Props {
  postId: string; // ID of the post to fetch comments for
}

export default function CommentSection({ postId }: Props) {
  // Component state
  const [comments, setComments] = useState<IComment[]>([]); // Loaded comments
  const [newContent, setNewContent] = useState(""); // New comment text
  const [error, setError] = useState<string | null>(null); // Error message
  const { isSignedIn, user } = useUser(); // Clerk auth state

  // Load comments on mount / postId change
  useEffect(() => {
    fetchPostComments(postId)
      .then(setComments) // On success, store comments
      .catch((err) => {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments.");
      });
  }, [postId]);

  // Submit a new comment
  const handleSubmit = async () => {
    const content = newContent.trim();
    if (!content) return; // Ignore empty submissions

    try {
      const created = await createComment(postId, content); // Call API
      setComments((prev) => [created, ...prev]); // Prepend new comment
      setNewContent(""); // Clear textarea
      setError(null); // Clear previous errors
    } catch (err) {
      console.error("Failed to create comment:", err);
      setError("Could not post comment.");
    }
  };

  // Toggle like/unlike a comment
  const handleLike = async (commentId: string) => {
    try {
      const updated = await likeComment(commentId); // Call API
      setComments((prev) =>
        prev.map((c) => (String(c._id) === commentId ? updated : c))
      ); // Replace the liked comment in state
    } catch (err) {
      console.error("Failed to like comment:", err);
      setError("Could not update like.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 border border-gray-700 rounded-lg">
      {/* Signed-in header or prompt to sign in */}
      {isSignedIn ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          {/* Label with colon */}
          <p>Signed in as:</p>
          {/* Circular avatar */}
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={user?.imageUrl || "/default-avatar.png"} // Avatar URL
            alt={user?.username || "avatar"} // Alt text
          />
          <Link
            href="/dashboard?tab=profile" // Clerk user dashboard
            className="text-xs text-blueEx hover:text-greenEx"
          >
            @{user?.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-gray-400">
          You must{" "}
          <SignInButton mode="modal">
            <button className="text-blue-400 underline">sign in</button>
          </SignInButton>{" "}
          to comment.
        </div>
      )}

      {/* New comment form (only when signed in) */}
      {isSignedIn && (
        <div className="space-y-2">
          <Textarea
            placeholder="Write a comment..."
            rows={3}
            maxLength={1000}
            value={newContent} // Controlled textarea
            onChange={(e) => setNewContent(e.target.value)} // Update on input
          />
          <div className="flex justify-between items-center">
            {/* Character counter */}
            <p className="text-xs text-gray-500">
              {(1000 - newContent.length).toLocaleString()} characters left
            </p>
            <Button onClick={handleSubmit} disabled={!newContent.trim()}>
              Submit
            </Button>
          </div>
        </div>
      )}

      {/* Show error alert if any */}
      {error && <Alert color="failure">{error}</Alert>}

      {/* Empty state when no comments */}
      {comments.length === 0 && !error && (
        <p className="text-center text-gray-500">No comments yet!</p>
      )}

      {/* Render list of comments */}
      <div className="space-y-4">
        {comments.map((c) => (
          <div
            key={String(c._id)}
            className="border border-gray-600 rounded-lg p-4"
          >
            {/* Comment text */}
            <p className="mb-2">{c.content}</p>
            {/* Like button with icon and count */}
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <button
                onClick={() => handleLike(String(c._id))}
                className="flex items-center gap-1 hover:text-blue-400"
              >
                <FaThumbsUp />
                {c.numberOfLikes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
