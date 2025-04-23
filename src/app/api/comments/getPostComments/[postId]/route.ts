// /src/app/api/comments/getPostComments/[postId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Comment from "@/lib/models/comment.model";

/**
 * GET /api/comments/getPostComments/[postId]
 *  
 * Since Next.js 15 no longer accepts a typed `context` parameter for route handlers,
 * we extract the dynamic `[postId]` segment from request.nextUrl.pathname.
 */
export async function GET(request: NextRequest) {
  // 1. Ensure our MongoDB client is connected.
  await connect();

  try {
    // 2. Extract the postId from the URL path:
    //    e.g. pathname === "/api/comments/getPostComments/abcd1234"
    const parts = request.nextUrl.pathname.split("/");
    const postId = parts[parts.length - 1];

    // 3. Query the Comment model for this postId, newest first.
    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .lean(); // returns plain JS objects

    // 4. Return the array of comments as JSON.
    return NextResponse.json(comments, { status: 200 });
  } catch (err: unknown) {
    // 5. Handle any errors cleanly.
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
