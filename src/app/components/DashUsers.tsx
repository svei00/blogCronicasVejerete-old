"use client";

import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useUser } from "@clerk/nextjs";
import Image from "next/image"; // Import Next.js Image for optimized image rendering

// Define TypeScript Interface for a User object
interface UserType {
  _id: string;
  createdAt: string;
  profilePicture?: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

export default function DashUsers() {
  // Retrieve the current authenticated user and its loading state
  const { user, isLoaded } = useUser();

  // Local state to store the list of users fetched from the API
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    // Function to fetch users if the authenticated user is an admin
    const fetchUsers = async () => {
      // Only fetch users if the current user is an admin
      if (!user?.publicMetadata?.isAdmin) return;
      try {
        const res = await fetch("/api/user/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // Send the admin user's Mongo ID as part of the request body
          body: JSON.stringify({
            userMongoId: user.publicMetadata.userMongoId,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          // Ensure isAdmin is a boolean and update state with the fetched users
          setUsers(
            data.users.map((u: UserType) => ({
              ...u,
              isAdmin: !!u.isAdmin,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    // Call fetchUsers once the user is loaded
    if (user && isLoaded) {
      fetchUsers();
    }
  }, [user, isLoaded]);

  // If the user is loaded and is not an admin, display an appropriate message
  if (!user?.publicMetadata?.isAdmin && isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-7">
        <h1 className="text-2xl font-semibold">You are not an Admin!</h1>
      </div>
    );
  }

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {user?.publicMetadata?.isAdmin && users.length > 0 ? (
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Date Created</Table.HeadCell>
            <Table.HeadCell>User Image</Table.HeadCell>
            <Table.HeadCell>Username</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell className="text-center">Is Admin?</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {users.map((u) => (
              <Table.Row
                key={u._id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                {/* Display the user's creation date */}
                <Table.Cell>
                  {new Date(u.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  {/* If a profile picture exists, render it with Next.js's Image component */}
                  {u.profilePicture ? (
                    <Image
                      src={u.profilePicture}
                      alt={u.username}
                      width={40} // Equivalent to w-10 (approx. 40px)
                      height={40} // Equivalent to h-10 (approx. 40px)
                      className="object-cover bg-gray-500 rounded-full"
                    />
                  ) : (
                    // Fallback element if no profile picture exists
                    <div className="w-10 h-10 bg-gray-500 rounded-full" />
                  )}
                </Table.Cell>
                <Table.Cell>{u.username}</Table.Cell>
                <Table.Cell>{u.email}</Table.Cell>
                <Table.Cell className="text-center">
                  <div className="flex justify-center">
                    {u.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        // If there are no users, display a message
        <div className="flex flex-col items-center justify-center w-full py-7">
          <h1 className="text-2xl font-semibold">You Have No Users Yet!</h1>
        </div>
      )}
    </div>
  );
}
