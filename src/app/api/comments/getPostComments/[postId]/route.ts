// /src/app/api/comments/getPostComments/[postId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose";
import Comment from "@/lib/models/comment.model";
import { Types } from "mongoose"; // for ObjectId type

/**
 * GET /api/comments/getPostComments/[postId]
 *  
 * Since Next.js 15 no longer accepts a typed `context` parameter for route handlers,
 * we extract the dynamic `[postId]` segment from request.nextUrl.pathname.
 * This route retrieves all comments for a given post, including the author's
 * username and profile image, and returns them in a format expected by the frontend.
 */
export async function GET(request: NextRequest) {
  // 1. Connect to the MongoDB database
  await connect();

  try {
    // 2. Extract the postId from the request URL
    const parts = request.nextUrl.pathname.split("/");
    const postId = parts[parts.length - 1];

    // 3. Define the expected shape of populated comments
    interface PopulatedComment {
      _id: Types.ObjectId;
      postId: string;
      content: string;
      clerkUserId?: string; // <-- added to include Clerk ID
      userId: {
        _id: Types.ObjectId;
        username?: string;
        profilePicture?: string;
      };
      likes?: string[];
      numberOfLikes?: number;
      createdAt: Date;
    }

    // 4. Fetch comments with populated user info
    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .populate("userId", "username profilePicture") // populate userId with select fields
      .lean<PopulatedComment[]>(); // Cast for safety

    // 5. Map to the ICommentWithUser format expected by frontend
    const mapped = comments.map((c) => ({
      _id: c._id.toString(),
      postId: c.postId,
      content: c.content,
      userId: c.userId._id.toString(), // convert ObjectId to string
      clerkUserId: c.clerkUserId || null, // <-- now returning Clerk ID
      numberOfLikes: Array.isArray(c.likes) ? c.likes.length : 0,
      likes: (c.likes || []).map((id) => id.toString()),
      createdAt: c.createdAt,
      authorUsername: c.userId.username || "anonymous",
      authorImageUrl: c.userId.profilePicture || "/default-avatar.png",
    }));

    // 6. Return response
    return NextResponse.json(mapped, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}