"use client";

import { useUser } from "@clerk/nextjs";
import { TextInput, Select, FileInput, Button, Alert } from "flowbite-react";
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
import Image from "next/image";
import { app } from "@/firebase";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface FormData {
  title?: string;
  category?: string;
  image?: string;
  content?: string;
}

export default function CreatePostPage() {
  const { isSignedIn, user, isLoaded } = useUser();

  const [file, setFile] = useState<File | null>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(
    null
  );
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({});

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image to upload");
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
          setImageUploadError("Image Upload Failed");
          console.error(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData((prev) => ({ ...prev, image: downloadURL }));
          } catch (error) {
            console.error("Failed to retrieve image URL", error);
          }
        }
      );
    } catch (error) {
      setImageUploadError("Image Upload Failed");
      setImageUploadProgress(null);
      console.error(error);
    }
  };

  if (!isLoaded) {
    return null; // Return nothing while loading
  }

  if (isSignedIn && user?.publicMetadata?.isAdmin) {
    return (
      <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-3xl my-7 font-semibold">
          Create a Post
        </h1>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <TextInput
              type="text"
              placeholder="Title"
              required
              id="title"
              className="flex-1"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <Select
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
            >
              <option value="uncategorized">Select a Category</option>
              <option value="alucines">Alucines</option>
              <option value="pensamientos">Pensamientos</option>
              <option value="announcements">Announcements</option>
              <option value="draft">Draft</option>
            </Select>
          </div>
          <div className="flex gap-4 items-center justify-between border-4 border-orange-500 border-dotted p-3">
            <FileInput
              // type="file"
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
            <div className="relative w-full h-72">
              <Image
                src={formData.image}
                alt="Uploaded"
                layout="fill"
                objectFit="cover"
              />
            </div>
          )}

          <ReactQuill
            theme="snow"
            placeholder="¿Qué quieres crear hoy?"
            className="h-72 mb-12"
            onChange={(content) =>
              setFormData((prev) => ({ ...prev, content }))
            }
            // required
          />
          <Button type="submit" gradientDuoTone="purpleToPink">
            Publish
          </Button>
        </form>
      </div>
    );
  }

  return <h1>You are not authorized to view this page</h1>;
}
