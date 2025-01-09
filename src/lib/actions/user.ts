import User, { IUser } from "../models/user.model";
import { connect } from "../mongodb/mongoose";

// Define the function with proper TypeScript types
export const createOrUpdateUser = async (
  id: string,
  first_name: string,
  last_name: string,
  image_url: string,
  email_addresses: { email_address: string }[],
  username: string
): Promise<IUser | null> => {
  try {
    // Connect to the database
    await connect();

    // Find and update or create the user
    const user = await User.findOneAndUpdate(
      { clerkId: id }, // Search by Clerk ID
      {
        $set: {
          name: first_name, // Update the first name
          lastName: last_name, // Use `lastName` to match the schema
          profilePicture: image_url, // Update the profile picture
          email: email_addresses[0]?.email_address, // Extract the first email address
          username: username, // Update the username
        },
      },
      { new: true, upsert: true } // Return the updated document and create it if not found
    );

    // Return the user
    return user;
  } catch (error: unknown) {
    // Type the error as `unknown` and log it safely
    console.error("Error Creating or Updating User:", error);
    return null; // Return null if an error occurs
  }
};