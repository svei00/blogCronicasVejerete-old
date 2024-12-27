'use client';
import React, { FC } from 'react'; // Importing React and FunctionComponent typing
import { Button, Navbar, TextInput } from 'flowbite-react'; // Importing components from Flowbite-React
import Link from 'next/link'; // Link component for navigation
import { AiOutlineSearch } from 'react-icons/ai'; // Search icon from React Icons
import { FaMoon, FaSun } from 'react-icons/fa'; // Moon icon from React Icons for dark mode toggle
import { usePathname } from 'next/navigation'; // Hook to retrieve the current pathname
import { useTheme } from 'next-themes'; // Hook to access theme and setTheme from next-themes

// Header Component
const Header: FC = () => {
  // Get the current pathname of the website to determine active links
  const path: string = usePathname();
  const { theme, setTheme } = useTheme(); // Access theme and setTheme from next-themes

  return (
    <>
      {/* Navbar Container */}
      <Navbar className="border-b-2">
        {/* Website Logo with a Gradient Background */}
        <Link
          href="/"
          className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
        >
          <span className="px-2 py-1 bg-gradient-to-r from-purple-600 via-yellow-300 to-pink-500 rounded-lg text-white">
            Crónicas del Vejerete
          </span>Blog
        </Link>

        {/* Search Input Field */}
        <form>
          <TextInput
            type="text"
            placeholder="Buscar..." // Placeholder text for search bar
            rightIcon={AiOutlineSearch} // Search icon on the right
            className="hidden lg:inline" // Visible only on larger screens
          />
        </form>

        {/* Dark Mode Toggle Button */}
        <Button
  className="w-12 h-10 hidden sm:inline"
  color="gray"
  pill
  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
>
  {theme === 'light' ? <FaSun /> : <FaMoon />}
</Button>

        {/* Sign-in Button and Navbar Toggle */}
        <div className="flex gap-2 md:order-2">
          {/* Sign-in Button with a Gradient Outline */}
          <Link href="/signin">
            <Button gradientDuoTone="purpleToBlue" outline>
              Iniciar sesión
            </Button>
          </Link>

          {/* Toggle Button for Navbar Collapse (Visible on Small Screens) */}
          <Navbar.Toggle />
        </div>

        {/* Collapsible Navbar Links */}
        <Navbar.Collapse>
          {/* Home Link - Highlighted as Active if Path Matches */}
          <Link href="/">
            <Navbar.Link active={path === '/'} as="div">
              Home
            </Navbar.Link>
          </Link>

          {/* About Link - Highlighted as Active if Path Matches */}
          <Link href="/about">
            <Navbar.Link active={path === '/about'} as="div">
              Acerca
            </Navbar.Link>
          </Link>

          {/* Projects Link - Highlighted as Active if Path Matches */}
          <Link href="/projects">
            <Navbar.Link active={path === '/projects'} as="div">
              Proyectos
            </Navbar.Link>
          </Link>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default Header;
