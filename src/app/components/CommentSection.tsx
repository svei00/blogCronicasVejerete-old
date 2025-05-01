// 4.2 Using in a Component - /src/components/CommentSection.tsx
"use client";

import { useEffect, useState } from "react";
import { IComment } from "@/lib/models/comment.model";
import {
  fetchPostComments,
  createComment,
  likeComment,
  editComment,
  deleteComment,
} from "@/lib/actions/comments";
import { useUser } from "@clerk/nextjs";

interface Props {
  postId: string; // ID of the post for which comments are loaded
}

export default function CommentSection({ postId }: Props) {
  const [comments, setComments] = useState<IComment[]>([]);
  const [newContent, setNewContent] = useState("");
  const { isSignedIn } = useUser();

  // Load comments on mount or when postId changes
  useEffect(() => {
    fetchPostComments(postId)
      .then((fetched) => setComments(fetched))
      .catch((err: unknown) => {
        console.error("Error fetching comments:", err);
      });
  }, [postId]);

  // Create a new comment
  const handleCreate = async () => {
    const content = newContent.trim();
    if (!content) return;

    try {
      const created = await createComment(postId, content);
      setComments((prev) => [created, ...prev]);
      setNewContent("");
    } catch (err: unknown) {
      console.error("Failed to create comment:", err);
    }
  };

  // Toggle like/unlike for a comment
  const handleLike = async (commentId: string) => {
    try {
      const updated = await likeComment(commentId);
      setComments((prev) =>
        prev.map((c) =>
          // Use _id (string) instead of c.id
          c._id === commentId ? updated : c
        )
      );
    } catch (err: unknown) {
      console.error("Failed to like comment:", err);
    }
  };

  return (
    <div className="space-y-4">
      {/* New comment input (only for signed-in users) */}
      {isSignedIn && (
        <div className="space-y-2">
          <textarea
            className="w-full border p-2 rounded"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Write your comment..."
          />
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Post comment
          </button>
        </div>
      )}

      {/* Render each comment */}
      {comments.map((c) => (
        <div
          // Use String(c._id) to ensure key is a string
          key={String(c._id)}
          className="border p-4 rounded shadow-sm"
        >
          <p>{c.content}</p>
          <button
            onClick={() => handleLike(c._id)} // Pass c._id (string)
            className="text-sm text-blue-500 hover:underline"
          >
            Like ({c.numberOfLikes})
          </button>
          {/* Here you could add edit/delete buttons conditionally */}
        </div>
      ))}
    </div>
  );
}
