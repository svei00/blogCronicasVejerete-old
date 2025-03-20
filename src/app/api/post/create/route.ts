import Post from "../../../../lib/models/post.model";
import { connect } from "../../../../lib/mongodb/mongoose";
import { currentUser } from "@clerk/nextjs/server";

// POST endpoint to create a new post
export async function POST(req: Request) {
  // Retrieve the currently authenticated user using Clerk
  const user = await currentUser();
  let data;

  // Attempt to parse the JSON body from the incoming request.
  // If parsing fails, return a 400 Bad Request response.
  try {
    data = await req.json();
  } catch {
    return new Response("Invalid request body", { status: 400 });
  }

  try {
    // Establish a connection to the MongoDB database.
    await connect();

    // Validate user authorization:
    // - The user must exist.
    // - The user's Mongo ID from public metadata must match the one provided in the request body.
    // - The user must be an admin.
    if (
      !user ||
      user.publicMetadata.userMongoId !== data.userMongoId ||
      user.publicMetadata.isAdmin !== true
    ) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Generate a URL-friendly slug from the post title by:
    // - Trimming whitespace,
    // - Replacing spaces with hyphens,
    // - Converting to lower-case, and
    // - Removing any characters that are not alphanumeric or hyphens.
    const slug = data.title
      .trim()
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");

    // Create a new Post document using the provided data and the generated slug.
    const newPost = new Post({
      userId: user.publicMetadata.userMongoId,
      content: data.content,
      title: data.title,
      image: data.image,
      category: data.category,
      slug,
    });

    // Save the new post to the database.
    await newPost.save();

    // Return a successful response (HTTP 200) with the generated slug in the JSON payload.
    return new Response(
      JSON.stringify({ ok: true, slug: newPost.slug }),
      { status: 200 }
    );
  } catch (error) {
    // If any error occurs during the process, log it and return a 500 Internal Server Error response.
    console.error("Error Creating the Post:", error);
    return new Response("Error Creating the Post", { status: 500 });
  }
}
