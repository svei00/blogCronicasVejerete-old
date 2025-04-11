"use client";

import React, { FC, useEffect, useState } from "react";
import { Button, Navbar, TextInput } from "flowbite-react";
import Link from "next/link";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun, FaPen } from "react-icons/fa"; // Added FaPen for the create-post icon
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";
import { useRouter, useSearchParams } from "next/navigation";

const Header: FC = () => {
  // Get the current pathname to determine which nav link is active.
  const path: string = usePathname();

  // Access theme values and setter from next-themes.
  const { theme, setTheme, systemTheme } = useTheme();

  // State to check if component is mounted (helps prevent hydration issues).
  const [mounted, setMounted] = useState(false);

  // Next.js router for programmatic navigation.
  const router = useRouter();

  // State to hold the search term from the input.
  const [searchTerm, setSearchTerm] = useState("");

  // Get URL search parameters.
  const searchParams = useSearchParams();

  // Clerk hook to get user data.
  const { user, isLoaded } = useUser();

  // Form submit handler with explicit type annotation for the event.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    router.push(`/search?${searchQuery}`);
  };

  // Effect to set the search term state if it exists in the URL.
  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [searchParams]);

  // Effect to mark the component as mounted.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Ensure component is only rendered once mounted and user data is loaded.
  if (!mounted || !isLoaded) return null;

  // Determine the active theme.
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <>
      <Navbar className="border-b-2">
        {/* Brand/Logo link */}
        <Link
          href="/"
          className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
        >
          <span className="inline-block px-2 py-1 bg-gradient-to-r from-purple-600 via-yellow-300 to-orange-500 hover:from-orange-500 hover:via-green-300 hover:to-purple-600 rounded-lg text-white transition-all duration-500">
            Crónicas del Vejerete
          </span>
          Blog
        </Link>

        {/* Search form */}
        <form onSubmit={handleSubmit}>
          <TextInput
            type="text"
            placeholder="Buscar..."
            rightIcon={AiOutlineSearch}
            className="hidden lg:inline"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* Container for theme toggle, admin create-post, and user authentication buttons */}
        <div className="flex gap-2 md:order-2 items-center">
          {/* Conditionally show the create-post button if user is signed in and is admin */}
          {user?.publicMetadata?.isAdmin && (
            <Link href="/dashboard/create-post">
              {/* Using a Button with the pen icon */}
              <Button
                color="info"
                pill
                className="w-10 h-10"
                title="Create Post"
              >
                <FaPen />
              </Button>
            </Link>
          )}

          {/* Toggle button for dark/light mode */}
          <Button
            className="w-10 h-10"
            color="gray"
            pill
            onClick={() =>
              setTheme(currentTheme === "light" ? "dark" : "light")
            }
          >
            {currentTheme === "light" ? <FaSun /> : <FaMoon />}
          </Button>

          {/* Display user button if signed in */}
          <SignedIn>
            <UserButton
              appearance={{
                baseTheme: currentTheme === "light" ? neobrutalism : dark,
              }}
              userProfileUrl="/dashboard?tab=profile"
            />
          </SignedIn>

          {/* Display sign in button if signed out */}
          <SignedOut>
            <Button gradientDuoTone="purpleToBlue" outline>
              <SignInButton />
            </Button>
          </SignedOut>

          {/* Toggle button for responsive Navbar collapse */}
          <Navbar.Toggle />
        </div>

        {/* Navigation links */}
        <Navbar.Collapse>
          <Link href="/">
            <Navbar.Link active={path === "/"} as="div">
              Home
            </Navbar.Link>
          </Link>
          <Link href="/about">
            <Navbar.Link active={path === "/about"} as="div">
              Acerca
            </Navbar.Link>
          </Link>
          <Link href="/projects">
            <Navbar.Link active={path === "/projects"} as="div">
              Proyectos
            </Navbar.Link>
          </Link>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default Header;
