"use client";

import React, { FC, useEffect, useState } from "react";
import { Button, Navbar, TextInput } from "flowbite-react";
import Link from "next/link";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa"; // Icons for dark/light mode
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
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

  // Form submit handler with explicit type annotation for the event.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior
    // Create a URLSearchParams object from the current search parameters.
    const urlParams = new URLSearchParams(searchParams);
    // Set or update the searchTerm parameter.
    urlParams.set("searchTerm", searchTerm);
    // Convert parameters to a query string.
    const searchQuery = urlParams.toString();
    // Navigate to the search page with the updated query.
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

  // Effect to mark the component as mounted after the first render to prevent hydration mismatches.
  useEffect(() => {
    setMounted(true);
  }, []);

  // If not mounted yet, don't render anything.
  if (!mounted) return null;

  // Determine the active theme: if theme is "system", use systemTheme; otherwise, use the selected theme.
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <>
      {/* Main navigation bar */}
      <Navbar className="border-b-2">
        {/* Brand/Logo link */}
        <Link
          href="/"
          className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
        >
          <span className="px-2 py-1 bg-gradient-to-r from-purple-600 via-yellow-300 to-orange-500 hover:from-orange-500 hover:via-green-300 hover:to-purple-600 rounded-lg text-white transition-all duration-500">
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

        {/* Container for theme toggle and user authentication buttons */}
        <div className="flex gap-2 md:order-2 items-center">
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
                baseTheme: theme === "light" ? neobrutalism : dark,
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

        {/* Navigation links for different pages */}
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
