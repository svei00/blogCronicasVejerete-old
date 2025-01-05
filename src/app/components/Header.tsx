"use client";
import React, { FC, useEffect, useState } from "react";
import { Button, Navbar, TextInput } from "flowbite-react";
import Link from "next/link";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa"; // Icons for themes
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

// Define a custom light theme object in order to deploy in Vercel
const light = {
  ...dark, // Extend the dark theme
  colorPrimary: "#ffffff",
  colorBackground: "#f8f9fa",
  colorText: "#212529",
  colorDanger: "#dc3545",
};

const Header: FC = () => {
  const path: string = usePathname();
  const { theme, setTheme, systemTheme } = useTheme(); // Access systemTheme
  const [mounted, setMounted] = useState(false);

  // Ensure the component is mounted before rendering to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent rendering on the server

  // Determine the icon based on theme and system settings
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <>
      <Navbar className="border-b-2">
        <Link
          href="/"
          className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
        >
          <span className="px-2 py-1 bg-gradient-to-r from-purple-600 via-yellow-300 to-pink-500 rounded-lg text-white">
            Crónicas del Vejerete
          </span>
          Blog
        </Link>

        <form>
          <TextInput
            type="text"
            placeholder="Buscar..."
            rightIcon={AiOutlineSearch}
            className="hidden lg:inline"
          />
        </form>

        <div className="flex gap-2 md:order-2 items-center">
          {/* Dark Mode Toggle Button */}
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
          <SignedIn>
            <UserButton
              appearance={{
                baseTheme: theme === "light" ? light : dark,
              }}
            />
          </SignedIn>
          <SignedOut>
            <Button gradientDuoTone="purpleToBlue" outline>
              <SignInButton />
            </Button>
          </SignedOut>
          <Navbar.Toggle />
        </div>
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
