// /src/app/api/comments/getPostComments/[postId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Comment from "@/lib/models/comment.model";

// Correct typing for dynamic route handler in Next.js 15+
export async function GET(
  req: NextRequest,
  context: { params: { postId: string } } // ← Correct usage of context
) {
  await connect(); // Connect to MongoDB

  try {
    const postId = context.params.postId; // Extract postId from route parameters

    // Find comments matching the postId and sort them by newest first
    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .lean();

    // Return comments with HTTP 200 status
    return NextResponse.json(comments, { status: 200 });

  } catch (error: unknown) {
    // Catch any error and return a message with HTTP 500 status
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
