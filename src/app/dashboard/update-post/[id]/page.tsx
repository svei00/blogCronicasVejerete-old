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

// React Quill import with dynamic loading for SSR
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// Define type for formData
interface FormData {
  title?: string;
  category?: string;
  content?: string;
  image?: string;
}

const UpdatePost: React.FC = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(
    null
  );
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [publishError, setPublishError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const postId = pathname.split("/").pop();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch("/api/post/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ postId }),
        });

        const data = await res.json();
        if (res.ok) {
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

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }

      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = `${new Date().getTime()}-${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(Math.round(progress));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUploadProgress(null);
          setImageUploadError(null);
          setFormData((prev) => ({ ...prev, image: downloadURL }));
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.error("Error uploading image:", (error as Error).message);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/post/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
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
      router.push(`/post/${data.slug}`);
    } catch (error) {
      setPublishError("Something went wrong");
      console.error("Error updating post:", (error as Error).message);
    }
  };

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn && user?.publicMetadata?.isAdmin) {
    return (
      <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-3xl my-7 font-semibold">
          Update a post
        </h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
              <option value="uncategorized">Select a category</option>
              <option value="javascript">JavaScript</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
            </Select>
          </div>
          <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
            <FileInput
              type="file"
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
          {imageUploadError && (
            <Alert color="failure">{imageUploadError}</Alert>
          )}
          {formData.image && (
            <img
              src={formData.image}
              alt="upload"
              className="w-full h-72 object-cover"
            />
          )}
          <ReactQuill
            theme="snow"
            placeholder="Write something..."
            className="h-72 mb-12"
            required
            value={formData.content}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, content: value }))
            }
          />
          <Button type="submit" gradientDuoTone="purpleToPink">
            Update
          </Button>
          {publishError && (
            <Alert className="mt-5" color="failure">
              {publishError}
            </Alert>
          )}
        </form>
      </div>
    );
  }

  return (
    <h1 className="text-center text-3xl my-7 font-semibold min-h-screen">
      You need to be an admin to update a post
    </h1>
  );
};

export default UpdatePost;
