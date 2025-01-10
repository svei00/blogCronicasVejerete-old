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

/**
 * Deletes a user from the database by their Clerk ID.
 * 
 * @param id - The Clerk ID of the user to delete.
 * @returns A promise that resolves to `true` if the user was deleted successfully, or `false` if an error occurred.
 */
export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    // Connect to the database
    await connect();

    // Find and delete the user by their Clerk ID
    const result = await User.findOneAndDelete({ clerkId: id });

    // Check if a user was deleted
    if (result) {
      console.log(`User with Clerk ID ${id} deleted successfully.`);
      return true; // Return true if the user was found and deleted
    } else {
      console.log(`User with Clerk ID ${id} not found.`);
      return false; // Return false if no user was found
    }
  } catch (error: unknown) {
    // Log the error for debugging
    console.error("Error Deleting User:", error);
    return false; // Return false if an error occurred
  }
};