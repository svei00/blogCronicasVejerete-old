"use client";

import React, { useEffect, useState } from "react";
import { Textarea, Button, Alert, Modal } from "flowbite-react";
import { FaThumbsUp, FaEdit, FaTrash } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link"; // ✅ Corrected
import { formatDistanceToNow } from "date-fns";

interface IComment {
  _id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  numberOfLikes: number;
}

interface ICommentWithUser extends IComment {
  authorUsername: string;
  authorImageUrl: string;
}

const mockLoggedInUserId = "user_123456";
const mockOtherUserId = "user_999999";

let mockComments: ICommentWithUser[] = [
  {
    _id: "comment1",
    postId: "post1",
    userId: mockLoggedInUserId,
    content: "Hello from me!",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    numberOfLikes: 1,
    authorUsername: "john",
    authorImageUrl: "https://placehold.co/32x32",
  },
  {
    _id: "comment2",
    postId: "post1",
    userId: mockOtherUserId,
    content: "Hello from someone else!",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    numberOfLikes: 3,
    authorUsername: "jane",
    authorImageUrl: "https://placehold.co/32x32",
  },
];

const useMockUser = () => {
  const [isSignedIn] = useState(true);
  const [user] = useState({
    id: mockLoggedInUserId,
    username: "john",
    imageUrl: "https://placehold.co/24x24",
  });

  return { isSignedIn, user };
};

const fetchPostComments = async (
  postId: string
): Promise<ICommentWithUser[]> => {
  return mockComments.filter((c) => c.postId === postId);
};

const createComment = async (
  postId: string,
  content: string
): Promise<ICommentWithUser> => {
  const newComment: ICommentWithUser = {
    _id: `c_${Date.now()}`,
    postId,
    userId: mockLoggedInUserId,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    numberOfLikes: 0,
    authorUsername: "john",
    authorImageUrl: "https://placehold.co/32x32",
  };
  mockComments.unshift(newComment);
  return newComment;
};

const likeComment = async (id: string): Promise<ICommentWithUser> => {
  const comment = mockComments.find((c) => c._id === id)!;
  comment.numberOfLikes += 1;
  return comment;
};

const editComment = async (
  id: string,
  newContent: string
): Promise<ICommentWithUser> => {
  const comment = mockComments.find((c) => c._id === id)!;
  comment.content = newContent;
  comment.updatedAt = new Date().toISOString();
  return comment;
};

const deleteComment = async (id: string): Promise<void> => {
  mockComments = mockComments.filter((c) => c._id !== id);
};

interface Props {
  postId: string;
}

export default function CommentSection({ postId }: Props) {
  const [comments, setComments] = useState<ICommentWithUser[]>([]);
  const [newContent, setNewContent] = useState("");
  const [error, setError] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { isSignedIn, user } = useMockUser();

  useEffect(() => {
    fetchPostComments(postId).then(setComments);
  }, [postId]);

  const handleSubmit = async () => {
    if (!newContent.trim()) return;
    const created = await createComment(postId, newContent.trim());
    setComments([created, ...comments]);
    setNewContent("");
  };

  const handleLike = async (id: string) => {
    const updated = await likeComment(id);
    setComments((prev) => prev.map((c) => (c._id === id ? updated : c)));
  };

  const startEdit = (comment: ICommentWithUser) => {
    setEditingCommentId(comment._id);
    setEditingContent(comment.content);
    setShowEditModal(true);
  };

  const confirmEdit = async () => {
    if (!editingCommentId || !editingContent.trim()) return;
    const updated = await editComment(editingCommentId, editingContent.trim());
    setComments((prev) =>
      prev.map((c) => (c._id === editingCommentId ? updated : c))
    );
    setShowEditModal(false);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    await deleteComment(deletingId);
    setComments((prev) => prev.filter((c) => c._id !== deletingId));
    setShowDeleteModal(false);
  };

  return (
    <div className="text-white p-4 space-y-4 bg-gray-800 rounded-md">
      {isSignedIn && (
        <div className="flex items-center space-x-2">
          <Image
            src={user.imageUrl}
            alt="User"
            width={24}
            height={24}
            className="rounded-full"
          />
          <span>@{user.username}</span>
        </div>
      )}

      {isSignedIn && (
        <div>
          <Textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <Button onClick={handleSubmit} disabled={!newContent.trim()}>
            Post
          </Button>
        </div>
      )}

      {comments.map((c) => {
        const isAuthor = user?.id === c.userId;
        return (
          <div key={c._id} className="border border-gray-600 p-3 rounded-md">
            <div className="flex items-center space-x-2">
              <Image
                src={c.authorImageUrl}
                alt="avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="font-semibold">@{c.authorUsername}</span>
              <span className="text-sm text-gray-400">
                {formatDistanceToNow(new Date(c.createdAt))} ago
              </span>
            </div>
            <p className="mt-2">{c.content}</p>
            <div className="flex justify-between mt-2 text-sm text-gray-300">
              <button
                onClick={() => handleLike(c._id)}
                className="hover:text-blue-400 flex items-center gap-1"
              >
                <FaThumbsUp /> {c.numberOfLikes}
              </button>

              {isAuthor && (
                <div className="space-x-2">
                  <button
                    onClick={() => startEdit(c)}
                    className="text-yellow-400 hover:text-yellow-500"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setDeletingId(c._id);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-400 hover:text-red-500"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
        <Modal.Header>Edit Comment</Modal.Header>
        <Modal.Body>
          <Textarea
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={confirmEdit}>Save</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Modal.Header>Delete Comment</Modal.Header>
        <Modal.Body>Are you sure?</Modal.Body>
        <Modal.Footer>
          <Button color="failure" onClick={confirmDelete}>
            Delete
          </Button>
          <Button onClick={() => setShowDeleteModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
