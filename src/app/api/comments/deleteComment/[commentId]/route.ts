// 3.4 Delete Comment - /src/app/api/comments/deleteComment/[commentId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Comment from "@/lib/models/comment.model";
import { auth } from "@clerk/nextjs/server";

/**
 * DELETE /api/comments/deleteComment/[commentId]
 *
 * Deletes a comment by its ID. Only the comment's author or an admin may perform this action.
 */
export async function DELETE(request: NextRequest) {
  // 1. Ensure MongoDB connection is established
  await connect();

  // 2. Authenticate the user with Clerk
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // 3. Extract the commentId from the URL path
    //    e.g. "/api/comments/deleteComment/abc123"
    const segments = request.nextUrl.pathname.split("/");
    const commentId = segments[segments.length - 1];

    // 4. Retrieve the comment from the database
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 }
      );
    }

    // 5. Authorization check: allow only the comment owner or an admin
    const isAdmin = (sessionClaims?.publicMetadata as { isAdmin?: boolean })
      .isAdmin;
    if (comment.userId !== userId && !isAdmin) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    // 6. Delete the comment
    await Comment.findByIdAndDelete(commentId);

    // 7. Return a success response
    return NextResponse.json(
      { message: "Deleted" },
      { status: 200 }
    );
  } catch (err: unknown) {
    // 8. Error handling: narrow unknown to Error before reading message
    const message =
      err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}