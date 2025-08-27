"use client";

import { useUser } from "@clerk/nextjs";
import { TextInput, FileInput, Button, Alert } from "flowbite-react";
import "react-quill-new/dist/quill.snow.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import dynamic from "next/dynamic";
import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { app } from "@/firebase";
import CategoriesSelect from "/components/CategoriesSelect";

// Dynamically import ReactQuill (client-side only)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// Define the shape of our form data
interface FormData {
  title?: string;
  category?: string;
  image?: string;
  content?: string;
}

export default function CreatePostPage() {
  // Retrieve authentication state and user information using Clerk
  const { isSignedIn, user, isLoaded } = useUser();
  // Local state to store the selected file for image upload
  const [file, setFile] = useState<File | null>(null);
  // Track image upload progress (percentage)
  const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(
    null
  );
  // Capture any errors during image upload
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  // Store form fields data including title, category, image URL, and content
  const [formData, setFormData] = useState<FormData>({});
  // Capture any errors encountered when publishing the post
  const [publishError, setPublishError] = useState<string | null>(null);
  // Next.js router for navigation
  const router = useRouter();

  console.log(formData);

  // Function to handle image upload to Firebase Storage
  const handleUploadImage = async () => {
    try {
      // If no file is selected, show an error message
      if (!file) {
        setImageUploadError("Please select an image to upload");
        return;
      }
      // Reset any previous upload error
      setImageUploadError(null);

      // Initialize Firebase storage
      const storage = getStorage(app);
      // Create a unique filename based on the current time and the original file name
      const fileName = `${new Date().getTime()}-${file.name}`;
      const storageRef = ref(storage, fileName);
      // Start the upload task
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Listen for state changes, errors, and completion of the upload
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Calculate and update the upload progress percentage
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(Math.round(progress));
        },
        (error) => {
          // If an error occurs during upload, set an error message
          setImageUploadError("Image Upload Failed");
          console.error(error);
        },
        async () => {
          // When the upload is complete, retrieve the download URL
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            // Reset progress and error states
            setImageUploadProgress(null);
            setImageUploadError(null);
            // Update the form data with the uploaded image URL
            setFormData((prev) => ({ ...prev, image: downloadURL }));
          } catch (error) {
            console.error("Failed to retrieve image URL", error);
          }
        }
      );
    } catch (error) {
      // Catch any errors during the overall image upload process
      setImageUploadError("Image Upload Failed");
      setImageUploadProgress(null);
      console.error(error);
    }
  };

  // Function to handle form submission for creating a new post
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      // Send a POST request to our API with the form data and the user's Mongo ID
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userMongoId: user?.publicMetadata.userMongoId,
        }),
      });

      const data = await res.json();

      // If the API response indicates an error, display the publish error message
      if (!data.ok) {
        setPublishError(data.message);
        return;
      }

      // If the post was successfully created, reset the error and navigate to the new post page
      if (res.ok) {
        setPublishError(null);
        router.push(`/post/${data.slug}`);
      }
    } catch (error) {
      // Catch and display any errors encountered during post submission
      setPublishError("Failed to publish post");
      console.error(error);
    }
  };

  // While user data is loading, render nothing
  if (!isLoaded) {
    return null;
  }

  // Render the create post form only if the user is signed in and is an admin; otherwise, show an unauthorized message
  if (isSignedIn && user?.publicMetadata?.isAdmin) {
    return (
      <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-3xl my-7 font-semibold">
          Create a Post
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Form fields for Title and Category */}
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <TextInput
              type="text"
              placeholder="Title"
              required
              id="title"
              className="flex-1"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <CategoriesSelect
              value={formData.category || "uncategorized"}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
          </div>

          {/* File input and image upload button */}
          <div className="flex gap-4 items-center justify-between border-4 border-orange-500 border-dotted p-3">
            <FileInput
              accept="image/*"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFile(e.target.files?.[0] || null)
              }
            />
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              size="sm"
              outline
              onClick={handleUploadImage}
              disabled={!!imageUploadProgress} // Disable button while upload is in progress
            >
              {imageUploadProgress ? (
                // Show circular progress bar if image is uploading
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

          {/* Display image upload errors */}
          {imageUploadError && (
            <Alert color="failure">{imageUploadError}</Alert>
          )}

          {/* If an image has been successfully uploaded, display it */}
          {formData.image && (
            <div className="relative w-full h-72">
              <Image
                src={formData.image}
                alt="Uploaded"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          )}

          {/* Rich text editor for post content */}
          <ReactQuill
            theme="snow"
            placeholder="¿Qué quieres crear hoy?"
            className="h-72 mb-12"
            onChange={(value) => setFormData({ ...formData, content: value })}
          />

          {/* Optionally, display publish error messages */}
          {publishError && <Alert color="failure">{publishError}</Alert>}

          {/* Submit button to publish the post */}
          <Button type="submit" gradientDuoTone="purpleToPink">
            Publish!!
          </Button>
        </form>
      </div>
    );
  }

  // If the user is not authorized to create posts, show an error message
  return <h1>You are not authorized to view this page</h1>;
}
