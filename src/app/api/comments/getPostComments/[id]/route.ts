// /src/app/api/comments/getPostComments/[postId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Comment from "@/lib/models/comment.model";

/**
 * GET /api/comments/getPostComments/[postId]
 * Retrieves all comments for a specific post, sorted by newest first.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }  // `postId` matches the [postId] folder name
) {
  // 1. Ensure MongoDB connection
  await connect();

  try {
    // 2. Extract `postId` from the dynamic route parameters
    const { postId } = params;

    // 3. Query comments for this post, sorted descending by creation date
    //    .lean() returns plain JS objects (no Mongoose getters or methods)
    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .lean();

    // 4. Return the comments with HTTP 200
    return NextResponse.json(comments, { status: 200 });
  } catch (error: unknown) {
    // 5. Error handling: narrow `error` to `Error` before reading message
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
