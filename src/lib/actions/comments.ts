// /src/lib/actions/comments.ts

import { ICommentWithUser } from "@/app/components/CommentSection"; //<-- Import correct type

/**
 * Fetch all comments for a given post.
 * Returns enriched ICommentWithUser objects with author info.
 */
export async function fetchPostComments(postId: string): Promise<ICommentWithUser[]> {
  const res = await fetch(`/api/comments/getPostComments/${postId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch comments (status ${res.status})`);
  }
  return res.json();
}

/**
 * Create a new comment on a post.
 * Returns the newly created enriched ICommentWithUser.
 */
export async function createComment(
  postId: string,
  content: string
): Promise<ICommentWithUser> {
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
 * Returns the updated enriched ICommentWithUser.
 */
export async function likeComment(commentId: string): Promise<ICommentWithUser> {
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
 * Returns the updated enriched ICommentWithUser.
 */
export async function editComment(
  commentId: string,
  content: string
): Promise<ICommentWithUser> {
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
 * This usually returns a simple status or success object.
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
