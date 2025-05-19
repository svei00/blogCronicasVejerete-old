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

interface Props {
  postId: string;
}

export default function CommentSection({ postId }: Props) {
  const [comments, setComments] = useState<IComment[]>([]);
  const [newContent, setNewContent] = useState("");
  const { isSignedIn, user } = useUser();

  // Load comments when the section mounts or postId changes
  useEffect(() => {
    fetchPostComments(postId)
      .then(setComments)
      .catch((err) => console.error("Error fetching comments:", err));
  }, [postId]);

  // Handle posting a new comment
  const handleCreate = async () => {
    const content = newContent.trim();
    if (!content) return;
    try {
      const created = await createComment(postId, content);
      setComments((prev) => [created, ...prev]);
      setNewContent("");
    } catch (err) {
      console.error("Failed to create comment:", err);
    }
  };

  // Handle like/unlike
  const handleLike = async (commentId: string) => {
    try {
      const updated = await likeComment(commentId);
      setComments((prev) =>
        prev.map((c) => (String(c._id) === commentId ? updated : c))
      );
    } catch (err) {
      console.error("Failed to like comment:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sign‑in prompt */}
      {!isSignedIn && (
        <div className="text-center text-gray-400">
          Please{" "}
          <SignInButton mode="modal">
            <button className="text-blue-500 underline">sign in</button>
          </SignInButton>{" "}
          to leave a comment.
        </div>
      )}

      {/* New comment box */}
      {isSignedIn && (
        <div className="space-y-2">
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Write your comment..."
            rows={3}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Post comment
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {comments.length === 0 && isSignedIn && (
        <p className="text-center text-gray-500">No comments yet.</p>
      )}

      {/* Comments list */}
      {comments.map((c) => (
        <div
          key={String(c._id)}
          className="border p-4 rounded shadow-sm space-y-2"
        >
          <p>{c.content}</p>
          <div className="flex items-center space-x-4 text-sm">
            <button
              onClick={() => handleLike(String(c._id))}
              className="text-blue-500 hover:underline"
            >
              Like ({c.numberOfLikes})
            </button>
            {/* future: edit/delete buttons */}
          </div>
        </div>
      ))}
    </div>
  );
}
