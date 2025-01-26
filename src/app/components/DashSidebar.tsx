"use client";

import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiArrowsSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiChartPie,
} from "react-icons/hi";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { Link } from "next/link";

export default function DashSideBar() {
  const { tab, setTab } = useState("");
  const searchParams = useSearchParams();
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [searchParams]);
  if (!isSignedIn) {
    return null;
  }

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {user?.publicMetadata?.isAdmin &&
          <Link href="/dashboard?tab=dash">
            <Sidebar.item
            active={tab === "dash" || !tab}
            icon={HiChartPie}
            as="div"
            >Dashboard
            </Sidebar.item>
            </Link>}
