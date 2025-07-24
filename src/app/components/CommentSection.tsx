import React, { useEffect, useState } from "react";
import { Textarea, Button, Alert, Modal } from "flowbite-react";
import { FaThumbsUp, FaEdit, FaTrash } from "react-icons/fa";
import Image from "next/image"; // Assuming next/image is available in the environment
import Link from "next/next"; // Assuming next/link is available in the environment
import { formatDistanceToNow } from "date-fns";

// --- MOCK DATA AND UTILITIES ---

// Mock interfaces for comments
export interface IComment {
  _id: string;
  postId: string;
  userId: string; // This is the ID of the user who created the comment
  content: string;
  createdAt: string;
  updatedAt: string;
  numberOfLikes: number;
}

export interface ICommentWithUser extends IComment {
  authorUsername: string;
  authorImageUrl: string;
}

// Mock user data - IMPORTANT: Change this mockLoggedInUserId to test different scenarios
// If this ID matches a comment's userId, you will see edit/delete buttons for that comment.
const mockLoggedInUserId = "user_2N000000000000000000000000"; // Simulate a logged-in Clerk user ID
const mockOtherUserId = "user_X1Y2Z3A4B5C6D7E8F9G0H1I2J3"; // Another user ID

// Mock initial comments
let mockComments: ICommentWithUser[] = [
  {
    _id: "comment_1",
    postId: "post_123",
    userId: mockLoggedInUserId, // This comment is by the mock logged-in user
    content: "This is the first comment by the logged-in user!",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    numberOfLikes: 3,
    authorUsername: "loggedInUser",
    authorImageUrl: "https://placehold.co/24x24/FF5733/FFFFFF?text=LU",
  },
  {
    _id: "comment_2",
    postId: "post_123",
    userId: mockOtherUserId, // This comment is by another user
    content: "A comment from another user.",
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    numberOfLikes: 7,
    authorUsername: "anotherUser",
    authorImageUrl: "https://placehold.co/24x24/3366FF/FFFFFF?text=AU",
  },
  {
    _id: "comment_3",
    postId: "post_123",
    userId: mockLoggedInUserId, // Another comment by the mock logged-in user
    content:
      "Second comment from the logged-in user, demonstrating edit/delete.",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    numberOfLikes: 1,
    authorUsername: "loggedInUser",
    authorImageUrl: "https://placehold.co/24x24/FF5733/FFFFFF?text=LU",
  },
];

// Mock Clerk's useUser hook
const useMockUser = () => {
  const [isSignedIn, setIsSignedIn] = useState(true); // Simulate being signed in
  const [user, setUser] = useState({
    id: mockLoggedInUserId,
    username: "loggedInUser",
    imageUrl: "https://placehold.co/24x24/FF5733/FFFFFF?text=LU",
  });

  // You can add logic here to simulate sign-in/sign-out if needed for more complex testing
  return { isSignedIn, user };
};

// Mock API functions for comments
const fetchPostComments = async (
  postId: string
): Promise<ICommentWithUser[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockComments
    .filter((c) => c.postId === postId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

const createComment = async (
  postId: string,
  content: string
): Promise<ICommentWithUser> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const newComment: ICommentWithUser = {
    _id: `comment_${Date.now()}`,
    postId,
    userId: mockLoggedInUserId, // Assign to the mock logged-in user
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    numberOfLikes: 0,
    authorUsername: "loggedInUser",
    authorImageUrl: "https://placehold.co/24x24/FF5733/FFFFFF?text=LU",
  };
  mockComments.unshift(newComment); // Add to the beginning for freshness
  return newComment;
};

const likeComment = async (commentId: string): Promise<ICommentWithUser> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const commentIndex = mockComments.findIndex((c) => c._id === commentId);
  if (commentIndex === -1) throw new Error("Comment not found");
  mockComments[commentIndex].numberOfLikes += 1;
  return mockComments[commentIndex];
};

const editComment = async (
  commentId: string,
  newContent: string
): Promise<ICommentWithUser> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const commentIndex = mockComments.findIndex((c) => c._id === commentId);
  if (commentIndex === -1) throw new Error("Comment not found");
  mockComments[commentIndex].content = newContent;
  mockComments[commentIndex].updatedAt = new Date().toISOString();
  return mockComments[commentIndex];
};

const deleteComment = async (commentId: string): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const initialLength = mockComments.length;
  mockComments = mockComments.filter((c) => c._id !== commentId);
  if (mockComments.length === initialLength)
    throw new Error("Comment not found for deletion");
};

