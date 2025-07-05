  import mongoose, { Schema, Document, Model } from "mongoose";

  // Define an interface for the User document
  export interface IUser extends Document {
    clerkId: string;
    email: string;
    name: string;
    lastName: string;
    username: string;
    profilePicture?: string;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  // Define the User schema
  const userSchema: Schema<IUser> = new Schema(
    {
      clerkId: {
        type: String,
        required: true,
        unique: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      name: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
        unique: true,
      },
      profilePicture: {
        type: String,
        required: false,
      },
      isAdmin: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  );

  // Create the User model (use mongoose.models to avoid model overwriting issues in Next.js)
  const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

  export default User;
