// /src/app/api/comments/getPostComments/[postId]/route.ts
import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Comment, { IComment } from "@/lib/models/comment.model";

/**
 * GET handler for retrieving comments associated with a specific post.
 * Dynamically routed via [postId] in the file system.
 */
export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  // 1️⃣ Ensure MongoDB connection is established.
  await connect();

  try {
    // 2️⃣ Retrieve comments matching the postId parameter.
    //    - Sorted by createdAt descending for newest-first order.
    //    - .lean() returns plain JS objects (not full Mongoose Documents), improving performance.
    const rawComments = await Comment.find({ postId: params.postId })
      .sort({ createdAt: -1 })
      .lean();

    /**
     * rawComments has type `any[]` from .lean(). We assert via unknown first,
     * then to IComment[] so TS accepts it. Ensure your IComment matches the schema.
     */
    const comments = rawComments as unknown as IComment[];

    return NextResponse.json(comments, { status: 200 });
  } catch (error: unknown) {
    // 5️⃣ Error handling:
    //    - error is unknown; narrow it to Error to read .message safely.
    let message = "Internal Server Error";
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ message }, { status: 500 });
  }
}