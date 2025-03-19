"use client";

import { Button, Modal, Table } from "flowbite-react"; // Removed ModalBody as it's not used directly
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Image from "next/image";

// Define the Post interface to type-check the post data
interface Post {
  _id: string;
  title: string;
  slug: string;
  image: string;
  category: string;
  updatedAt: string;
}

export default function DashPost() {
  // Retrieve the current user using Clerk's useUser hook
  const { user } = useUser();
  console.log("User", user);

  // State to store the posts associated with the admin user
  const [userPost, setUserPost] = useState<Post[]>([]);
  // State to control whether the delete confirmation modal is shown
  const [showModal, setShowModal] = useState(false);
  // State to keep track of the post id to delete
  const [postIdToDelete, setPostIdToDelete] = useState("");

  // Fetch posts when the component mounts or when the user's admin status changes
  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Fetch posts via the API, sending the userId from Clerk's public metadata
        const res = await fetch("/api/post/get", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.publicMetadata?.userMongoId,
          }),
        });
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        // Update state with the fetched posts
        setUserPost(data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    // Only fetch posts if the user is an admin
    if (user?.publicMetadata?.isAdmin) {
      fetchPost();
    }
  }, [user?.publicMetadata?.isAdmin, user?.publicMetadata?.userMongoId]);

  // Function to handle the deletion of a post
  const handleDeletePost = async () => {
    // Close the modal immediately
    setShowModal(false);
    try {
      // Send a DELETE request to the API endpoint for post deletion
      const res = await fetch("/api/post/delete", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          postId: postIdToDelete,
          userId: user?.publicMetadata?.userMongoId,
        }),
      });
      if (!res.ok) {
        // If the deletion failed, extract and throw the error message from the response
        const data = await res.json();
        throw new Error(data.message);
      }
      // Remove the deleted post from the state to update the UI
      setUserPost((prevPosts) =>
        prevPosts.filter((post) => post._id !== postIdToDelete)
      );
      // Reset the postIdToDelete state
      setPostIdToDelete("");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // If the user is not an admin, show an appropriate message and do not render the dashboard
  if (!user?.publicMetadata?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-7">
        <h1 className="text-2xl font-semibold">You are not an Admin!!</h1>
      </div>
    );
  }

  // Render the posts dashboard with a table of posts and a modal for deletion confirmation
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {userPost.length > 0 ? (
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Date Updated</Table.HeadCell>
            <Table.HeadCell>Post Image</Table.HeadCell>
            <Table.HeadCell>Post Title</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
            <Table.HeadCell>Edit</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {userPost.map((post) => (
              <Table.Row
                key={post._id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                {/* Display the updated date */}
                <Table.Cell>
                  {new Date(post.updatedAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  {/* Link to the post detail page; use Next.js Image for optimized loading */}
                  <Link href={`/post/${post.slug}`}>
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={80} // Adjust width as needed
                      height={80} // Adjust height as needed
                      className="object-cover bg-gray-500"
                      priority // Prioritize loading this image for improved LCP
                    />
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  {/* Link to the post detail page with the post title */}
                  <Link
                    className="font-medium text-gray-900 dark:text-white"
                    href={`/post/${post.slug}`}
                  >
                    {post.title}
                  </Link>
                </Table.Cell>
                <Table.Cell>{post.category}</Table.Cell>
                <Table.Cell>
                  {/* When clicked, open the modal and set the post ID to delete */}
                  <span
                    className="font-medium text-red-500 hover:font-bold cursor-pointer"
                    onClick={() => {
                      setShowModal(true);
                      setPostIdToDelete(post._id);
                    }}
                  >
                    Delete
                  </span>
                </Table.Cell>
                <Table.Cell>
                  {/* Link to the edit page for this post */}
                  <Link
                    className="text-green-400 hover:font-bold text-purple-600"
                    href={`/dashboard/update-post/${post._id}`}
                  >
                    Edit
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <p>You have no posts yet!!</p>
      )}
      {/* Modal for confirming post deletion */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this Post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, I&apos;m sure.
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, Cancel.
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
