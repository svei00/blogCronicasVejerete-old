# Crónicas del Vejerete Blog
## Install Next.js and Tailwind css and create the first template.
1. Open the termina. Short cut is CTRL + `
2. Create the project folder (On Windows Usually C:\Repos\Project-name) 
3. Follow instructions on [NextJS](https://nextjs.org/docs/getting-started/installation) `npx create-next-app@latest .` point is for remain same folder.
   3.1 Installation menu will ask you if you want to proceed hit yes `y`
   3.2 Install TypseScrip despite in the turorial is not required.
   3.3 Install Eslint.
   3.4 Install Tailwind.
   3.5 Use the src folder.
   3.6 Use the app router.
   3.7 TurboPack yes.
   3.8 Alias. use the default one so `no`
4. Check if the application was succesfully installed by running `npm run dev` and open the browser at `http://localhost:3000`
5. Got to the folder `/src/app` and delete the code ont `page.tsx` and use RFC (React Functional Component) to create the first template.
6. Those are some useful extensions you can use to make the job easier:
   6.1 Tailwind CSS IntelliSense.
   6.2 Prettier Code formatter.
   6.3 Multple cursor case preserve.
   6.4 ES7+ React/Redux/React-Native snippets.
   6.5 GitHub Copilot.
7. Create the github repository.
   7.1 Go to your repository in the Repository tab and hit in `New`
   7.2 Type the repository name and a Description, make it public or private.
   7.3 Finally hit in Create Repository.
   7.4 You can use `git remote add origin https://github.com/svei00/blogCronicasVejerete.git` to get repository from Github.
   7.5 To indicate the branch `git branch -M main`
   7.6 And push it to the Github: `git push -u origin main`
   7.7 If it doesn't work try: `git config --global core.autocrlf true`
   7.8 The `git add .`
   7.9 Next`git commit -m "First commit or your commit"`
   7.10 And finally `git push -u origin main`
8. Last but not least in tailwind.config.ts add your pallet color. int the colors:{} example:
   `
    colors: {
            // Your primary brand colors
            brand: {
            DEFAULT: '#0F172A', // Your main brand color
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
            950: '#020617',
            },
            // Your secondary brand color
            accent: {
            DEFAULT: '#2563EB',
            50: '#EFF6FF',
            100: '#DBEAFE',
            200: '#BFDBFE',
            300: '#93C5FD',
            400: '#60A5FA',
            500: '#3B82F6',
            600: '#2563EB',
            700: '#1D4ED8',
            800: '#1E40AF',
            900: '#1E3A8A',
            950: '#172554',
            },
            // Social media platform colors
            social: {
            facebook: '#1877F2',
            twitter: '#1DA1F2',
            instagram: '#E4405F',
            linkedin: '#0A66C2',
            youtube: '#FF0000',
            tiktok: '#000000',
            whatsapp: '#25D366',
            telegram: '#0088cc',
            discord: '#5865F2',
            github: '#181717',
            },
            // Status colors
            status: {
            success: '#22C55E',
            error: '#EF4444',
            warning: '#F59E0B',
            info: '#3B82F6',
            },
        },
        // Add custom gradient combinations if needed
        gradientColorStops: theme => ({
            'brand-gradient': {
            from: theme('colors.brand.500'),
            via: theme('colors.brand.700'),
            to: theme('colors.brand.900'),
            },
            'accent-gradient': {
            from: theme('colors.accent.400'),
            via: theme('colors.accent.600'),
            to: theme('colors.accent.800'),
            },
        }),
        },
    },
   `

