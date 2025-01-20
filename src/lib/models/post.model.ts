import mongoose, { Schema, Document, Model } from 'mongoose';

// Define an interface for the post document
interface IPost extends Document {
  userId: string;
  content: string;
  title: string;
  image?: string;
  category?: string;
//   tags?: string[]; // Tags field is an optional array of strings
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Create the schema
const postSchema = new Schema<IPost>(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default:
        'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png',
    },
    category: {
      type: String,
      default: 'uncategorized',
    },
    // tags: {
    //   type: [String], // Array of strings
    //   required: false, // Tags are optional
    // },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// Define and export the model
const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>('Post', postSchema);

export default Post;
