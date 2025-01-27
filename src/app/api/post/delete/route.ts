import Post from "../../../../lib/models/post.model";
import { connect } from "../../../../lib/mongodb/mongoose";
import { currentUser } from "@clerk/nextjs/server";

// Define types for user metadata and request payload
interface UserMetadata {
  isAdmin: boolean;
  userMongoId: string;
}

interface User {
  publicMetadata: UserMetadata;
}

interface RequestData {
  userId: string;
  postId: string;
}

export const DELETE = async (req: Request): Promise<Response> => {
  const user: User | null = await currentUser();

  try {
    await connect();

    // Parse the request body
    const data: RequestData = await req.json();

    // Check authorization
    if (
      !user?.publicMetadata.isAdmin ||
      user.publicMetadata.userMongoId !== data.userId
    ) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Delete the post
    await Post.findByIdAndDelete(data.postId);

    return new Response("Post has been Deleted", { status: 200 });
  } catch (error) {
    console.error("Error Deleting Post", error);
    return new Response("Error Deleting Post", { status: 500 });
  }
};
