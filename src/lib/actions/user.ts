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
    // Ensure a database connection
    await connect();

    // Safely extract the first email address or provide a fallback
    const email = email_addresses[0]?.email_address || "";

    if (!email) {
      throw new Error("No valid email address provided.");
    }

    // Find and update or create the user
    const user = await User.findOneAndUpdate(
      { clerkId: id }, // Search by Clerk ID
      {
        $set: {
          name: first_name, // Match schema field `name`
          lastName: last_name, // Match schema field `lastName`
          profilePicture: image_url,
          email: email,
          username: username,
        },
      },
      { new: true, upsert: true } // Return the updated document or create if not found
    );

    return user; // Return the updated or created user
  } catch (error) {
    console.error("Error Creating or Updating User:", (error as Error).message);
    return null;
  }
};

/**
 * Deletes a user from the database by their Clerk ID.
 * @param id - The Clerk ID of the user to delete.
 * @returns A promise that resolves to `true` if the user was deleted successfully, or `false` if an error occurred.
 */
export const deleteUser = async (id: string): Promise<IUser | null> => {
  try {
    await connect();

    // Find and delete the user by their Clerk ID
    const user = await User.findOneAndDelete({ clerkId: id });

    if (user) {
      console.log(`User with Clerk ID ${id} deleted successfully.`);
      return user;
    } else {
      console.log(`User with Clerk ID ${id} not found.`);
      return null;
    }
  } catch (error) {
    console.error("Error Deleting User:", (error as Error).message);
    return null;
  }
};