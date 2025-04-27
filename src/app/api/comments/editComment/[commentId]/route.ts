// 3.3 PUT Edit Comment - /src/app/api/comments/editComment/[commentId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Comment from "@/lib/models/comment.model";
import { auth } from "@clerk/nextjs/server";

/**
 * PUT /api/comments/editComment/[commentId]
 * Edits the content of an existing comment. Only the comment owner or an admin can perform this action.
 */
export async function PUT(request: NextRequest) {
  // 1. Ensure MongoDB connection is established
  await connect();

  // 2. Authenticate user via Clerk
  const { userId, sessionClaims } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // 3. Extract commentId from URL path (last segment)
    const pathSegments = request.nextUrl.pathname.split("/");
    const commentId = pathSegments[pathSegments.length - 1];

    // 4. Parse the request body to get updated content
    const { content } = await request.json();

    // 5. Retrieve the comment document by its ID
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 });
    }

    // 6. Authorization: allow if user is owner or has isAdmin flag
    const isAdmin = (sessionClaims?.publicMetadata as { isAdmin?: boolean })?.isAdmin;
    if (comment.userId !== userId && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // 7. Update the comment's content and save
    comment.content = content;
    await comment.save();

    // 8. Return the updated comment
    return NextResponse.json(comment, { status: 200 });
  } catch (error: unknown) {
    // 9. Error handling: narrow unknown to Error for message
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
}