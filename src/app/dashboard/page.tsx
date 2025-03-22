"use client";

import { useEffect, useState } from "react";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import { useSearchParams } from "next/navigation";
import DashPost from "../components/DashPost";
import DashUsers from "../components/DashUsers";
import DashboardComp from "../components/DashboardComp";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<string>("");

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* Profile */}
      {tab === "profile" && <DashProfile />}

      {/* Posts */}
      {tab === "posts" && <DashPost />}

      {/* Users */}
      {tab === "users" && <DashUsers />}

      {/* Dashboard */}
      {tab === "dash" && <DashboardComp />}
    </div>
  );
}
