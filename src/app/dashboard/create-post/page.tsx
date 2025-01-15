"use client";

import { useUser } from "@clerk/nextjs";
import { TextInput, Select, FileInput, Button } from "flowbite-react";
import "react-quill-new/dist/quill.snow.css";

import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function CreatePostPage() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return null; // Return nothing while loading
  }

  // Check if the user is signed in and is an admin
  if (isSignedIn && user?.publicMetadata?.isAdmin) {
    // Added the ? in order to avoid runtime errors in case user does not exist.
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
            />
            <Select>
              <option value="uncategorized">Select a Category</option>
              <option value="alucines">Alucines</option>
              <option value="pensamientos">Pensamientos</option>
              <option value="announcements">Announcements</option>
              <option value="draft">Draft</option>
            </Select>
          </div>
          <div className="flex gap-4 items-center justify-between border-4 border-orange-500 border-dotted p-3">
            <FileInput type="file" accept="image/*" />
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              size="sm"
              outline
            >
              Upload Image
            </Button>
          </div>
          <ReactQuill
            theme="snow"
            placeholder="¿Qué quieres crear hoy?"
            className="h-72 mb-12"
            required
          />
          <Button type="submit" gradientDuoTone="purpleToPink">
            Publish
          </Button>
        </form>
      </div>
    );
  }

  // If not authorized
  return <h1>You are not authorized to view this page</h1>;
}
