// /src/app/components/CommentSection.tsx
"use client";

import { useEffect, useState } from "react";
import { IComment } from "@/lib/models/comment.model";
import {
  fetchPostComments,
  createComment,
  likeComment,
} from "@/lib/actions/comments";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Textarea, Button, Alert, Avatar } from "flowbite-react";
import { FaThumbsUp } from "react-icons/fa";

interface Props {
  postId: string;
}

export default function CommentSection({ postId }: Props) {
  const [comments, setComments] = useState<IComment[]>([]);
  const [newContent, setNewContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn, user } = useUser();

  // Load comments when postId changes
  useEffect(() => {
    fetchPostComments(postId)
      .then(setComments)
      .catch((err) => {
        console.error(err);
        setError("Failed to load comments.");
      });
  }, [postId]);

  // Post a new comment
  const handleSubmit = async () => {
    if (!newContent.trim()) return;
    try {
      const created = await createComment(postId, newContent);
      setComments((prev) => [created, ...prev]);
      setNewContent("");
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Could not post comment.");
    }
  };

  // Toggle like/unlike
  const handleLike = async (id: string) => {
    try {
      const updated = await likeComment(id);
      setComments((prev) =>
        prev.map((c) => (String(c._id) === id ? updated : c))
      );
    } catch (err) {
      console.error(err);
      setError("Could not update like.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 border border-gray-700 rounded-lg">
      {/* Signed-in header */}
      {isSignedIn ? (
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Avatar
            img={user?.profileImageUrl}
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
            <button className="text-blue-400 underline">Sign in</button>
          </SignInButton>{" "}
          to comment.
        </div>
      )}

      {/* New comment form */}
      {isSignedIn && (
        <div className="space-y-2">
          <Textarea
            placeholder="Write a comment..."
            rows={3}
            maxLength={1000}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
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
            key={String(c._id)}
            className="border border-gray-600 rounded-lg p-4"
          >
            <p className="mb-2">{c.content}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <button
                onClick={() => handleLike(String(c._id))}
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
