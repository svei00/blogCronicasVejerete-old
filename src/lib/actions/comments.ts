// 4.1 Utility Fetch Functions - /src/lib/actions/comments.ts
import { IComment } from "@/lib/models/comment.model";

export async function fetchPostComments(postId: string): Promise<IComment[]> {
  const res = await fetch(`/api/comments/getPostComments/${postId}`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

export async function createComment(postId: string, content: string) {
  const res = await fetch(`/api/comments/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postId, content }),
  });
  if (!res.ok) throw new Error("Failed to create comment");
  return res.json();
}

export async function likeComment(commentId: string) {
  const res = await fetch(`/api/comments/likeComment/${commentId}`, { method: "PUT" });
  if (!res.ok) throw new Error("Failed to like comment");
  return res.json();
}

export async function editComment(commentId: string, content: string) {
  const res = await fetch(`/api/comments/editComment/${commentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("Failed to edit comment");
  return res.json();
}

export async function deleteComment(commentId: string) {
  const res = await fetch(`/api/comments/deleteComment/${commentId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete comment");
  return res.json();
}
