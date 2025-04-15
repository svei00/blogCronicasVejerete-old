// /src/lib/models/comment.model.ts
import { Schema, model, models, Document } from "mongoose";

export interface IComment extends Document {
  content: string;
  postId: string;
  userId: string;
  likes: string[];
  numberOfLikes: number;
}

const CommentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    postId: { type: String, required: true },
    userId: { type: String, required: true },
    likes: { type: [String], default: [] },
    numberOfLikes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Comment || model<IComment>("Comment", CommentSchema);
