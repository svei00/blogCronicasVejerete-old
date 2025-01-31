"use client";

import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useUser } from "@clerk/nextjs";

// Define TypeScript Interface for User Object
interface UserType {
  _id: string;
  createdAt: string;
  profilePicture?: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

export default function DashUsers() {
  const { user, isLoaded } = useUser();
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.publicMetadata?.isAdmin) return;

      try {
        const res = await fetch("/api/user/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userMongoId: user.publicMetadata.userMongoId, // Ensure user is fully loaded
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setUsers(
            data.users.map((user: UserType) => ({
              ...user,
              isAdmin: !!user.isAdmin, // Ensure isAdmin is always a boolean
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (user && isLoaded) {
      fetchUsers();
    }
  }, [user, isLoaded]);

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
            {users.map((user) => (
              <Table.Row
                key={user._id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                  />
                </Table.Cell>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell className="text-center">
                  <div className="flex justify-center">
                    {user.isAdmin ? (
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
        <div className="flex flex-col items-center justify-center w-full py-7">
          <h1 className="text-2xl font-semibold">You Have No Users Yet!</h1>
        </div>
      )}
    </div>
  );
}
