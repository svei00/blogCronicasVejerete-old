import React, { useEffect, useState } from "react";
import { Textarea, Button, Alert, Modal } from "flowbite-react";
import { FaThumbsUp, FaEdit, FaTrash } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";

interface IComment {
  _id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  numberOfLikes: number;
  authorUsername: string;
  authorImageUrl: string;
}

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<IComment[]>([]);
  const [newContent, setNewContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const { isSignedIn, user } = useUser();

  // Check the clear url
  // useEffect(() => {
  //   if (user?.imageUrl) {
  //     console.log("Clerk image URL:", user.imageUrl);
  //   }
  // }, [user]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments/${postId}`);
        const data = await res.json();
        setComments(data);
      } catch (error) {
        setError("Failed to load comments");
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async () => {
    if (!newContent.trim()) return;
    try {
      const res = await fetch("/api/comments/create", {
        method: "POST",
        body: JSON.stringify({ content: newContent, postId }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments([data, ...comments]);
        setNewContent("");
      } else {
        setError(data.message || "Error posting comment");
      }
    } catch (error) {
      setError("Error posting comment");
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      const res = await fetch(`/api/comments/like/${commentId}`, {
        method: "PATCH",
      });
      const updated = await res.json();
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? updated : c))
      );
    } catch (error) {
      setError("Failed to like comment");
    }
  };

  const confirmDelete = (commentId: string) => {
    setShowDeleteModal(true);
    setCommentToDelete(commentId);
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;
    try {
      await fetch(`/api/comments/deleteComment/${commentToDelete}`, {
        method: "DELETE",
      });
      setComments((prev) => prev.filter((c) => c._id !== commentToDelete));
      setShowDeleteModal(false);
    } catch (error) {
      setError("Failed to delete comment");
    }
  };

  const startEdit = (comment: IComment) => {
    setEditingCommentId(comment._id);
    setEditingContent(comment.content);
    setShowEditModal(true);
  };

  const confirmEdit = async () => {
    if (!editingCommentId || !editingContent.trim()) return;
    try {
      const res = await fetch(`/api/comments/editComment/${editingCommentId}`, {
        method: "PUT",
        body: JSON.stringify({ content: editingContent }),
      });
      const updated = await res.json();
      setComments((prev) =>
        prev.map((c) => (c._id === editingCommentId ? updated : c))
      );
      setShowEditModal(false);
    } catch (error) {
      setError("Failed to edit comment");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 text-white">
      {isSignedIn && (
        <div className="flex items-center gap-3">
          <Image
            src={user?.imageUrl || ""}
            alt="User"
            width={32}
            height={32}
            className="rounded-full"
          />
          <Link
            href="/dashboard?tab=profile"
            className="text-purple-400 hover:underline"
          >
            @{user?.username || "user"}
          </Link>
        </div>
      )}

      {isSignedIn && (
        <div className="space-y-2">
          <Textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Write your comment"
          />
          <Button onClick={handleSubmit} disabled={!newContent.trim()}>
            Submit
          </Button>
        </div>
      )}

      {comments.map((c) => {
        const isAuthor =
          isSignedIn && user?.id && String(user.id) === String(c.userId);
        return (
          <div key={c._id} className="border p-4 rounded-md space-y-2">
            <div className="flex items-center gap-2">
              <Image
                src={c.authorImageUrl || ""}
                alt={c.authorUsername}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="text-sm">@{c.authorUsername}</span>
              <span className="text-xs text-gray-400 ml-auto">
                {formatDistanceToNow(new Date(c.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <p>{c.content}</p>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <button
                onClick={() => handleLike(c._id)}
                className="flex items-center gap-1 hover:text-blue-400"
              >
                <FaThumbsUp /> <span>{c.numberOfLikes}</span>
              </button>
              {isAuthor && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => startEdit(c)}
                    className="text-yellow-400 hover:text-yellow-600"
                  >
                    <FaEdit className="inline-block mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(c._id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <FaTrash className="inline-block mr-1" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Modal.Header>Confirm Deletion</Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this comment?</p>
          <div className="flex justify-end gap-3 mt-4">
            <Button color="gray" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button color="failure" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <Modal.Header>Edit Comment</Modal.Header>
        <Modal.Body>
          <Textarea
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            rows={5}
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button color="gray" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button color="success" onClick={confirmEdit}>
              Save
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {error && <Alert color="failure">{error}</Alert>}
    </div>
  );
}
