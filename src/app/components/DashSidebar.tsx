"use client";

import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiChartPie,
} from "react-icons/hi";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

// Define the structure for public metadata
interface PublicMetadata {
  isAdmin?: boolean; // Optional admin flag
}

export default function DashSideBar() {
  // State to track the active tab
  const [tab, setTab] = useState<string>("");

  // Get search parameters from the URL
  const searchParams = useSearchParams();

  // Get user information from Clerk (removed incorrect type argument)
  const { user, isSignedIn } = useUser();

  // Extract publicMetadata and assert its type for TypeScript safety
  const publicMetadata = user?.publicMetadata as PublicMetadata;

  // Effect to update the active tab based on URL query parameters
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [searchParams]);

  // If user is not signed in, don't render the sidebar
  if (!isSignedIn) {
    return null;
  }

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {/* Show Dashboard link only if the user is an admin */}
          {publicMetadata?.isAdmin && (
            <Link href="/dashboard?tab=dash">
              <Sidebar.Item
                active={tab === "dash" || !tab}
                icon={HiChartPie}
                as="div"
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}

          {/* Profile Link - Visible to all users */}
          <Link href="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={publicMetadata?.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>

          {/* Posts Link - Only visible to admins */}
          {publicMetadata?.isAdmin && (
            <Link href="/dashboard?tab=posts">
              <Sidebar.Item
                active={tab === "posts"}
                icon={HiDocumentText}
                as="div"
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}

          {/* Users Management - Only visible to admins */}
          {publicMetadata?.isAdmin && (
            <Link href="/dashboard?tab=users">
              <Sidebar.Item
                active={tab === "users"}
                icon={HiOutlineUserGroup}
                as="div"
              >
                Users
              </Sidebar.Item>
            </Link>
          )}

          {/* Sign-out button */}
          <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer">
            <SignOutButton />
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
