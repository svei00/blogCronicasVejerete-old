import Post from "../../../../lib/models/post.model";
import { connect } from "../../../../lib/mongodb/mongoose";
import { currentUser } from "@clerk/nextjs/server";

// Define the request type
interface RequestWithBody extends Request {
  body?: any;
}

export const createPost = async (req: RequestWithBody) => {
  const user = await currentUser(); // Fetch current user
  let data;

  try {
    data = await req.json(); // Parse request body
  } catch (err) {
    return new Response("Invalid request body", { status: 400 });
  }

  try {
    await connect(); // Ensure database connection

    // Authorization check
    if (
      !user || // Ensure the user exists
      user.publicMetadata.userMongoId !== data.userMongoId || // Check userMongoId matches
      user.publicMetadata.isAdmin !== true // Ensure the user is an admin
    ) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Generate a slug from the title
    const slug = data.title
      .split("") // Split the title into characters
      .join("-") // Join back without spaces
      .toLowerCase() // Convert to lowercase
      .replace(/[^a-zA-Z0-9-]/g, ""); // Remove non-alphanumeric characters

    // Create a new post
    const newPost = new Post({
      userId: user.publicMetadata.userMongoId,
      content: data.content,
      title: data.title,
      image: data.image,
      category: data.category,
      slug,
    });

    // Save the post to the database
    await newPost.save();

    // Respond with the created post
    return new Response(JSON.stringify({ newPost }), { status: 200 });
  } catch (error) {
    console.error("Error Creating the Post:", error);
    return new Response("Error Creating the Post", { status: 500 });
  }
};
