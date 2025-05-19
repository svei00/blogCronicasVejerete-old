// /src/lib/actions/comments.ts

import { IComment } from "@/lib/models/comment.model";

/**
 * Fetch all comments for a given post.
 */
export async function fetchPostComments(postId: string): Promise<IComment[]> {
  const res = await fetch(`/api/comments/getPostComments/${postId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch comments (status ${res.status})`);
  }
  return res.json();
}

/**
 * Create a new comment on a post.
 */
export async function createComment(
  postId: string,
  content: string
): Promise<IComment> {
  const res = await fetch(`/api/comments/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postId, content }),
  });
  if (!res.ok) {
    throw new Error(`Failed to create comment (status ${res.status})`);
  }
  return res.json();
}

/**
 * Toggle like/unlike on a comment.
 */
export async function likeComment(commentId: string): Promise<IComment> {
  const res = await fetch(`/api/comments/likeComment/${commentId}`, {
    method: "PUT",
  });
  if (!res.ok) {
    throw new Error(`Failed to like comment (status ${res.status})`);
  }
  return res.json();
}

/**
 * Edit an existing comment.
 */
export async function editComment(
  commentId: string,
  content: string
): Promise<IComment> {
  const res = await fetch(`/api/comments/editComment/${commentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    throw new Error(`Failed to edit comment (status ${res.status})`);
  }
  return res.json();
}

/**
 * Delete a comment.
 */
export async function deleteComment(commentId: string): Promise<unknown> {
  const res = await fetch(`/api/comments/deleteComment/${commentId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Failed to delete comment (status ${res.status})`);
  }
  return res.json();
}
