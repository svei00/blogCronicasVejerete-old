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
import { Textarea, Button, Alert, Avatar } from "flowbite-react"; // Flowbite-React UI components
import { FaThumbsUp } from "react-icons/fa"; // Thumbs-up icon

interface Props {
  postId: string; // ID of the post whose comments we load
}

export default function CommentSection({ postId }: Props) {
  // Local component state
  const [comments, setComments] = useState<IComment[]>([]); // Array of comments for this post
  const [newContent, setNewContent] = useState(""); // Controlled textarea content
  const [error, setError] = useState<string | null>(null); // Error message, if any
  const { isSignedIn, user } = useUser(); // Clerk authentication state

  // Fetch existing comments on mount or whenever postId changes
  useEffect(() => {
    fetchPostComments(postId)
      .then(setComments) // Populate state on success
      .catch((err) => {
        console.error("Error fetching comments:", err); // Log & set error on failure
        setError("Failed to load comments.");
      });
  }, [postId]);

  // Handler for posting a new comment
  const handleSubmit = async () => {
    const content = newContent.trim();
    if (!content) return; // Don’t submit empty content

    try {
      const created = await createComment(postId, content); // Call backend
      setComments((prev) => [created, ...prev]); // Prepend new comment
      setNewContent(""); // Clear textarea
      setError(null); // Clear any previous error
    } catch (err) {
      console.error("Failed to create comment:", err); // Log & surface error
      setError("Could not post comment.");
    }
  };

  // Handler for like/unlike toggling
  const handleLike = async (commentId: string) => {
    try {
      const updated = await likeComment(commentId); // Toggle like in backend
      setComments((prev) =>
        prev.map((c) => (String(c._id) === commentId ? updated : c))
      ); // Update that single comment
    } catch (err) {
      console.error("Failed to like comment:", err); // Log & surface error
      setError("Could not update like.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 border border-gray-700 rounded-lg">
      {/* Signed-in header or sign-in prompt */}
      {isSignedIn ? (
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Avatar
            img={user?.imageUrl} // Clerk's actual image URL prop
            rounded
            size="sm"
            className="border"
          />
          <span>
            Signed in as <strong>@{user?.username}</strong>
          </span>
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

      {/* New comment form (only for signed-in users) */}
      {isSignedIn && (
        <div className="space-y-2">
          <Textarea
            placeholder="Write a comment..."
            rows={3}
            maxLength={1000}
            value={newContent} // Controlled component
            onChange={(e) => setNewContent(e.target.value)} // Update on input
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              {(1000 - newContent.length).toLocaleString()} characters left
            </p>
            <Button onClick={handleSubmit} disabled={!newContent.trim()}>
              Submit
            </Button>
          </div>
        </div>
      )}

      {/* Error alert */}
      {error && <Alert color="failure">{error}</Alert>}

      {/* Empty state */}
      {comments.length === 0 && !error && (
        <p className="text-center text-gray-500">No comments yet!</p>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((c) => (
          <div
            key={String(c._id)} // Unique key per comment
            className="border border-gray-600 rounded-lg p-4"
          >
            <p className="mb-2">{c.content}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <button
                onClick={() => handleLike(String(c._id))} // Like toggle button
                className="flex items-center gap-1 hover:text-blue-400"
              >
                <FaThumbsUp /> {c.numberOfLikes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
