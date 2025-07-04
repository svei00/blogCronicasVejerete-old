// /src/app/api/comments/create/route.ts

import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Comment from "@/lib/models/comment.model";     // Comment model
import User from "@/lib/models/user.model";           // User model
import { auth } from "@clerk/nextjs/server";          // Clerk server-side auth

/**
 * POST /api/comments/create
 * Creates a comment for a specific post by an authenticated user.
 */
export async function POST(req: Request) {
  await connect(); // 1. Ensure DB connection

  try {
    // 2. Get the current Clerk user ID from session
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 403 });
    }

    // 3. Parse incoming request data
    const body = await req.json();
    const { content, postId } = body;

    // 4. Prevent spoofing (optional)
    if (body.userId && body.userId !== userId) {
      return NextResponse.json({ message: "You're not allowed to impersonate another user." }, { status: 403 });
    }

    // 5. Look up user by Clerk ID
    const user = await User.findOne({ clerkId: userId }).lean();
    if (!user || !user._id) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // 6. Create the comment using MongoDB's internal _id as userId
    const newComment = new Comment({
      content,
      postId,
      userId: user._id.toString(), // Cast ObjectId to string
    });

    await newComment.save();

    // 7. Return the created comment
    return NextResponse.json(newComment, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
