import Post from "../../../../lib/models/post.model";
import { connect } from "../../../../lib/mongodb/mongoose";
import { currentUser } from "@clerk/nextjs/server";

// Define custom type for user metadata with additional properties used in our app.
interface UserMetadata {
  isAdmin: boolean;
  userMongoId: string;
}

// Define custom type for a user object that includes our custom metadata.
interface User {
  publicMetadata: UserMetadata;
}

// Define the structure of the request payload sent to this endpoint.
interface RequestData {
  userId: string;
  postId: string;
}

export const DELETE = async (req: Request): Promise<Response> => {
  // Retrieve the current user from Clerk and force-cast it to our custom User type.
  // We use "as unknown as User | null" because the returned Clerk user type doesn't exactly match our custom interface.
  const user = (await currentUser()) as unknown as User | null;

  try {
    // Connect to the MongoDB database.
    await connect();

    // Parse the request body to extract the userId and postId.
    const data: RequestData = await req.json();

    // Check authorization:
    // Ensure the user is an admin and that their MongoDB user ID matches the one provided in the request.
    if (
      !user?.publicMetadata.isAdmin ||
      user.publicMetadata.userMongoId !== data.userId
    ) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Delete the post from the database using the provided postId.
    await Post.findByIdAndDelete(data.postId);

    // Return a success response if deletion is successful.
    return new Response("Post has been Deleted", { status: 200 });
  } catch (error) {
    // Log any errors that occur and return a failure response.
    console.error("Error Deleting Post", error);
    return new Response("Error Deleting Post", { status: 500 });
  }
};
