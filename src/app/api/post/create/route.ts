import Post from "../../../../lib/models/post.model";
import { connect } from "../../../../lib/mongodb/mongoose";
import { currentUser } from "@clerk/nextjs/server";

// POST endpoint to create a new post
export async function POST(req: Request) {
  // Retrieve the current authenticated user from Clerk
  const user = await currentUser();
  let data;

  // Try to parse the JSON body from the request
  try {
    data = await req.json();
  } catch (_err) {
    // If parsing fails, return a 400 Bad Request response
    return new Response("Invalid request body", { status: 400 });
  }

  try {
    // Connect to the MongoDB database
    await connect();

    // Check if the user is authorized:
    // 1. The user must exist.
    // 2. The user's Mongo ID from public metadata must match the one in the request body.
    // 3. The user must be an admin.
    if (
      !user ||
      user.publicMetadata.userMongoId !== data.userMongoId ||
      user.publicMetadata.isAdmin !== true
    ) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Generate a URL-friendly slug from the post title:
    // - Trim whitespace
    // - Replace spaces with hyphens
    // - Convert to lower-case
    // - Remove characters that are not alphanumeric or hyphens
    const slug = data.title
      .trim()
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");

    // Create a new Post document with the provided data
    const newPost = new Post({
      userId: user.publicMetadata.userMongoId,
      content: data.content,
      title: data.title,
      image: data.image,
      category: data.category,
      slug,
    });

    // Save the new post to the database
    await newPost.save();

    // Return a successful response with the generated slug
    return new Response(
      JSON.stringify({ 
        ok: true, 
        slug: newPost.slug 
      }),
      { status: 200 }
    );
  } catch (error) {
    // Log any error encountered during post creation and return a 500 Internal Server Error response
    console.error("Error Creating the Post:", error);
    return new Response("Error Creating the Post", { status: 500 });
  }
}
