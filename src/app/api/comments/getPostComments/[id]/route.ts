// /src/app/api/comments/getPostComments/[postId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Comment from "@/lib/models/comment.model"; // Adjust if your path differs

// This function handles GET requests for fetching comments by postId
export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  await connect(); // Connect to MongoDB

  try {
    const { postId } = params; // Extract postId from dynamic route

    const comments = await Comment.find({ postId }) // Query all comments with this postId
      .sort({ createdAt: -1 }) // Sort by most recent
      .lean(); // Return plain JS objects, not Mongoose documents

    return NextResponse.json(comments, { status: 200 }); // Return success response
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
