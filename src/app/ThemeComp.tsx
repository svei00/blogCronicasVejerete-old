"use client";
import React, { useEffect, useState, ReactNode, FC } from "react";
// import { useTheme } from "next-themes";

// Define Props Type for ThemeComp
interface ThemeCompProps {
  children: ReactNode; // ReactNode allows any valid React child element
}

// Functional Component with TypeScript
const ThemeComp: FC<ThemeCompProps> = ({ children }) => {
  // const { theme, setTheme } = useTheme(); // Access theme and setTheme from next-themes
  const [mounted, setMounted] = useState(false); // State to track if the component has mounted

  // Ensure this effect runs only on the client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid rendering content until the component is mounted
  if (!mounted) {
    return null;
  }

  return (
    <>{children}</> // Render children when the component is mounted
  );
};

export default ThemeComp;
