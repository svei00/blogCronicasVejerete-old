// /src/app/api/comments/create/route.ts

import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Comment from "@/lib/models/comment.model"; // Mongoose Comment model
import User from "@/lib/models/user.model";       // Mongoose User model
import { auth } from "@clerk/nextjs/server";      // Clerk server-side session

/**
 * POST /api/comments/create
 * Creates a comment tied to a post and a Clerk-authenticated user.
 */
export async function POST(req: Request) {
  // 1. Connect to MongoDB
  await connect();

  try {
    // 2. Get authenticated Clerk user ID
    const { userId: clerkUserId } = await auth(); // renamed to clarify
    if (!clerkUserId) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 403 });
    }

    // 3. Parse incoming request data
    const body = await req.json();
    const { content, postId } = body;

    // 4. Optional double-check: block user spoofing
    if (body.userId && body.userId !== clerkUserId) {
      return NextResponse.json({ message: "You're not allowed to impersonate another user." }, { status: 403 });
    }

    // 5. Look up the user from our DB (by Clerk ID)
    const dbUser = await User.findOne({ clerkId: clerkUserId }).lean();
    if (!dbUser || !dbUser._id) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // 6. Create and save the new comment
    const newComment = await Comment.create({
      content,
      postId,
      userId: dbUser._id, // Use internal ObjectId, not Clerk ID
    });

    // 7. Normalize and return the full comment structure
    const formattedComment = {
      _id: newComment._id.toString(),
      postId: newComment.postId,
      content: newComment.content,
      userId: newComment.userId.toString(),      // Internal MongoDB user ID
      clerkUserId,                               // <-- Add this field for frontend checks
      numberOfLikes: newComment.numberOfLikes ?? 0,
      likes: [],
      createdAt: newComment.createdAt,
      authorUsername: dbUser.username,
      authorImageUrl: dbUser.profilePicture || "/default-avatar.png",
    };

    return NextResponse.json(formattedComment, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
}