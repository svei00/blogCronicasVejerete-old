// /src/app/api/comments/create/route.ts
import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Comment, { IComment } from "@/lib/models/comment.model"; // Import the Comment model
import { auth } from "@clerk/nextjs/server"; // Clerk helper for server-side auth

export async function POST(req: Request) {
  await connect();

  try {
    // Clerk's auth() returns the current session data.
    const { userId } = await auth(); // Get the authenticated user's id
    if (!userId) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 403 });
    }

    // Parse the request body
    const body = await req.json();
    const { content, postId } = body;

    // Optional: if you require that userId in body should match the authenticated user:
    if (body.userId && body.userId !== userId) {
      return NextResponse.json({ message: "You're not allowed to create comments" }, { status: 403 });
    }

    // Create a new comment using the authenticated user's id
    const newComment: IComment = new Comment({
      content,
      postId,
      userId, // use the authenticated id
    });

    await newComment.save();
    return NextResponse.json(newComment, { status: 200 });
} catch (error: unknown) {
    let message = "Internal Server Error";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}
