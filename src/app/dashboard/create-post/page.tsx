"use client";

import { useUser } from "@clerk/nextjs";

export default function CreatePostPage() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }
  if (!isSignedIn && user.publicMetadata.isAdmin) {
    return <h1>Cronicas Del Vejerete Rules!!</h1>;
  } else {
    <h1 className="text-center text-3xl my-7 font-semibold"></h1>;
  }
  return <h1>You are not authorized to view this page</h1>;
}
