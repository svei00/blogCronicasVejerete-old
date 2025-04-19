// /src/app/api/comments/getPostComments/[postId]/route.ts

// Import Next.js types for API routes
import { NextRequest, NextResponse } from "next/server";

// Import your MongoDB connection utility
import { connect } from "@/lib/mongodb/mongoose";

// Import your Mongoose model for comments
import Comment from "@/lib/models/comment.model"; // Adjust the import path as necessary

// This function handles GET requests to /api/comments/getPostComments/[postId]
export async function GET(
  req: NextRequest,
  context: { params: { postId: string } } //Correct typing for dynamic route segments like [postId]
) {
  await connect(); // Establishes a connection to MongoDB (if not already connected)

  try {
    const { postId } = context.params; // Extract the dynamic segment from the URL

    const comments = await Comment.find({ postId }) // Find all comments related to this post
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean(); // .lean() returns plain JS objects instead of full Mongoose documents (faster & lighter)

    return NextResponse.json(comments, { status: 200 }); // Return the comments as JSON with 200 OK
  } catch (error) {
    // Return error message as JSON if something goes wrong
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