// --- COMMENT SECTION COMPONENT ---

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<ICommentWithUser[]>([]);
  const [newContent, setNewContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  // State for edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const { isSignedIn, user } = useMockUser(); // Using the mock user hook

  // Load comments on component mount or postId change
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

  // Handle liking a comment
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

  // Open edit modal with current comment content
  const startEdit = (comment: ICommentWithUser) => {
    setEditingCommentId(comment._id.toString());
    setEditingContent(comment.content);
    setShowEditModal(true);
  };

  // Confirm and perform edit
  const confirmEdit = async () => {
    if (!editingCommentId || !editingContent.trim()) return;
    try {
      const updated = await editComment(
        editingCommentId,
        editingContent.trim()
      );
      setComments((prev) =>
        prev.map((c) => (c._id === editingCommentId ? updated : c))
      );
      setShowEditModal(false);
      setEditingCommentId(null);
      setEditingContent("");
      setError(null);
    } catch (err) {
      console.error("Failed to edit comment:", err);
      setError("Could not edit comment.");
    }
  };

  // Open delete confirmation modal
  const confirmDelete = (commentId: string) => {
    setShowDeleteModal(true);
    setCommentToDelete(commentId);
  };

  // Perform delete
  const handleDelete = async () => {
    if (!commentToDelete) return;
    try {
      await deleteComment(commentToDelete);
      setComments((prev) => prev.filter((c) => c._id !== commentToDelete));
      setShowDeleteModal(false);
      setCommentToDelete(null);
      setError(null);
    } catch (err) {
      console.error("Failed to delete comment:", err);
      setError("Could not delete comment.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 border border-gray-700 rounded-lg bg-gray-800 text-white font-inter">
      {/* User Info / Sign In Prompt */}
      {isSignedIn ? (
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <p>Signed in as:</p>
          <div className="relative h-6 w-6 rounded-full overflow-hidden border border-gray-500">
            <Image
              src={
                user?.imageUrl ||
                "https://placehold.co/24x24/CCCCCC/333333?text=NA"
              }
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
          You must {/* SignInButton is mocked here */}
          <button
            className="text-blue-400 underline"
            onClick={() => alert("Simulating sign in!")}
          >
            sign in
          </button>{" "}
          to comment.
        </div>
      )}

      {/* New Comment Input */}
      {isSignedIn && (
        <div className="space-y-2">
          <Textarea
            placeholder="Write a comment..."
            rows={3}
            maxLength={1000}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 rounded-md"
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              {(1000 - newContent.length).toLocaleString()} characters left
            </p>
            <Button
              onClick={handleSubmit}
              disabled={!newContent.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              Submit
            </Button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && <Alert color="failure">{error}</Alert>}

      {/* Comments Section */}
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
              // Check if the current logged-in user is the author of this comment
              const isAuthor = !!(
                isSignedIn &&
                user?.id &&
                c.userId &&
                String(user.id) === String(c.userId)
              );

              return (
                <div
                  key={c._id.toString()}
                  className="border border-gray-600 rounded-lg p-4 space-y-2 bg-gray-700 shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden border border-gray-500">
                      <Image
                        src={
                          c.authorImageUrl ||
                          "https://placehold.co/32x32/CCCCCC/333333?text=NA"
                        }
                        alt={c.authorUsername}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm font-semibold text-gray-100">
                        @{c.authorUsername}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(c.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-200 text-base leading-relaxed">
                    {c.content}
                  </p>

                  <div className="flex justify-between items-center text-sm text-gray-400 mt-2">
                    <button
                      onClick={() => handleLike(c._id.toString())}
                      className="flex items-center gap-1 hover:text-blue-400 transition duration-200 ease-in-out"
                    >
                      <FaThumbsUp className="text-lg" />
                      <span>{c.numberOfLikes}</span>
                    </button>

                    {/* Conditional rendering for Edit/Delete buttons */}
                    {isAuthor && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => startEdit(c)}
                          className="text-yellow-400 hover:text-yellow-500 transition duration-200 ease-in-out flex items-center gap-1"
                        >
                          <FaEdit className="inline-block mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(c._id.toString())}
                          className="text-red-400 hover:text-red-500 transition duration-200 ease-in-out flex items-center gap-1"
                        >
                          <FaTrash className="inline-block mr-1" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        popup
        size="md"
        className="dark:bg-gray-900/75"
      >
        <Modal.Header className="bg-gray-800 border-b border-gray-700 p-4">
          <span className="text-lg font-semibold text-white">
            Confirm Deletion
          </span>
        </Modal.Header>
        <Modal.Body className="bg-gray-800 p-6">
          <div className="text-center">
            <p className="mb-5 text-lg text-gray-400">
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                Yes, delete it
              </Button>
              <Button
                color="gray"
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Edit Comment Modal */}
      <Modal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        popup
        size="lg"
        className="dark:bg-gray-900/75"
      >
        <Modal.Header className="bg-gray-800 border-b border-gray-700 p-4">
          <span className="text-lg font-semibold text-white">
            Edit Your Comment
          </span>
        </Modal.Header>
        <Modal.Body className="bg-gray-800 p-6">
          <div className="space-y-4">
            <Textarea
              placeholder="Edit your comment..."
              rows={5}
              maxLength={1000}
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 rounded-md"
            />
            <div className="flex justify-end gap-4">
              <Button
                color="success"
                onClick={confirmEdit}
                disabled={!editingContent.trim()}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                Save Changes
              </Button>
              <Button
                color="gray"
                onClick={() => setShowEditModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
