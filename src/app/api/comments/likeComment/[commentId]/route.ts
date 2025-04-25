// 3.2 PUT Like/Unlike Comment/src/app/api/comments/likeComment/[commentId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Comment from "@/lib/models/comment.model";
import { auth } from "@clerk/nextjs/server";

/**
 * PUT /api/comments/likeComment/[commentId]
 * 
 * Toggle a like or unlike on a comment for the authenticated user.
 */
export async function PUT(req: NextRequest) {
  // 1️. Ensure MongoDB is connected
  await connect();

  // 2️. Authenticate the user using Clerk
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // 3️. Extract the commentId from the URL path
    //    e.g. "/api/comments/likeComment/abcd1234"
    const parts = req.nextUrl.pathname.split("/");
    const commentId = parts[parts.length - 1];

    // 4️. Find the comment by its ID
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    // 5️. Toggle like/unlike:
    //    If userId is not in likes[], add it; otherwise remove it.
    const index = comment.likes.indexOf(userId);
    if (index === -1) {
      comment.likes.push(userId);
      comment.numberOfLikes++;
    } else {
      comment.likes.splice(index, 1);
      comment.numberOfLikes--;
    }

    // 6️. Save the updated comment document
    await comment.save();

    // 7. Return the updated comment in the response
    return NextResponse.json(comment, { status: 200 });
  } catch (err: unknown) {
    // 8️. Error handling: narrow unknown to Error
    const message =
      err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}