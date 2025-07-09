// /src/app/components/CommentSection.tsx
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
import { useUser, SignInButton } from "@clerk/nextjs";
import { Textarea, Button, Alert, Modal } from "flowbite-react";
import { FaThumbsUp, FaEdit, FaTrash } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface CommentSectionProps {
  postId: string;
}

// Extends IComment with author data for frontend rendering
export interface ICommentWithUser extends IComment {
  authorUsername: string;
  authorImageUrl: string;
}

// Component begins here
export default function CommentSection({ postId }: CommentSectionProps) {
  // State for comments, new comment input, errors, and delete modal
  const [comments, setComments] = useState<ICommentWithUser[]>([]);
  const [newContent, setNewContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  // Clerk authentication
  const { isSignedIn, user } = useUser();

  // Load comments on mount or when postId changes
  useEffect(() => {
    const loadComments = async () => {
      try {
        const fetched = await fetchPostComments(postId);
        setComments(fetched);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("Failed to load comments.");
      }
    };
    loadComments();
  }, [postId]);

  // Check the clear url
  // useEffect(() => {
  //   if (user?.imageUrl) {
  //     console.log("Clerk image URL:", user.imageUrl);
  //   }
  // }, [user]);

  // Handle new comment submission
  const handleSubmit = async () => {
    const content = newContent.trim();
    if (!content) return;
    try {
      const created = await createComment(postId, content);
      setComments((prev) => [created, ...prev]);
      setNewContent("");
      setError(null);
    } catch (err) {
      console.error("Failed to create comment:", err);
      setError("Could not post comment.");
    }
  };

  // Like or unlike a comment
  const handleLike = async (commentId: string) => {
    try {
      const updated = await likeComment(commentId);
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? updated : c))
      );
    } catch (err) {
      console.error("Failed to like comment:", err);
      setError("Could not update like.");
    }
  };

  // Edit a comment (prompt for input)
  const handleEdit = async (commentId: string, content: string) => {
    try {
      const updated = await editComment(commentId, content);
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? updated : c))
      );
    } catch (err) {
      console.error("Failed to edit comment:", err);
      setError("Could not edit comment.");
    }
  };

  // Delete modal trigger
  const confirmDelete = (commentId: string) => {
    setShowModal(true);
    setCommentToDelete(commentId);
  };

  // Delete comment handler
  const handleDelete = async () => {
    if (!commentToDelete) return;
    try {
      await deleteComment(commentToDelete);
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
      {/* Signed-in user info or sign-in prompt */}
      {isSignedIn ? (
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <p>Signed in as:</p>
          <div className="relative h-6 w-6 rounded-full overflow-hidden border border-gray-500">
            <Image
              src={user?.imageUrl || "/default-avatar.png"}
              alt={user?.username || "avatar"}
              fill
              className="object-cover"
              sizes="24px"
            />
          </div>
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

      {/* New comment input */}
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

      {/* Error display */}
      {error && <Alert color="failure">{error}</Alert>}

      {/* Comment list */}
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
              // Check if the logged-in user is the author of the comment
              const isAuthor = isSignedIn && user?.id === c.userId.toString();

              return (
                <div
                  key={c._id.toString()}
                  className="border border-gray-600 rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    {/* Avatar and metadata */}
                    <div className="flex items-center gap-2">
                      <div className="relative h-6 w-6 rounded-full overflow-hidden border border-gray-500">
                        <Image
                          src={c.authorImageUrl || "/default-avatar.png"}
                          alt={c.authorUsername}
                          fill
                          className="object-cover"
                          sizes="24px"
                        />
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

                    {/* Edit/Delete for author only */}
                    {isAuthor && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const newText = prompt(
                              "Edit your comment:",
                              c.content
                            );
                            if (
                              newText &&
                              newText.trim() &&
                              newText.trim() !== c.content
                            ) {
                              handleEdit(c._id.toString(), newText.trim());
                            }
                          }}
                          className="text-sm text-yellow-400 hover:text-yellow-600"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(c._id.toString())}
                          className="text-sm text-red-400 hover:text-red-600"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Comment body */}
                  <p className="text-gray-200">{c.content}</p>

                  {/* Like button */}
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <button
                      onClick={() => handleLike(c._id.toString())}
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

      {/* Delete confirmation modal */}
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
