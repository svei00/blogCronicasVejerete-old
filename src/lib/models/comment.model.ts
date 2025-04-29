// /src/lib/models/comment.model.ts
// Importing necessary Mongoose components
import { Schema, model, models, Document } from "mongoose";

// Interface for a Comment document extending Mongoose's Document.
// This allows us to use Mongoose methods like `.save()` on the returned objects.
export interface IComment extends Document {
  content: string;          // The actual text of the comment
  postId: string;           // ID of the post the comment belongs to
  userId: string;           // ID of the user who created the comment
  likes: string[];          // Array of user IDs who liked the comment
  numberOfLikes: number;    // Cached number of likes for performance
}

// Define the Comment schema using the interface
const CommentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },       // Comment content must be provided
    postId: { type: String, required: true },        // Associated post ID is required
    userId: { type: String, required: true },        // User ID is required
    likes: { type: [String], default: [] },          // Initialize with empty likes array
    numberOfLikes: { type: Number, default: 0 },     // Initialize likes count to 0
  },
  { timestamps: true }  // Automatically add createdAt and updatedAt fields
);

// Export the model: use existing one if already defined to avoid redefinition
export default models.Comment || model<IComment>("Comment", CommentSchema);

