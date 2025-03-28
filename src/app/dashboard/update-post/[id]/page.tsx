"use client";

import { useUser } from "@clerk/nextjs";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "react-quill-new/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../../../firebase";
import Image from "next/image"; // Next.js Image for optimized image rendering

// Dynamically import ReactQuill so it loads only on the client side.
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// Define type for formData used in the update post form.
interface FormData {
  title?: string;
  category?: string;
  content?: string;
  image?: string;
}

const UpdatePost: React.FC = () => {
  // Retrieve authentication state and user details from Clerk.
  const { isSignedIn, user, isLoaded } = useUser();

  // Local state declarations for file selection, upload progress, errors, form data, etc.
  const [file, setFile] = useState<File | null>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(
    null
  );
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [publishError, setPublishError] = useState<string | null>(null);

  // Next.js router and pathname hook for navigation and extracting post ID from the URL.
  const router = useRouter();
  const pathname = usePathname();
  const postId = pathname.split("/").pop(); // Extracts the post ID from the URL.

  // Fetch the current post data when the component mounts (or when postId/admin status changes).
  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Send a POST request to retrieve the post details by postId.
        const res = await fetch("/api/post/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId }),
        });
        const data = await res.json();
        if (res.ok) {
          // Set formData with the fetched post data (using the first post from the returned array).
          setFormData(data.posts[0]);
        }
      } catch (error) {
        console.error("Error fetching post:", (error as Error).message);
      }
    };
    if (isSignedIn && user?.publicMetadata?.isAdmin) {
      fetchPost();
    }
  }, [postId, user?.publicMetadata?.isAdmin, isSignedIn]);

  // Function to handle image upload to Firebase Storage.
  const handleUploadImage = async () => {
    try {
      // Validate that a file has been selected; if not, set an error message and exit.
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);

      // Initialize Firebase storage and create a unique filename using the current timestamp.
      const storage = getStorage(app);
      const fileName = `${new Date().getTime()}-${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Monitor the upload progress, update the state, and handle errors/completion.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Calculate upload progress as a percentage.
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(Math.round(progress));
        },
        (error) => {
          // On error, set an error message and reset progress.
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        async () => {
          // On successful upload, retrieve the download URL.
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUploadProgress(null);
          setImageUploadError(null);
          // Update formData with the retrieved image URL.
          setFormData((prev) => ({ ...prev, image: downloadURL }));
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.error("Error uploading image:", (error as Error).message);
    }
  };

  // Function to handle form submission for updating the post.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior.
    try {
      // Send the updated post data to the API, including user and post IDs.
      const res = await fetch("/api/post/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userMongoId: user?.publicMetadata?.userMongoId,
          postId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message || "Failed to update post");
        return;
      }
      setPublishError(null);
      // On success, redirect to the updated post's page using the returned slug.
      router.push(`/post/${data.slug}`);
    } catch (_error) {
      // Renamed error to _error to indicate it's intentionally unused.
      setPublishError("Something went wrong");
      console.error("Error updating post:", (_error as Error).message);
    }
  };

  // Prevent rendering until user data is loaded.
  if (!isLoaded) {
    return null;
  }

  // Only allow signed-in admin users to view the update post form.
  if (isSignedIn && user?.publicMetadata?.isAdmin) {
    return (
      <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-3xl my-7 font-semibold">
          Update a post
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Title and Category inputs */}
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <TextInput
              type="text"
              placeholder="Title"
              required
              id="title"
              defaultValue={formData.title}
              className="flex-1"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <Select
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              value={formData.category}
            >
              <option value="uncategorized">Select a Category</option>
              <option value="alucines">Alucines</option>
              <option value="pensamientos">Pensamientos</option>
              <option value="announcements">Announcements</option>
              <option value="draft">Draft</option>
            </Select>
          </div>
          {/* File input and upload button */}
          <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
            <FileInput
              // Removed the type="file" property as FileInput already defaults to file input.
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <Button
              type="button"
              gradientDuoTone="purpleToBlue"
              size="sm"
              outline
              onClick={handleUploadImage}
              disabled={!!imageUploadProgress}
            >
              {imageUploadProgress ? (
                // Display a circular progress bar during image upload.
                <div className="w-16 h-16">
                  <CircularProgressbar
                    value={imageUploadProgress}
                    text={`${imageUploadProgress || 0}%`}
                  />
                </div>
              ) : (
                "Upload Image"
              )}
            </Button>
          </div>
          {/* Display image upload error if any */}
          {imageUploadError && (
            <Alert color="failure">{imageUploadError}</Alert>
          )}
          {/* If an image URL exists in formData, show a preview using Next.js Image */}
          {formData.image && (
            <div className="relative w-full h-72">
              <Image
                src={formData.image}
                alt="upload"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          )}
          {/* Rich text editor for post content */}
          <ReactQuill
            theme="snow"
            placeholder="Write something..."
            className="h-72 mb-12"
            value={formData.content}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, content: value }))
            }
          />
          {/* Submit button to update the post */}
          <Button type="submit" gradientDuoTone="purpleToBlue">
            Update
          </Button>
          {/* Display publish error messages if any */}
          {publishError && (
            <Alert className="mt-5" color="failure">
              {publishError}
            </Alert>
          )}
        </form>
      </div>
    );
  }

  // If the user is not an admin, display an unauthorized message.
  return (
    <h1 className="text-center text-3xl my-7 font-semibold min-h-screen">
      You need to be an admin to update a post
    </h1>
  );
};

export default UpdatePost;
