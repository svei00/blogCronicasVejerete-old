// File: /src/app/components/CommentSection.tsx
"use client";

import { useEffect, useState } from "react";
import { IComment } from "@/lib/models/comment.model"; // Your Mongoose‐backed TS interface
import {
  fetchPostComments,
  createComment,
  likeComment,
  editComment as apiEditComment,
  deleteComment as apiDeleteComment,
} from "@/lib/actions/comments"; // Your “actions” for calling /api/comments/*
import { useUser, SignInButton } from "@clerk/nextjs"; // Clerk for authentication
import { Textarea, Button, Alert, Modal, Avatar } from "flowbite-react"; // Flowbite UI components
import { FaThumbsUp, FaEdit, FaTrash } from "react-icons/fa"; // Icons for Like/Edit/Delete
import Image from "next/image"; // Next.js optimized image
import Link from "next/link"; // Next.js link
import { formatDistanceToNow } from "date-fns"; // For “time ago” formatting

interface CommentSectionProps {
  postId: string;
}

// Extend IComment if you returned additional fields from the API (e.g. authorUsername, authorImageUrl):
export interface ICommentWithUser extends IComment {
  authorUsername: string;
  authorImageUrl: string;
  createdAt: string | Date;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  // Local state
  const [comments, setComments] = useState<ICommentWithUser[]>([]);
  const [newContent, setNewContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  // Clerk’s user object
  const { isSignedIn, user } = useUser();

  // 1) Fetch comments whenever `postId` changes
  useEffect(() => {
    const loadComments = async () => {
      try {
        const fetched: ICommentWithUser[] = await fetchPostComments(postId);
        setComments(fetched);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments.");
      }
    };
    loadComments();
  }, [postId]);

  // 2) Submit a brand-new comment
  const handleSubmit = async () => {
    const content = newContent.trim();
    if (!content) return;

    try {
      const created: ICommentWithUser = await createComment(postId, content);
      // Prepend new comment to the list
      setComments((prev) => [created, ...prev]);
      setNewContent("");
      setError(null);
    } catch (err) {
      console.error("Failed to create comment:", err);
      setError("Could not post comment.");
    }
  };

  // 3) Toggle like/unlike on a comment
  const handleLike = async (commentId: string) => {
    try {
      const updated: ICommentWithUser = await likeComment(commentId);
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? updated : c))
      );
    } catch (err) {
      console.error("Failed to like comment:", err);
      setError("Could not update like.");
    }
  };

  // 4) Edit a comment’s content (inline)
  const handleEdit = async (commentId: string, newText: string) => {
    try {
      const updated: ICommentWithUser = await apiEditComment(
        commentId,
        newText
      );
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? updated : c))
      );
    } catch (err) {
      console.error("Failed to edit comment:", err);
      setError("Could not edit comment.");
    }
  };

  // 5) Delete a comment (with confirmation modal)
  const confirmDelete = (commentId: string) => {
    setShowModal(true);
    setCommentToDelete(commentId);
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;
    try {
      await apiDeleteComment(commentToDelete);
      setComments((prev) => prev.filter((c) => c._id !== commentToDelete));
      setShowModal(false);
      setCommentToDelete(null);
    } catch (err) {
      console.error("Failed to delete comment:", err);
      setError("Could not delete comment.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 border border-gray-700 rounded-lg">
      {/* ———————————————————————————————————————————————————— */}
      {/* HEADER: If signed in, show avatar + “Signed in as” + username.
          If not signed in, prompt to sign in. */}
      {isSignedIn ? (
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <p>Signed in as:</p>

          {/* Circular avatar (using Next/Image for optimization) */}
          <div className="relative h-6 w-6 rounded-full overflow-hidden border border-gray-500">
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.username || "avatar"}
                fill
                className="object-cover"
                sizes="24px"
              />
            ) : (
              // Fallback to a default avatar
              <Image
                src="/default-avatar.png"
                alt="Default avatar"
                fill
                className="object-cover"
                sizes="24px"
              />
            )}
          </div>

          {/* Username links to user’s Clerk dashboard (or whatever) */}
          <Link
            href="/dashboard?tab=profile"
            className="text-xs text-purple-400 hover:text-orange-400"
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

      {/* ———————————————————————————————————————————————————— */}
      {/* NEW COMMENT FORM: only show if user is signed in */}
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

      {/* ———————————————————————————————————————————————————— */}
      {/* ERROR ALERT: show if something went wrong */}
      {error && <Alert color="failure">{error}</Alert>}

      {/* ———————————————————————————————————————————————————— */}
      {/* COMMENT COUNT + LIST: */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <p className="text-sm text-gray-300">Comments:</p>
          <div className="border border-green-400 text-green-400 py-1 px-2 rounded-sm text-xs">
            {comments.length}
          </div>
        </div>

        {comments.length === 0 && !error ? (
          <p className="text-center text-gray-400">No comments yet!</p>
        ) : (
          <div className="space-y-4">
            {comments.map((c) => {
              // Determine if the current user is the author of this comment:
              const isAuthor = isSignedIn && user?.id === c.userId;

              return (
                <div
                  key={c._id}
                  className="border border-gray-600 rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    {/* AVATAR + USERNAME + TIMESTAMP */}
                    <div className="flex items-center gap-2">
                      <div className="relative h-6 w-6 rounded-full overflow-hidden border border-gray-500">
                        {c.authorImageUrl ? (
                          <Image
                            src={c.authorImageUrl}
                            alt={c.authorUsername}
                            fill
                            className="object-cover"
                            sizes="24px"
                          />
                        ) : (
                          <Image
                            src="/default-avatar.png"
                            alt="Default avatar"
                            fill
                            className="object-cover"
                            sizes="24px"
                          />
                        )}
                      </div>
                      <div className="flex flex-col leading-tight">
                        <span className="text-xs font-semibold text-gray-100">
                          @{c.authorUsername}
                        </span>
                        <span className="text-2xs text-gray-400">
                          {formatDistanceToNow(new Date(c.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>

                    {/* If the viewer is the author, show “Edit” + “Delete” buttons */}
                    {isAuthor && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const newText = prompt(
                              "Edit your comment:",
                              c.content
                            );
                            if (
                              newText !== null &&
                              newText.trim() !== "" &&
                              newText.trim() !== c.content
                            ) {
                              handleEdit(c._id, newText.trim());
                            }
                          }}
                          className="text-sm text-yellow-400 hover:text-yellow-600"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(c._id)}
                          className="text-sm text-red-400 hover:text-red-600"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* COMMENT TEXT */}
                  <p className="text-gray-200">{c.content}</p>

                  {/* LIKE BUTTON + COUNT */}
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <button
                      onClick={() => handleLike(c._id)}
                      className="flex items-center gap-1 hover:text-blue-400"
                    >
                      <FaThumbsUp />
                      <span>{c.numberOfLikes}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ———————————————————————————————————————————————————— */}
      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <p className="mb-5 text-lg text-gray-500">
              Are you sure you want to delete this comment?
            </p>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                Yes, delete it
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