## Create the Header Section.
1. Create a new folder called components and inside it create a new file called Header.tsx 
2. Add the React Functional Component with RFC.
3. Go to `layout.tsx` and import the Header component.
4. Between the <body> and <children> add the <Header /> if not auto import: `import Header from './components/Header';`
5. Install [Flowbite-react](https://flowbite-react.com//) site, then hit Get Started.
   5.1 Install the package via npm `npm install flowbite-react`.
   5.2 Now go to the `tailwind.config.ts` file and add the following code:
       Go to the top of the file and import `import flowbite from 'flowbite-react/tailwind';";`
   5.3 In the content part add: `flowbite.content(),`
   5.4 And in plugins add the pluglin:
   `
    plugins: [
        flowbite.plugin()
    ],
   `
6. Install React Icons via npm `npm install react-icons`
7. Code for the Header.tsx component:
   `
   'use client';
   import React, { FC } from 'react'; // Importing React and FunctionComponent typing
   import { Button, Navbar, TextInput } from 'flowbite-react'; // Importing components from Flowbite-React
   import Link from 'next/link'; // Link component for navigation
   import { AiOutlineSearch } from 'react-icons/ai'; // Search icon from React Icons
   import { FaMoon } from 'react-icons/fa'; // Moon icon from React Icons for dark mode toggle
   import { usePathname } from 'next/navigation'; // Hook to retrieve the current pathname

   // Header Component
   const Header: FC = () => {
   // Get the current pathname of the website to determine active links
   const path: string = usePathname();

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
         <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
            <FaMoon />
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
   `

## Add Next-Themes to apply Dark Mode.
1. Install the package Next Themes `npm i next-themes`
2. Add the <ThemeProvider> tag after and before the <body> tag on the /src/app `layout.txs` file
3. Create a <ThemeComp> component inside the /src/app/components folder.
4. In the file `ThemeCopm.tsx` add the following code:
   `
   'use client';
   import React, { useEffect, useState, ReactNode, FC } from 'react';
   import { useTheme } from 'next-themes';

   // Define Props Type for ThemeComp
   interface ThemeCompProps {
   children: ReactNode; // ReactNode allows any valid React child element
   }

   // Functional Component with TypeScript
   const ThemeComp: FC<ThemeCompProps> = ({ children }) => {
   const { theme, setTheme } = useTheme(); // Access theme and setTheme from next-themes
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
   `
5. The `layout.tsx` file should now look like this:
   `
   import type { Metadata } from "next";
   import { Geist, Geist_Mono } from "next/font/google";
   import "./globals.css";
   import Header from "./components/Header";
   import { ThemeProvider } from "next-themes";
   import ThemeComp from "./ThemeComp";

   const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
   });

   const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
   });

   export const metadata: Metadata = {
   title: "Create Next App",
   description: "Generated by create next app",
   };

   export default function RootLayout({
   children,
   }: Readonly<{
   children: React.ReactNode;
   }>) {
   return (
      <html lang="en" suppressHydrationWarning>
         <body
         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
         >
         <ThemeProvider attribute="class" enableSystem>
            <ThemeComp>
               <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen">
               <Header />
               {children}
               </div>
            </ThemeComp>
         </ThemeProvider>
         </body>
      </html>
   );
   }
   `
6. And the Header.tsx:
   `
   'use client';
   import React, { FC, useEffect, useState } from 'react';
   import { Button, Navbar, TextInput } from 'flowbite-react';
   import Link from 'next/link';
   import { AiOutlineSearch } from 'react-icons/ai';
   import { FaMoon, FaSun } from 'react-icons/fa'; // Icons for themes
   import { usePathname } from 'next/navigation';
   import { useTheme } from 'next-themes';

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
   const currentTheme =
      theme === 'system' ? systemTheme : theme;

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

         {/* Dark Mode Toggle Button */}
         <Button
            className="w-10 h-10"
            color="gray"
            pill
            onClick={() =>
               setTheme(
               currentTheme === 'light' ? 'dark' : 'light'
               )
            }
         >
            {currentTheme === 'light' ? <FaSun /> : <FaMoon />}
         </Button>

         <div className="flex gap-2 md:order-2">
            <Link href="/signin">
               <Button gradientDuoTone="purpleToBlue" outline>
               Iniciar sesión
               </Button>
            </Link>
            <Navbar.Toggle />
         </div>

         <Navbar.Collapse>
            <Link href="/">
               <Navbar.Link active={path === '/'} as="div">
               Home
               </Navbar.Link>
            </Link>
            <Link href="/about">
               <Navbar.Link active={path === '/about'} as="div">
               Acerca
               </Navbar.Link>
            </Link>
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
   `


## Adding Authentication Using Clerk.
1. Go to [Clerk](https://clerk.com/) and create a new project. If you don't have an account, create one.
2. Select *Application name* to create the login. Then hit **Create Applicaiton**
3. Install Clerk app `npm install @clerk/nextjs`
4. Add the Enviromental Variable by going to `src` folder and create the `env.local` file. Then paste the clerk code:
   `
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_aWRlYWwtYW50ZWxvcGUtMzkuY2xlcmsuYWNjb3VudHMuZGV2JA
   CLERK_SECRET_KEY=sk_test_51NJrH9ZRXWiMJQxeo2sxnowyHaxuHrUnfeF2L2kNk
   `
   47:45


## Bibliography
1. Main Tutorial [Code With Sahand](https://www.youtube.com/watch?v=Zw8Wl1W0LW0&t=9s) 
2. [NextJS](https://nextjs.org/docs/getting-started/installation) 