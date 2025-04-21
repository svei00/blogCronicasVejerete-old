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
4. Add the Enviromental Variable by going to `/` folder and create the `env.local` file. Then paste the clerk code:
   `
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_aWRlYWwtYW50ZWxvcGUtMzkuY2xlcmsuYWNjb3VudHMuZGV2JA
   CLERK_SECRET_KEY=sk_test_51NJrH9ZRXWiMJQxeo2sxnowyHaxuHrUnfeF2L2kNk
   `
5. Add middleware file `middleware.ts` inside the `/src` folder.
6. Go back to `layout.tsx` file on `/src/app` folder and cover all the code with the tag <ClerkProvider>
   6.1 If not auto import: `import { ClerkProvider } from "@clerk/nextjs";` on the top of the code.
   It should look like this:
   `
   <ClerkProvider>
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
    </ClerkProvider>
   `
7. Now go to `/src/app/components/Header.tsx` and add the following code:
   `import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';`

8. Install [Clerk Themes](https://clerk.com/docs/customization/themes) to manage dark and light theme. `npm install @clerk/themes`
9. In the `Header.tsx` file, add the following code: `import { dark, light } from '@clerk/themes';`
10. In the Sign In button add the following code:
    `
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
    `  
11. On [Clerk](https://clerk.com/docs/references/nextjs/custom-signup-signin-pages) you can se how to create `src/app/sign-up/[[...sign-up]]/page.tsx` file and add the following code:
    `
      import { SignUp } from "@clerk/nextjs";

      const Page: React.FC = () => {
      return (
         <div className="flex items-center justify-center p-3">
            <SignUp />
         </div>
      );
      };

      export default Page;
    `
12. Do the same with the SignIn page by creating `src/app/sign-in/[[...sign-in]]/page.tsx` file and add the following code:
    `
    import { SignIn } from "@clerk/nextjs";

      const Page: React.FC = () => {
      return (
         <div className="flex items-center justify-center p-3">
            <SignIn />
         </div>
      );
      };

      export default Page;
    `
13. On the `.env.local` file add:
    `
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    `

## Sync Clerk Data to Your Application with Webhooks.
1. For this step if you don't publish your app in a host you can deploy it at [vercel](https://vercel.com/)
   1.1 Remember that you cannot use special characters so use html maks
   1.2 Use Github to Sing-in/Sign-up that way will be easier to deploy your site.
   1.3 Go to the project list and import it.
   1.4 Go to the settings and add the environment variables copy and paste the `.env.local` varialbes.
   1.5 Hit Deploy.
2. Go to your **Clerk** Application then **Configure** > **Webhooks** [Webhook Sync](https://clerk.com/docs/webhooks/sync-data)
3. Hit the button **Add Endpoint** and paste the vercer url `https://your-app-name.vercel.app/api/webhooks` since it doesn't work with `localhost` or `127.0.0.1` then hit:
   3.1 user.created
   3.2 user.updated
   3.3 user.deleted
   3.4 Hit **Create** button.
   3.5 Go to the Signing Secret and copy that key.
4. Go to the **.env.local** file and add the following code: `SIGNING_SECRET=whswhsec_your_secret_signin_key`
5. Do the same in the Vercel enviromental variables by adding the same code.
   5.1 Vercel App -> Settings -> Environment Variables -> Add Variable -> Name: `SIGNING_SECRET` Value: `whswhsec_your_secret_signin_key`
6. Install Svix by: `npm install svix` to deliver webhooks to your application.
7. Create a route.tsx file on `/src/app/api/webhooks/route.ts` and add the following code:
   `
   import { Webhook } from 'svix'
   import { headers } from 'next/headers'
   import { WebhookEvent } from '@clerk/nextjs/server'

   export async function POST(req: Request) {
   const SIGNING_SECRET = process.env.SIGNING_SECRET

   if (!SIGNING_SECRET) {
      throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
   }

   // Create new Svix instance with secret
   const wh = new Webhook(SIGNING_SECRET)

   // Get headers
   const headerPayload = await headers()
   const svix_id = headerPayload.get('svix-id')
   const svix_timestamp = headerPayload.get('svix-timestamp')
   const svix_signature = headerPayload.get('svix-signature')

   // If there are no headers, error out
   if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Error: Missing Svix headers', {
         status: 400,
      })
   }

   // Get body
   const payload = await req.json()
   const body = JSON.stringify(payload)

   let evt: WebhookEvent

   // Verify payload with headers
   try {
      evt = wh.verify(body, {
         'svix-id': svix_id,
         'svix-timestamp': svix_timestamp,
         'svix-signature': svix_signature,
      }) as WebhookEvent
   } catch (err) {
      console.error('Error: Could not verify webhook:', err)
      return new Response('Error: Verification error', {
         status: 400,
      })
   }

   // Do something with payload
   // For this guide, log payload to console
   const { id } = evt.data
   const eventType = evt.type
   console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
   console.log('Webhook payload:', body)

   return new Response('Webhook received', { status: 200 })
   }
   `
8. Also you can add examples when user is Created, Updated or deleted around the line of code 55 of route.ts:
   `
   if (evt.type === 'user.created') {
      console.log(`User ${evt.data.id} was created`)
   }
   if (evt.type === 'user.updated') {
      console.log(`User ${evt.data.id} was updated`)
   }
   if (evt.type === 'user.deleted') {
      console.log(`User ${evt.data.id} was deleted`)
   }
   `
   
## Add MongoDb and Save Users from Clerk
1. Go to [MongoDB](https://www.mongodb.com/) And Sign-in or Sign-up.
2. Create a Cluster, you can leave the name to **cluster0**
3. Create the username and password. You can leave the name to **admin**
4. In choose conections pick **Driver** then:
   4.1 Node.js 6.7 or later
   4.2 Install MongoDB on the app `npm install mongodb`
   4.3 Install Mongoose `npm install mongoose`
5. Go to the **.env.local** file and add the following code: `MONGODB_URI=mongodb+srv://admin:your_password@cluster0.mongodb.net/test?retryWrites=true&w=majority`
6. Inside the **src** folder create `/lib/mongodb/mongoose.ts` file:
   ```
   import mongoose from "mongoose";

   let initialized: boolean = false; // Explicitly typed as boolean

   export const connect = async (): Promise<void> => {
      mongoose.set("strictQuery", true);

      if (initialized) {
         console.log("Already connected to MongoDB");
         return;
      }

      try {
         await mongoose.connect(process.env.MONGODB_URI || "", {
               dbName: "cronicasdelvejerete",
               useNewUrlParser: true,
               useUnifiedTopology: true,
         });
         console.log("Connected to MongoDB");
         initialized = true;
      } catch (error) {
         console.error("Error connecting to MongoDB:", error);
      }
   };
   ```
7. Create a file in `src/lib/models/user.model.ts` code should look like:
   ```
   import mongoose, { Schema, Document, Model } from "mongoose";

   // Define an interface for the User document
   export interface IUser extends Document {
   clerkId: string;
   email: string;
   name: string;
   lastName: string;
   username: string;
   profilePicture?: string;
   isAdmin: boolean;
   createdAt: Date;
   updatedAt: Date;
   }

   // Define the User schema
   const userSchema: Schema<IUser> = new Schema(
   {
      clerkId: {
         type: String,
         required: true,
         unique: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
      },
      name: {
         type: String,
         required: true,
      },
      lastName: {
         type: String,
         required: true,
      },
      username: {
         type: String,
         required: true,
         unique: true,
      },
      profilePicture: {
         type: String,
         required: false,
      },
      isAdmin: {
         type: Boolean,
         default: false,
      },
   },
   { timestamps: true }
   );

   // Create the User model (use mongoose.models to avoid model overwriting issues in Next.js)
   const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

   export default User;

   ```
8. Now create the folder actios and its file: `src/lib/actions/user.ts` with the following code:
   ```
   import User, { IUser } from "../models/user.model";
   import { connect } from "../mongodb/mongoose";

   // Define the function with proper TypeScript types
   export const createOrUpdateUser = async (
   id: string,
   first_name: string,
   last_name: string,
   image_url: string,
   email_addresses: { email_address: string }[],
   username: string
   ): Promise<IUser | null> => {
   try {
      // Connect to the database
      await connect();

      // Find and update or create the user
      const user = await User.findOneAndUpdate(
         { clerkId: id }, // Search by Clerk ID
         {
         $set: {
            name: first_name, // Update the first name
            lastName: last_name, // Use `lastName` to match the schema
            profilePicture: image_url, // Update the profile picture
            email: email_addresses[0]?.email_address, // Extract the first email address
            username: username, // Update the username
         },
         },
         { new: true, upsert: true } // Return the updated document and create it if not found
      );

      // Return the user
      return user;
   } catch (error: unknown) {
      // Type the error as `unknown` and log it safely
      console.error("Error Creating or Updating User:", error);
      return null; // Return null if an error occurs
   }
   };

   //**
   * Deletes a user from the database by their Clerk ID.
   * 
   * @param id - The Clerk ID of the user to delete.
   * @returns A promise that resolves to `true` if the user was deleted successfully, or `false` if an error occurred.
   */
      export const deleteUser = async (id: string): Promise<boolean> => {
      try {
         // Connect to the database
         await connect();

         // Find and delete the user by their Clerk ID
         const result = await User.findOneAndDelete({ clerkId: id });

         // Check if a user was deleted
         if (result) {
            console.log(`User with Clerk ID ${id} deleted successfully.`);
            return true; // Return true if the user was found and deleted
         } else {
            console.log(`User with Clerk ID ${id} not found.`);
            return false; // Return false if no user was found
         }
      } catch (error: unknown) {
         // Log the error for debugging
         console.error("Error Deleting User:", error);
         return false; // Return false if an error occurred
      }
      };
   ```
9. Go back to **route.ts** file inside the `src/app/api/webhooks` folder. Around line of code 50 change the following:
    ```
      import { Webhook } from 'svix';
      import { headers } from 'next/headers';
      import { clerkClient, WebhookEvent } from '@clerk/nextjs/server';
      import { createOrUpdateUser, deleteUser } from '@/lib/actions/user';

      export async function POST(req: Request): Promise<Response> {
      const SIGNING_SECRET = process.env.SIGNING_SECRET;

      if (!SIGNING_SECRET) {
         throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local');
      }

      // Create new Svix instance with secret
      const wh = new Webhook(SIGNING_SECRET);

      // Get headers
      const headerPayload = await headers();
      const svix_id = headerPayload.get('svix-id');
      const svix_timestamp = headerPayload.get('svix-timestamp');
      const svix_signature = headerPayload.get('svix-signature');

      // If there are no headers, error out
      if (!svix_id || !svix_timestamp || !svix_signature) {
         return new Response('Error: Missing Svix headers', {
            status: 400,
         });
      }

      // Get body
      const payload = await req.json();
      const body = JSON.stringify(payload);

      let evt: WebhookEvent;

      // Verify payload with headers
      try {
         evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
         }) as WebhookEvent;
      } catch (err) {
         console.error('Error: Could not verify webhook:', err);
         return new Response('Error: Verification error', {
            status: 400,
         });
      }

      // Log payload for debugging
      const { id } = evt?.data ?? {};
      const eventType = evt?.type;
      console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
      console.log('Webhook payload:', body);

      // Handle user events
      if (eventType === 'user.created' || eventType === 'user.updated') {
         const {
            id,
            first_name,
            last_name,
            image_url,
            email_addresses,
            username,
         } = evt?.data ?? {};

         // Type check for required id
         if (!id) {
            return new Response('Error: User ID is undefined', {
            status: 400,
            });
         }

         try {
            const user = await createOrUpdateUser(
            id,
            first_name ?? '',
            last_name ?? '',
            image_url ?? '',
            email_addresses,
            username ?? ''
            );

            if (user && eventType === 'user.created') {
            try {
               // Initialize Clerk client
               const clerk = await clerkClient();
               
               // Update user metadata
               await clerk.users.updateUserMetadata(id, {
                  publicMetadata: {
                  userMongoId: user._id,
                  isAdmin: user.isAdmin,
                  },
               });
            } catch (error) {
               console.error('Error Updating User Metadata:', error);
               // Don't return here as we still want to send a success response
               // The user was created successfully, even if metadata update failed
            }
            }

            return new Response('User processed successfully', { status: 200 });
         } catch (error) {
            console.error('Error Creating or Updating User:', error);
            return new Response('Error: Could not create or update user', {
            status: 400,
            });
         }
      }

      if (eventType === 'user.deleted') {
         const { id } = evt?.data ?? {};
         if (!id) {
            return new Response('Error: User ID is undefined', {
            status: 400,
            });
         }

         try {
            await deleteUser(id);
            return new Response('User deleted successfully', { status: 200 });
         } catch (error) {
            console.error('Error Deleting User:', error);
            return new Response('Error: Could not delete user', {
            status: 400,
            });
         }
      }

      return new Response('Webhook received', { status: 200 });
      }
    ```
10. Go to Verce. and add the MongoDB environment variables **MONGODB_UR** from `.env.local` file
11. On MongoDB go to Network Access and for testing purposes add **Allow Access from Anywhere**


## Add the Create Post Page UI and Protect it as an admin
1. Go to `app` folder and create a new folder called `dashboard` and a file calle page.tsx
   1.1 Using RFC (React Functional Component) create a new component called `Dashboard` and export it.
2. Now inside the `dashboard` folder create a new folder called `create-post` and a file called `page.tsx`
3. Go to `src` folder an open the **middleware.ts** file and modify the code:
   ```
   import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

   const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']); // This ensuees that all the routes inside the dashboard will be protected

   export default clerkMiddleware(async (auth, req) => {
   const { userId } = await auth(); // Get the user id from the auth object
   if(!userId && isProtectedRoute(req)) { // If the user is not logged in and the route is protected, redirect to the sign in page
      return (await auth()).redirectToSignIn();
   }
   })

   export const config = {
   matcher: [
      // Skip Next.js internals and all static files, unless found in search params
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      // Always run for API routes
      '/(api|trpc)(.*)',
   ],
   };
   ```
4. Go to Clerk Dashboard and change the user that you want as an Admin in the Public Metadata in `isAmind` to true.
5. Do the same in MongoDB
6. Install (ReactQuillNew)[https://www.npmjs.com/package/react-quill-new] `npm install react-quill-new --save`
7. Go back to `src/app/dashboard/create-post/page.tsx` and paste the following code:
   ```
     "use client";

   import { useUser } from "@clerk/nextjs";
   import { TextInput, Select, FileInput, Button } from "flowbite-react";
   import "react-quill-new/dist/quill.snow.css";

   import dynamic from "next/dynamic";
   const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

   export default function CreatePostPage() {
      const { isSignedIn, user, isLoaded } = useUser();

      if (!isLoaded) {
         return null; // Return nothing while loading
      }

      // Check if the user is signed in and is an admin
      if (isSignedIn && user?.publicMetadata?.isAdmin) {
         // Added the ? in order to avoid runtime errors in case user does not exist.
         return (
         <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center text-3xl my-7 font-semibold">
               Create a Post
            </h1>
            <form className="flex flex-col gap-4">
               <div className="flex flex-col gap-4 sm:flex-row justify-between">
               <TextInput
                  type="text"
                  placeholder="Title"
                  required
                  id="title"
                  className="flex-1"
               />
               <Select>
                  <option value="uncategorized">Select a Category</option>
                  <option value="alucines">Alucines</option>
                  <option value="pensamientos">Pensamientos</option>
                  <option value="announcements">Announcements</option>
                  <option value="draft">Draft</option>
               </Select>
               </div>
               <div className="flex gap-4 items-center justify-between border-4 border-orange-500 border-dotted p-3">
                  <FileInput type="file" accept="image/*" />
               <Button
                  type="button"
                  gradientDuoTone="purpleToPink"
                  size="sm"
                  outline
               >
                  Upload Image
               </Button>
               </div>
               <ReactQuill
               theme="snow"
               placeholder="¿Qué quieres crear hoy?"
               className="h-72 mb-12"
               required
               />
               <Button type="submit" gradientDuoTone="purpleToPink">
               Publish
               </Button>
            </form>
         </div>
         );
      }

      // If not authorized
      return <h1>You are not authorized to view this page</h1>;
   }

   ```
8. For Styling the React-Quill-New app you can copy and paste the following code on `/src/app/globals.css`:
   ```
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   body {
   height: 100vh;
   }

   .ql-editor {
   font-size: 1.05rem;
   }

   .post-content p {
   margin-bottom: 0.5rem;
   }

   .post-content h1 {
   font-size: 1.5rem;
   font-weight: 600;
   font-family: sans-serif;
   margin: 1.5rem 0;
   }

   .post-content h2 {
   font-size: 1.4rem;
   font-family: sans-serif;
   margin: 1.5rem 0;
   }

   .post-content a {
   color: rgb(73, 149, 199);
   text-decoration: none;
   }

   .post-content a:hover {
   text-decoration: underline;
   }

   .dark .post-content a {
   color: red;
   }
   ```

## Complete upload post image functionality
1. To add this functionality we need to go to (Firebase)[https://firebase.google.com/] site.
2. Then Go to Console:
   2.1 If first time click on **Get Started with a Firebase project** otherwise **Create a Project**
   2.2 Name your project and click on **Continue**
   2.3 In Google Analytics it is not necesary so you can/can't select it.
   2.4 Hit the button **Create Project** and wait a few seconds.
3. In the get started by adding Firebase to your App select the Web option (the one with </> icon).
   3.1 In Register App you can repeat the same name you already type and hit **Register App** without checking the *Setup Firebase hosting* checkbox.
   3.2 Instal Firebase to your applicaciont by `npm install firebase`
   3.3 Copy the privided code and paste it on `/src/firebase.tsx`:
       ```
       // Import the functions you need from the SDKs you need
         import { initializeApp } from "firebase/app";
         import { getAnalytics } from "firebase/analytics";
         // TODO: Add SDKs for Firebase products that you want to use
         // https://firebase.google.com/docs/web/setup#available-libraries

         // Your web app's Firebase configuration
         // For Firebase JS SDK v7.20.0 and later, measurementId is optional
         const firebaseConfig = {
         apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
         authDomain: "cronicas-del-vejerete.firebaseapp.com",
         projectId: "cronicas-del-vejerete",
         storageBucket: "cronicas-del-vejerete.firebasestorage.app",
         messagingSenderId: "479303249151",
         appId: "1:479303249151:web:ba0ea9b4dbda772f0770ca",
         measurementId: "G-MV3WBGDKC5"
         };

         // Initialize Firebase
         export const app = initializeApp(firebaseConfig);
         const analytics = getAnalytics(app);
       ```
4. Go back to the **Firebase** console.
   4.1 Hit in **All Products** then navigate through **Storage**
   4.2 If ask you **Upgrade Project** to use Storage. Then hit in **Get Started**
   4.3 Check all the dialog box than applies to you and hit **Create**
   4.4 Then in the menu select **Rules** and paste the following code:
       ```
      rules_version = '2';

      // Craft rules based on data in your Firestore database
      // allow write: if firestore.get(
      //    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
      service firebase.storage {
      match /b/{bucket}/o {
         match /{allPaths=**} {
            allow read
            allow write: if 
            request.resource.size < 2 * 1024 * 1024 && // Limit size to 2MB
            request.resource.contentType.matches('image/.*'); // Allow only image types
         }
      }
      }
       ```
   4.5 Hit **Publish**
5. Go back to the file `src/app/dashboard/create-post/page.tsx` file and update the code:
   ```
   "use client";

   import { useUser } from "@clerk/nextjs";
   import { TextInput, Select, FileInput, Button, Alert } from "flowbite-react";
   import "react-quill-new/dist/quill.snow.css";
   import {
   getStorage,
   ref,
   uploadBytesResumable,
   getDownloadURL,
   } from "firebase/storage";
   import { CircularProgressbar } from "react-circular-progressbar";
   import "react-circular-progressbar/dist/styles.css";

   import dynamic from "next/dynamic";
   import { useState, ChangeEvent } from "react";
   import Image from "next/image";
   import { app } from "@/firebase";
   const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

   interface FormData {
   title?: string;
   category?: string;
   image?: string;
   content?: string;
   }

   export default function CreatePostPage() {
   const { isSignedIn, user, isLoaded } = useUser();

   const [file, setFile] = useState<File | null>(null);
   const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(
      null
   );
   const [imageUploadError, setImageUploadError] = useState<string | null>(null);
   const [formData, setFormData] = useState<FormData>({});

   const handleUploadImage = async () => {
      try {
         if (!file) {
         setImageUploadError("Please select an image to upload");
         return;
         }
         setImageUploadError(null);
         const storage = getStorage(app);
         const fileName = `${new Date().getTime()}-${file.name}`;
         const storageRef = ref(storage, fileName);
         const uploadTask = uploadBytesResumable(storageRef, file);

         uploadTask.on(
         "state_changed",
         (snapshot) => {
            const progress =
               (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImageUploadProgress(Math.round(progress));
         },
         (error) => {
            setImageUploadError("Image Upload Failed");
            console.error(error);
         },
         async () => {
            try {
               const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
               setImageUploadProgress(null);
               setImageUploadError(null);
               setFormData((prev) => ({ ...prev, image: downloadURL }));
            } catch (error) {
               console.error("Failed to retrieve image URL", error);
            }
         }
         );
      } catch (error) {
         setImageUploadError("Image Upload Failed");
         setImageUploadProgress(null);
         console.error(error);
      }
   };

   if (!isLoaded) {
      return null; // Return nothing while loading
   }

   if (isSignedIn && user?.publicMetadata?.isAdmin) {
      return (
         <div className="p-3 max-w-3xl mx-auto min-h-screen">
         <h1 className="text-center text-3xl my-7 font-semibold">
            Create a Post
         </h1>
         <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
               <TextInput
               type="text"
               placeholder="Title"
               required
               id="title"
               className="flex-1"
               onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
               }
               />
               <Select
               onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
               }
               >
               <option value="uncategorized">Select a Category</option>
               <option value="alucines">Alucines</option>
               <option value="pensamientos">Pensamientos</option>
               <option value="announcements">Announcements</option>
               <option value="draft">Draft</option>
               </Select>
            </div>
            <div className="flex gap-4 items-center justify-between border-4 border-orange-500 border-dotted p-3">
               <FileInput
               type="file"
               accept="image/*"
               onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFile(e.target.files?.[0] || null)
               }
               />
               <Button
               type="button"
               gradientDuoTone="purpleToPink"
               size="sm"
               outline
               onClick={handleUploadImage}
               disabled={!!imageUploadProgress}
               >
               {imageUploadProgress ? (
                  <div className="w-16 h-16">
                     <CircularProgressbar
                     value={imageUploadProgress}
                     text={`${imageUploadProgress || 0}%`}
                     />
                  </div>
               ) : (
                  "Upload Image"
               )}
               </Button>
            </div>

            {imageUploadError && (
               <Alert color="failure">{imageUploadError}</Alert>
            )}
            {formData.image && (
               <div className="relative w-full h-72">
               <Image
                  src={formData.image}
                  alt="Uploaded"
                  layout="fill"
                  objectFit="cover"
               />
               </div>
            )}

            <ReactQuill
               theme="snow"
               placeholder="¿Qué quieres crear hoy?"
               className="h-72 mb-12"
               onChange={(content) =>
               setFormData((prev) => ({ ...prev, content }))
               }
               // required
            />
            <Button type="submit" gradientDuoTone="purpleToPink">
               Publish
            </Button>
         </form>
         </div>
      );
   }

   return <h1>You are not authorized to view this page</h1>;
   }

   ```
6. Install package (React Circular Progresbar)[https://www.npmjs.com/package/react-circular-progressbar]
   6.1 Install `npm install --save react-circular-progressbar` 
       6.1.1 If there any issue use: `npm install react-circular-progressbar --legacy-peer-deps`
   6.2 Import:
       ```
       import { CircularProgressbar } from 'react-circular-progressbar';
       import 'react-circular-progressbar/dist/styles.css';
       ```
7. Change the configuration file `next.config/ts` file to:
   ```
   import type { NextConfig } from "next";

      const nextConfig: NextConfig = {
      /* config options here */
      reactStrictMode: true,
      images: {
         domains: ['firebasestorage.googleapis.com'], // Add this line
      },
   };


   export default nextConfig;
   ```

## Complete Upload Post Functionality
1. Since we already added an ochange event listener on the image now we're going to add to:
   1.1 Title. Around line of code 100:
       ```
       onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
       ```
   1.2 Category. Around line of code 100:
       ```
       onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
       ```
   1.2 Category. Around line of code 100:
       ```
       onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
       ```

   1.3 Content (ReactQuill). Around line of code 160:
       ```
        onChange={(value) => setFormData({ ...formData, content: value })}
       ```
   1.4 On the form around line of code 90 we are going to add and onSubmit event:
       ```
       onSubmit={handleSubmit}
       ```
2. Add the `handleSubmit` function to the `src/app/dashboard/create-post/page.tsx`
   ```
   const [publishError, setPublishError] = useState<string | null>(null); // around line 37
   import { useRouter } from "next/navigation"; // Around line of code 10
   const router = useRouter(); // initialite it around line of code 40

   // Around line of code 70:
      const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const res = await fetch("/api/post/create", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            ...formData,
            userMongoId: user?.publicMetadata.userMongoId,
         }),
         });
         const data = await res.json();
         if (!data.ok) {
         setPublishError(data.message);
         return;
         }
         if (res.ok) {
         setPublishError(null);
         router.push(`/post/${data.slug}`);
         }
      } catch (error) {
         setPublishError("Failed to publish post");
      }
   };
   ```
3. Create the model of the post at: `/src/lib/models/post.model.ts` wit the code:
   ```
   import mongoose, { Schema, Document, Model } from 'mongoose';

   // Define an interface for the post document
   interface IPost extends Document {
   userId: string;
   content: string;
   title: string;
   image?: string;
   category?: string;
   //   tags?: string[]; // Tags field is an optional array of strings
   slug: string;
   createdAt?: Date;
   updatedAt?: Date;
   }

   // Create the schema
   const postSchema = new Schema<IPost>(
   {
      userId: {
         type: String,
         required: true,
      },
      content: {
         type: String,
         required: true,
      },
      title: {
         type: String,
         required: true,
         unique: true,
      },
      image: {
         type: String,
         default:
         'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png',
      },
      category: {
         type: String,
         default: 'uncategorized',
      },
      // tags: {
      //   type: [String], // Array of strings
      //   required: false, // Tags are optional
      // },
      slug: {
         type: String,
         required: true,
         unique: true,
      },
   },
   { timestamps: true }
   );

   // Define and export the model
   const Post: Model<IPost> =
   mongoose.models.Post || mongoose.model<IPost>('Post', postSchema);

   export default Post;

   ```
4. Create the api route at: `/src/app/api/post/create/route.ts` with the following code:
   ```
   import Post from "../../../../lib/models/post.model";
   import { connect } from "../../../../lib/mongodb/mongoose";
   import { currentUser } from "@clerk/nextjs/server";

   // Define the request type
   interface RequestWithBody extends Request {
   body?: any;
   }

   export const createPost = async (req: RequestWithBody) => {
   const user = await currentUser(); // Fetch current user
   let data;

   try {
      data = await req.json(); // Parse request body
   } catch (err) {
      return new Response("Invalid request body", { status: 400 });
   }

   try {
      await connect(); // Ensure database connection

      // Authorization check
      if (
         !user || // Ensure the user exists
         user.publicMetadata.userMongoId !== data.userMongoId || // Check userMongoId matches
         user.publicMetadata.isAdmin !== true // Ensure the user is an admin
      ) {
         return new Response("Unauthorized", { status: 401 });
      }

      // Generate a slug from the title
      const slug = data.title
         .split("") // Split the title into characters
         .join("-") // Join back without spaces
         .toLowerCase() // Convert to lowercase
         .replace(/[^a-zA-Z0-9-]/g, ""); // Remove non-alphanumeric characters

      // Create a new post
      const newPost = new Post({
         userId: user.publicMetadata.userMongoId,
         content: data.content,
         title: data.title,
         image: data.image,
         category: data.category,
         slug,
      });

      // Save the post to the database
      await newPost.save();

      // Respond with the created post
      return new Response(JSON.stringify({ newPost }), { status: 200 });
   } catch (error) {
      console.error("Error Creating the Post:", error);
      return new Response("Error Creating the Post", { status: 500 });
   }
   };

   ```
##  Complete Post Page Functionality.
1. Create the folder `/src/app/post/[slug]/page.tsx` and create a RFC component and check functionality:
   ```
   import CallToAction from "@/app/components/CallToAction";
   import { Button } from "flowbite-react";
   import Image from "next/image";
   import Link from "next/link";
   import React from "react";

   interface Post {
   title: string;
   category: string;
   image: string;
   content: string;
   createdAt: string;
   }

   interface PostPageProps {
   params: {
      slug: string;
   };
   }

   // Use async destructuring for `params`
   const PostPage = async ({ params: { slug } }: PostPageProps) => {
   let post: Post | null = null;

   try {
      const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/get`, {
         method: "POST",
         body: JSON.stringify({ slug }), // Use the destructured slug here
         cache: "no-store",
      });

      if (!result.ok) {
         throw new Error("Failed to fetch post");
      }

      const data = await result.json();
      post = data.posts[0];
   } catch (error) {
      console.error("Error fetching post:", error);
      post = {
         title: "Failed to load post",
         category: "",
         image: "",
         content: "",
         createdAt: "",
      };
   }

   if (!post || post.title === "Failed to load post") {
      return (
         <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
         <h2 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
            Post not found
         </h2>
         </main>
      );
   }

   return (
      <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
         <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
         {post.title}
         </h1>
         <Link
         href={`/search?category=${post.category}`}
         className="self-center mt-5"
         >
         <Button color="gray" pill size="xs">
            {post.category}
         </Button>
         </Link>
         <Image
         src={post.image}
         alt={post.title}
         width={800} // Set the width in pixels
         height={600} // Set the height in pixels
         className="mt-10 p-3 max-h-[600px] w-full object-cover"
         />
         <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
         <span>{new Date(post.createdAt).toLocaleDateString()}</span>
         <span className="italic">
            {(post.content.length / 1000).toFixed(0)} mins read
         </span>
         </div>
         <div
         className="p-3 max-w-2xl mx-auto w-full post-content"
         dangerouslySetInnerHTML={{ __html: post.content }}
         ></div>
         <div className="max-w-4xl mx-auto w-full">
         <CallToAction />
         </div>
      </main>
   );
   };

   export default PostPage;
   ```
2. Now inside `/src/app/components` create a fule called **CallToAction.tsx** and for now create a RFC:
   ```
   import { Button } from "flowbite-react";
   import Image from "next/image";

   export default function callToAction() {
   return (
      <div className="flex flex-col sm:flex-row p-3 border border-orange-400 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
         <div className="flex-1 justify-center items-center flex flex-col">
         <h2 className="text-2xl>">¿Quieres aprender Microsoft Excel?</h2>
         <p className="text-gray-500 my-2">
            ¡No pierdas más tiempo! Aprende a manejar Excel de manera eficiente y
            profesional.
         </p>
         <Button
            gradientDuoTone="purpleToPink"
            className="rounded-tl-xl rounded-bl-none"
         >
            <a
               href="https://www.ExcelSolutionsV.com"
               target="_blank"
               rel="noopener noreferrer"
            >
               Blog Excel SolutionsV
            </a>
         </Button>
         </div>
         <div className="p-7 flex-1">
         <Image
            src="https://upload.wikimedia.org/wikipedia/commons/4/40/Microsoft-excel.png"
            alt="Excel Logo"
            width={800} // Set the width in pixels
            height={600} // Set the height in pixels
         />
         </div>
      </div>
   );
   }

   ```
3. On `.env.local` add `NEXT_PUBLIC_URL=http://localhost:3000`
4. Now in `/scr/app/api/post/get/route` and add the following code:
   ```
   import Post from '../../../../lib/models/post.model';
   import { connect } from '@/lib/mongodb/mongoose';

   export const POST = async (req: Request): Promise<Response> => {
   // Connect to the database
   await connect();

   try {
      // Parse request data
      const data: {
         startIndex?: string;
         limit?: string;
         order?: 'asc' | 'desc';
         userId?: string;
         category?: string;
         slug?: string;
         postId?: string;
         searchTerm?: string;
      } = await req.json();

      // Parse and set default values for pagination and sorting
      const startIndex = parseInt(data.startIndex || '0', 10);
      const limit = parseInt(data.limit || '9', 10);
      const sortDirection = data.order === 'asc' ? 1 : -1;

      // Query posts from the database
      const posts = await Post.find({
         ...(data.userId && { userId: data.userId }),
         ...(data.category &&
         data.category !== 'null' &&
         data.category !== 'undefined' && { category: data.category }),
         ...(data.slug && { slug: data.slug }),
         ...(data.postId && { _id: data.postId }),
         ...(data.searchTerm && {
         $or: [
            { title: { $regex: data.searchTerm, $options: 'i' } },
            { content: { $regex: data.searchTerm, $options: 'i' } },
         ],
         }),
      })
         .sort({ updatedAt: sortDirection })
         .skip(startIndex)
         .limit(limit);

      // Get total post counts
      const totalPosts = await Post.countDocuments();

      // Calculate posts from the last month
      const now = new Date();
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

      const lastMonthPosts = await Post.countDocuments({
         createdAt: { $gte: oneMonthAgo },
      });

      // Return the response with the data
      return new Response(
         JSON.stringify({
         posts,
         totalPosts,
         lastMonthPosts,
         }),
         { status: 200 }
      );
   } catch (error) {
      console.error('Error fetching posts:', error);

      // Return error response
      return new Response(
         JSON.stringify({
         error: 'An error occurred while fetching posts.',
         }),
         { status: 500 }
      );
   }
   };
   ```

## Add Recent Article Section to the Post Page.
1. Create the componet <RecentPost> at `/src/app/components/RecentPost.tsx`
   1.1 Addt the following code:
   ```
   import PostCard from "./PostCard";

   export default async function RecentPosts(limit) {
   let posts = null;
   try {
      const result = await fetch(process.env.NEXT_PUBLIC_URL + "/api/post/get", {
         method: "POST",
         body: JSON.stringify({ limit: limit, order: "desc" }),
         cache: "no-store",
      });
      const data = await result.json();
      posts = data.posts;
   } catch (error) {
      console.log("Failed to fetch recent posts", error);
   }
   return (
      <div className="flex flex-col justify-center items-center mb-5">
         <h1 className="text-xl mt-5">Últimas publicaciones</h1>
         <div className="flex flex-wrap gap-5 mt-5 justify-center">
         {posts && posts.map((post) => <PostCard key={post._id} post={post} />)}
         </div>
      </div>
   );
   }

   ```
2. Create the PostCard component at `/src/app/components/PostCard.tsx`:
   ```
   import Image from "next/image";
   import Link from "next/link";

   interface Post {
   slug: string;
   image: string;
   title: string;
   category: string;
   }

   interface PostCardProps {
   post: Post;
   }

   const PostCard: React.FC<PostCardProps> = ({ post }) => {
   return (
      <div className="group relative w-full border border-orange-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[430px] transition-all duration-300 ease-in-out">
         <Link href={`/posts/${post.slug}`}>
         <Image
            src={post.image}
            alt={post.title}
            width={200} // Keep numeric values for Next.js
            height={260}
            className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 ease-in-out z-20"
         />
         </Link>
         <div className="p-3 flex flex-col gap-2">
         <p className="text-lg font-semibold line-clamp-2">{post.title}</p>
         <span className="italic text-sm">{post.category}</span>
         <Link
            href={`/post/${post.slug}`}
            className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-orange-500 bg-orange-500 text-white hover:text-gray-400 transition-all duration-300 ease-in-out text-center py-2 rounded-md !rounded-tl-none m-2"
         >
            Leer
         </Link>
         </div>
      </div>
   );
   };

   export default PostCard;
   ```

## Complete the home page
1. Go to `/src/app/page.tsx` and add the following code:
   ```
   import Link from "next/link";
   import CallToAction from "./components/CallToAction";
   import RecentPost from "./components/RecentPosts";

   export default async function Home(): Promise<JSX.Element> {
   let posts: any = null;

   try {
      const result = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/post/get`, {
         method: "POST",
         headers: {
         "Content-Type": "application/json", // Ensuring headers are correct
         },
         body: JSON.stringify({ limit: 9, order: "desc" }),
         cache: "no-store",
      });

      if (!result.ok) {
         throw new Error(`Failed to fetch posts: ${result.statusText}`);
      }

      const data = await result.json();
      posts = data.posts;
   } catch (error) {
      console.error("Error getting posts:", error);
   }

   return (
      <div className="flex flex-col justify-center items-center">
         <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
         <h1 className="text-3xl text-purple-500 font-bold lg:text-6xl">
            Bienvenidos al Blog de Cro{"\u0301"}nicas del Vejerete{" "}
            {/* can be used &oacute; too */}
         </h1>
         <p className="text-gray-500 text-sm sm:text-base">
            Blog sobre diferentes temas desde un punto de vista personal
         </p>
         <Link
            href="/search"
            className="text-xs sm:text-sm text-orange-500 font-bold hover:text-purple-600"
         >
            Ver todas las publicaciones
         </Link>
         </div>
         <div className="p-3 bg-slate-100 dark:bg-slate-700">
         <CallToAction />
         </div>
         <div className="p-3 flex flex-col gap-8 py-7">
         <RecentPost limit={9} />
         <Link
            href="/search?category=null"
            className="text-lg text-orange-500 font-bold hover:text-purple-600 text-center"
         >
            Ver todas las publicaciones
         </Link>
         </div>
      </div>
   );
   }
   ```

## Complete the Search Page.
1. Go back to the <Header> component at `src/app/components/Header.tsx`
2. Around line 10 add: `import { useRouter, useSearchParams } from "next/navigation";`
3. Around line of code 15 add:
   ```
   const router = useRouter();
   const [searchTerm, setSearchTerm] = useState("");
   const searchParams = useSearchParams();
   ```
4. Around line of code 20 add:
   ```
   useEffect(() => {
      const urlParams = new URLSearchParams(searchParams);
      const searchTermFromUrl = urlParams.get("searchTerm");
      if (searchTermFromUrl) {
         setSearchTerm(searchTermFromUrl);
      }
   }, [searchParams]);
   ```
5. Around line of code 55 add:
   ```
   value={searchTerm}
   onChange={(e) => setSearchTerm(e.target.value)}
   ```
6. Around line of code 50 inside the <form> add: `handleSubmit` 
7. Around line of code 20 add the **handleSubmit** function:
   ```
     const handleSubmit = (e) => {
      e.preventDefault();
      const urlParams = new URLSearchParams(searchParams);
      urlParams.set("searchTerm", searchTerm);
      const searchQuery = urlParams.toString();
      router.push(`/search?${searchQuery}`);
   };
   ```
8. Create the folder `/src/app/search/page.tsx` and add RFC. then add the following code:
   ```
   "use client";

   import { Button, Select, TextInput } from "flowbite-react";
   import { useEffect, useState, ChangeEvent, FormEvent } from "react";
   import { useRouter, useSearchParams } from "next/navigation";
   import PostCard from "../components/PostCard";

   // Define the shape of the sidebar state
   interface SideBarData {
   searchTerm: string;
   sort: string;
   category: string;
   }

   // Define the shape of a Post object, but allow additional properties
   interface Post {
   id: string; // Mandatory field
   [key: string]: any; // Allow additional properties without explicitly typing them
   }

   export default function Search() {
   const [sideBarData, setSideBarData] = useState<SideBarData>({
      searchTerm: "",
      sort: "desc",
      category: "uncategorized",
   });

   const [posts, setPosts] = useState<Post[]>([]);
   const [loading, setLoading] = useState<boolean>(false);
   const [showMore, setShowMore] = useState<boolean>(false);

   const searchParams = useSearchParams();
   const router = useRouter();

   useEffect(() => {
      const urlParams = new URLSearchParams(searchParams.toString());
      const searchTermFromUrl = urlParams.get("searchTerm");
      const sortFromUrl = urlParams.get("sort");
      const categoryFromUrl = urlParams.get("category");

      if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
         setSideBarData((prev) => ({
         ...prev,
         searchTerm: searchTermFromUrl || "",
         sort: sortFromUrl || "desc",
         category: categoryFromUrl || "uncategorized",
         }));
      }

      const fetchPosts = async () => {
         setLoading(true);

         try {
         const res = await fetch("/api/post/get", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               limit: 9,
               order: sortFromUrl || "desc",
               category: categoryFromUrl || "uncategorized",
               searchTerm: searchTermFromUrl || "",
            }),
         });

         if (!res.ok) throw new Error("Failed to fetch posts");

         const data = await res.json();
         setPosts(data.posts);
         setShowMore(data.posts.length === 9);
         } catch (error) {
         console.error(error);
         } finally {
         setLoading(false);
         }
      };

      fetchPosts();
   }, [searchParams]);

   const handleChange = (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
   ) => {
      const { id, value } = e.target;

      if (id === "searchTerm") {
         setSideBarData((prev) => ({ ...prev, searchTerm: value }));
      } else if (id === "sort") {
         setSideBarData((prev) => ({ ...prev, sort: value || "desc" }));
      } else if (id === "category") {
         setSideBarData((prev) => ({
         ...prev,
         category: value || "uncategorized",
         }));
      }
   };

   const handleSubmit = (e: FormEvent) => {
      e.preventDefault();

      const urlParams = new URLSearchParams(searchParams.toString());
      urlParams.set("searchTerm", sideBarData.searchTerm || "");
      urlParams.set("sort", sideBarData.sort);
      urlParams.set("category", sideBarData.category);

      router.push(`/search?${urlParams.toString()}`);
   };

   const handleShowMore = async () => {
      const numberOfPosts = posts.length;
      const startIndex = numberOfPosts;

      try {
         const res = await fetch("/api/post/get", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            limit: 9,
            order: sideBarData.sort,
            category: sideBarData.category,
            searchTerm: sideBarData.searchTerm,
            startIndex,
         }),
         });

         if (!res.ok) throw new Error("Failed to fetch more posts");

         const data = await res.json();
         setPosts((prev) => [...prev, ...data.posts]);
         setShowMore(data.posts.length === 9);
      } catch (error) {
         console.error(error);
      }
   };

   return (
      <div className="flex flex-col md:flex-row">
         <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
         <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
            <div className="flex items-center gap-2">
               <label className="whitespace-nowrap font-semibold">
               Search Term:
               </label>
               <TextInput
               placeholder="Search..."
               id="searchTerm"
               type="text"
               value={sideBarData.searchTerm}
               onChange={handleChange}
               />
            </div>
            <div className="flex items-center gap-2">
               <label className="font-semibold">Sort:</label>
               <Select onChange={handleChange} id="sort">
               <option value="desc">Latest</option>
               <option value="asc">Oldest</option>
               </Select>
            </div>
            <div className="flex items-center gap-2">
               <label className="font-semibold">Category:</label>
               <Select onChange={handleChange} id="category">
               <option value="uncategorized">Uncategorized</option>
               <option value="alucines">Alucines</option>
               <option value="pensamientos">Pensamientos</option>
               <option value="announcements">Announcements</option>
               <option value="draft">Draft</option>
               </Select>
            </div>
            <Button type="submit" gradientDuoTone="purpleToBlue" outline>
               Apply Filters
            </Button>
         </form>
         </div>
         <div className="w-full">
         <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
            Posts Results
         </h1>
         <div className="p-7 flex flex-wrap gap-4">
            {!loading && posts.length === 0 && (
               <p className="text-xl text-gray-500">No Post Have been Found</p>
            )}
            {loading && <p className="text-xl text-gray-500">Loading...</p>}
            {!loading &&
               posts &&
               posts.map((post) => <PostCard key={post.id} post={post} />)}
            {showMore && (
               <button
               onClick={handleShowMore}
               className="text-orange-500 text-lg hover:text-purple-600 p-7 w-full"
               >
               Show More
               </button>
            )}
         </div>
         </div>
      </div>
   );
   }
   ```

## Add the Remaining Pages like About, Projects, and the Footer.
### Adding Footer.
1. Create on `src/app/components/Footer.tsx` and add the RFC.
2. Then Go to `src/app/layout.tsx` and add the Footer component to the layout after the {children}.
   around line of code 40. If not auto import `import Footer from "./components/Footer";`
3. Go back to footer and add:
   ```
   "use client";

   import React from "react";
   import { Footer } from "flowbite-react";
   import Link from "next/link";
   import {
   BsFacebook,
   BsInstagram,
   BsTwitter,
   BsGithub,
   BsTiktok,
   BsDribbble,
   } from "react-icons/bs";

   // Component
   const FooterComp: React.FC = () => {
   return (
      <Footer container className="border border-t-8 border-orange-500">
         <div className="w-full max-w-7xl mx-auto">
         <div className="grid w-full justify-between sm:flex md:grid-cols-1">
            <div className="mt-5">
               <Link
               href="/"
               className="self-center whitespace-nowrap text-lg sm-text-xl font-semibold dark:text-white"
               >
               <span className="px-2 py-1 bg-gradient-to-r from-purple-600 via-yellow-300 to-pink-500 rounded-lg text-white">
                  Cro{"\u0301"}nicas del Vejerete
               </span>
               Blog
               </Link>
            </div>
            <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
               <div>
               <Footer.Title title="Acerca" />
               <Footer.LinkGroup col>
                  <Footer.Link
                     href="https://www.excelsolutionsv.com/"
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     Excel SolutionsV
                  </Footer.Link>
                  <Footer.Link
                     href="/about"
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     Cro{"\u0301"}nicas.
                  </Footer.Link>
                  <Footer.Link href="/contact">Contacto</Footer.Link>
               </Footer.LinkGroup>
               </div>
               <div>
               <Footer.Title title="Redes Sociales" />
               <Footer.LinkGroup col>
                  <Footer.Link
                     href="https://github.com/svei00/"
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     GitHub
                  </Footer.Link>
                  <Footer.Link
                     href="https://www.linkedin.com/in/ivan-e-villanueva-26253157/"
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     Linkedin
                  </Footer.Link>
                  <Footer.Link
                     href="https://www.youtube.com/svei00"
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     YouTube
                  </Footer.Link>
               </Footer.LinkGroup>
               </div>
               <div>
               <Footer.Title title="Legal" />
               <Footer.LinkGroup col>
                  <Footer.Link href="/privacy">Privacidad</Footer.Link>
                  <Footer.Link href="/terms">
                     Términos y Condiciones
                  </Footer.Link>
               </Footer.LinkGroup>
               </div>
            </div>
         </div>
         <Footer.Divider />
         <div className="w-full sm:flex sm:items-center sm:justify-between">
            <Footer.Copyright
               href="#"
               by="Ivan E. Villanueva"
               year={new Date().getFullYear()}
            />
            <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
               <Footer.Icon href="#" icon={BsFacebook} />
               <Footer.Icon href="#" icon={BsInstagram} />
               <Footer.Icon href="https://github.com/svei00/" icon={BsGithub} />
               <Footer.Icon href="#" icon={BsTwitter} />
               <Footer.Icon href="#" icon={BsTiktok} />
               <Footer.Icon href="#" icon={BsDribbble} />
            </div>
         </div>
         </div>
      </Footer>
   );
   };

   export default FooterComp;
   ```
### About Page.
1. Add `src/app/about/page`:
   ```
   export default function About() {
   return (
      <div className="min-h-screen flex items-center justify-center">
         <div className="max-w-2xl mx-auto p-3 tex-center">
         <div>
            <h1 className="text-3xl font font-semibold text-center my-7">
               Acerca de Cro{"\u0301"}nicas del Vejerete Blog
            </h1>
            <div className="text-md text-gray-500 flex flex-col gap-6">
               <p>Uno</p>
               <p>Dos</p>
               <p>Tres</p>
            </div>
         </div>
         </div>
      </div>
   );
   }
   ```

### Projects Page.
1. Add `src/app/projects/page`:
   ```
   import CallToAction from "../components/CallToAction";

   export default function Projects() {
   return (
      <div className="min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3">
         <h1 className="text-3xl font-semibold ">Proyectos</h1>
         <p className="text-md text-gray-500">
         ¡Libera tu potencial con Excel SolutionsV! Sumérgete en proyectos
         interesantes que te ayudarán a dominar Microsoft Excel mientras
         resuelves problemas del mundo real. Desde consejos básicos hasta
         técnicas avanzadas, hacemos que aprender Excel sea interactivo, práctico
         y divertido. Transforma tus habilidades y desbloquea un mundo de
         posibilidades con cada fórmula, gráfica y macroa.
         </p>
         <CallToAction />
      </div>
   );
   }
   ```

## Complete the Profile Page in the Dashboard.
1. Go back to `/src/app/components/Header.tsx`around line 90 of code before the closing tag of <SignedIn>:
   `userProfileUrl="/dashboard?tab=profile"`
2. Go to `/src/app/dashboard/page.tsx` and add the following code:
   ```
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
   const [tab, setTab] = useState([]);

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
   ```
3. Create a RFC page on `/src/app/components/DashSidebar.tsx` and add the following code:
   ```
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

   interface PublicMetadata {
   isAdmin?: boolean;
   }

   export default function DashSideBar() {
   const [tab, setTab] = useState<string>(""); // Explicit type for useState
   const searchParams = useSearchParams();
   const { user, isSignedIn } = useUser<{ publicMetadata: PublicMetadata }>();

   useEffect(() => {
      const tabFromUrl = searchParams.get("tab");
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
            {user?.publicMetadata?.isAdmin && (
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
            <Link href="/dashboard?tab=profile">
               <Sidebar.Item
               active={tab === "profile"}
               icon={HiUser}
               label={user?.publicMetadata?.isAdmin ? "Admin" : "User"}
               labelColor="dark"
               as="div"
               >
               Profile
               </Sidebar.Item>
            </Link>
            {user?.publicMetadata?.isAdmin && (
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
            {user?.publicMetadata?.isAdmin && (
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
            <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer">
               <SignOutButton />
            </Sidebar.Item>
         </Sidebar.ItemGroup>
         </Sidebar.Items>
      </Sidebar>
   );
   }
   ```
4. Create another RFC page on `/src/app/components/DashProfile.tsx` and add the following code:
   ```
   import { UserProfile } from "@clerk/nextjs";
   import { dark, neobrutalism } from "@clerk/themes";
   import { useTheme } from "next-themes";

   export default function DashProfile() {
   const theme = useTheme();

   return (
      <div className="flex justify-center items-center w-full">
         <UserProfile
         appearance={{
            baseTheme: theme.theme === "dark" ? dark : neobrutalism,
         }}
         />
      </div>
   );
   }
   ;
   ```
5. Next create one more RFC page on `src/app/components/DashPost.tsx`
6. Create another RFC page on `src/app/components/DashUsers.tsx`
7. Finnally one more RFC on `src/app/components/DashboardComp.tsx`

## Show the User Posts in the Dashboard.
1. Go to the file `src/app/components/DashPost.tsx` and add the following code:
   ```
   "use client";

   import { Button, Modal, ModalBody, Table } from "flowbite-react";
   import { useEffect, useState } from "react";
   import { useUser } from "@clerk/nextjs";
   import Link from "next/link";
   import { HiOutlineExclamationCircle } from "react-icons/hi";
   import Image from "next/image";

   interface Post {
   _id: string;
   title: string;
   slug: string;
   image: string;
   category: string;
   updatedAt: string;
   }

   export default function DashPost() {
   const { user } = useUser();
   console.log("User", user);

   const [userPost, setUserPost] = useState<Post[]>([]);
   const [showModal, setShowModal] = useState(false);
   const [postIdToDelete, setPostIdToDelete] = useState("");

   useEffect(() => {
      const fetchPost = async () => {
         try {
         const res = await fetch("/api/post/get", {
            method: "POST",
            headers: {
               "content-type": "application/json",
            },
            body: JSON.stringify({
               userId: user?.publicMetadata?.userMongoId,
            }),
         });
         if (!res.ok) throw new Error("Failed to fetch posts");

         const data = await res.json();
         setUserPost(data.posts);
         } catch (error) {
         console.error("Error fetching posts:", error);
         }
      };
      if (user?.publicMetadata?.isAdmin) {
         fetchPost();
      }
   }, [user?.publicMetadata?.isAdmin, user?.publicMetadata?.userMongoId]);

   const handleDeletePost = async () => {
      setShowModal(false);
      try {
         const res = await fetch("/api/post/delete", {
         method: "DELETE",
         headers: {
            "content-type": "application/json",
         },
         body: JSON.stringify({
            postId: postIdToDelete,
            userId: user?.publicMetadata?.userMongoId,
         }),
         });

         if (!res.ok) {
         const data = await res.json();
         throw new Error(data.message);
         }

         setUserPost((prevPosts) =>
         prevPosts.filter((post) => post._id !== postIdToDelete)
         );
         setPostIdToDelete("");
      } catch (error) {
         console.error("Error deleting post:", error);
      }
   };

   if (!user?.publicMetadata?.isAdmin) {
      return (
         <div className="flex flex-col items-center justify-center h-full w-full py-7">
         <h1 className="text-2xl font-semibold">You are not an Admin!!</h1>
         </div>
      );
   }

   return (
      <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
         {userPost.length > 0 ? (
         <Table hoverable className="shadow-md">
            <Table.Head>
               <Table.HeadCell>Date Updated</Table.HeadCell>
               <Table.HeadCell>Post Image</Table.HeadCell>
               <Table.HeadCell>Post Title</Table.HeadCell>
               <Table.HeadCell>Category</Table.HeadCell>
               <Table.HeadCell>Delete</Table.HeadCell>
               <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
               {userPost.map((post) => (
               <Table.Row
                  key={post._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
               >
                  <Table.Cell>
                     {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                     <Link href={`/post/${post.slug}`}>
                     <Image
                        src={post.image}
                        alt={post.title}
                        width={80} // ✅ Replace with actual dimensions
                        height={80}
                        className="object-cover bg-gray-500"
                        priority // ✅ Improves LCP
                     />
                     </Link>
                  </Table.Cell>
                  <Table.Cell>
                     <Link
                     className="font-medium text-gray-900 dark:text-white"
                     href={`/post/${post.slug}`}
                     >
                     {post.title}
                     </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                     <span
                     className="font-medium text-red-500 hover:font-bold cursor-pointer"
                     onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                     }}
                     >
                     Delete
                     </span>
                  </Table.Cell>
                  <Table.Cell>
                     <Link
                     className="text-green-400 hover:font-bold text-purple-600"
                     href={`/dashboard/update-post/${post._id}`}
                     >
                     Edit
                     </Link>
                  </Table.Cell>
               </Table.Row>
               ))}
            </Table.Body>
         </Table>
         ) : (
         <p>You have no posts yet!!</p>
         )}

         <Modal show={showModal} onClose={() => setShowModal(false)} popup>
         <Modal.Header />
         <Modal.Body>
            <div className="text-center">
               <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
               <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
               Are you sure you want to delete this Post?
               </h3>
               <div className="flex justify-center gap-4">
               <Button color="failure" onClick={handleDeletePost}>
                  Yes, I&apos;m sure.
               </Button>
               <Button color="gray" onClick={() => setShowModal(false)}>
                  No, Cancel.
               </Button>
               </div>
            </div>
         </Modal.Body>
         </Modal>
      </div>
   );
   }
   ```
2. Create the delete route at `src/app/api/post/delete/route.ts` with the following code:
   ```
   import Post from "../../../../lib/models/post.model";
   import { connect } from "../../../../lib/mongodb/mongoose";
   import { currentUser } from "@clerk/nextjs/server";

   // Define types for user metadata and request payload
   interface UserMetadata {
   isAdmin: boolean;
   userMongoId: string;
   }

   interface User {
   publicMetadata: UserMetadata;
   }

   interface RequestData {
   userId: string;
   postId: string;
   }

   export const DELETE = async (req: Request): Promise<Response> => {
   const user: User | null = await currentUser();

   try {
      await connect();

      // Parse the request body
      const data: RequestData = await req.json();

      // Check authorization
      if (
         !user?.publicMetadata.isAdmin ||
         user.publicMetadata.userMongoId !== data.userId
      ) {
         return new Response("Unauthorized", { status: 401 });
      }

      // Delete the post
      await Post.findByIdAndDelete(data.postId);

      return new Response("Post has been Deleted", { status: 200 });
   } catch (error) {
      console.error("Error Deleting Post", error);
      return new Response("Error Deleting Post", { status: 500 });
   }
   };
   ```
3. Create the Update Page on `/src/app/dashboard/update-post/[id]/page.ts`:
   ```
   "use client";

   import { useUser } from "@clerk/nextjs";
   import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
   import dynamic from "next/dynamic";
   import { useEffect, useState } from "react";
   import { useRouter, usePathname } from "next/navigation";
   import { CircularProgressbar } from "react-circular-progressbar";
   import "react-circular-progressbar/dist/styles.css";
   import "react-quill-new/dist/quill.snow.css";

   import {
   getDownloadURL,
   getStorage,
   ref,
   uploadBytesResumable,
   } from "firebase/storage";
   import { app } from "../../../../firebase";

   // React Quill import with dynamic loading for SSR
   const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

   // Define type for formData
   interface FormData {
   title?: string;
   category?: string;
   content?: string;
   image?: string;
   }

   const UpdatePost: React.FC = () => {
   const { isSignedIn, user, isLoaded } = useUser();
   const [file, setFile] = useState<File | null>(null);
   const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(
      null
   );
   const [imageUploadError, setImageUploadError] = useState<string | null>(null);
   const [formData, setFormData] = useState<FormData>({});
   const [publishError, setPublishError] = useState<string | null>(null);
   const router = useRouter();
   const pathname = usePathname();
   const postId = pathname.split("/").pop();

   useEffect(() => {
      const fetchPost = async () => {
         try {
         const res = await fetch("/api/post/get", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ postId }),
         });

         const data = await res.json();
         if (res.ok) {
            setFormData(data.posts[0]);
         }
         } catch (error) {
         console.error("Error fetching post:", (error as Error).message);
         }
      };

      if (isSignedIn && user?.publicMetadata?.isAdmin) {
         fetchPost();
      }
   }, [postId, user?.publicMetadata?.isAdmin, isSignedIn]);

   const handleUploadImage = async () => {
      try {
         if (!file) {
         setImageUploadError("Please select an image");
         return;
         }

         setImageUploadError(null);
         const storage = getStorage(app);
         const fileName = `${new Date().getTime()}-${file.name}`;
         const storageRef = ref(storage, fileName);
         const uploadTask = uploadBytesResumable(storageRef, file);

         uploadTask.on(
         "state_changed",
         (snapshot) => {
            const progress =
               (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImageUploadProgress(Math.round(progress));
         },
         (error) => {
            setImageUploadError("Image upload failed");
            setImageUploadProgress(null);
         },
         async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData((prev) => ({ ...prev, image: downloadURL }));
         }
         );
      } catch (error) {
         setImageUploadError("Image upload failed");
         setImageUploadProgress(null);
         console.error("Error uploading image:", (error as Error).message);
      }
   };

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
         const res = await fetch("/api/post/update", {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            ...formData,
            userMongoId: user?.publicMetadata?.userMongoId,
            postId,
         }),
         });

         const data = await res.json();
         if (!res.ok) {
         setPublishError(data.message || "Failed to update post");
         return;
         }

         setPublishError(null);
         router.push(`/post/${data.slug}`);
      } catch (error) {
         setPublishError("Something went wrong");
         console.error("Error updating post:", (error as Error).message);
      }
   };

   if (!isLoaded) {
      return null;
   }

   if (isSignedIn && user?.publicMetadata?.isAdmin) {
      return (
         <div className="p-3 max-w-3xl mx-auto min-h-screen">
         <h1 className="text-center text-3xl my-7 font-semibold">
            Update a post
         </h1>
         <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
               <TextInput
               type="text"
               placeholder="Title"
               required
               id="title"
               defaultValue={formData.title}
               className="flex-1"
               onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
               }
               />
               <Select
               onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
               }
               value={formData.category}
               >
                <option value="uncategorized">Select a Category</option>
                <option value="alucines">Alucines</option>
                <option value="pensamientos">Pensamientos</option>
                <option value="announcements">Announcements</option>
                <option value="draft">Draft</option>
               </Select>
            </div>
            <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
               <FileInput
               type="file"
               accept="image/*"
               onChange={(e) => setFile(e.target.files?.[0] || null)}
               />
               <Button
               type="button"
               gradientDuoTone="purpleToBlue"
               size="sm"
               outline
               onClick={handleUploadImage}
               disabled={!!imageUploadProgress}
               >
               {imageUploadProgress ? (
                  <div className="w-16 h-16">
                     <CircularProgressbar
                     value={imageUploadProgress}
                     text={`${imageUploadProgress || 0}%`}
                     />
                  </div>
               ) : (
                  "Upload Image"
               )}
               </Button>
            </div>
            {imageUploadError && (
               <Alert color="failure">{imageUploadError}</Alert>
            )}
            {formData.image && (
               <img
               src={formData.image}
               alt="upload"
               className="w-full h-72 object-cover"
               />
            )}
            <ReactQuill
               theme="snow"
               placeholder="Write something..."
               className="h-72 mb-12"
               required
               value={formData.content}
               onChange={(value) =>
               setFormData((prev) => ({ ...prev, content: value }))
               }
            />
            <Button type="submit" gradientDuoTone="purpleToPink">
               Update
            </Button>
            {publishError && (
               <Alert className="mt-5" color="failure">
               {publishError}
               </Alert>
            )}
         </form>
         </div>
      );
   }

   return (
      <h1 className="text-center text-3xl my-7 font-semibold min-h-screen">
         You need to be an admin to update a post
      </h1>
   );
   };

   export default UpdatePost;
   ```
4. Create the update post route at `/src/app/api/post/update/route.ts`:
   ```
   import Post from "../../../../lib/models/post.model";
   import { connect } from "../../../../lib/mongodb/mongoose";
   import { currentUser } from "@clerk/nextjs/server";
   import { NextRequest, NextResponse } from "next/server";

   export const PUT = async (req: NextRequest): Promise<NextResponse> => {
      const user = await currentUser();

      try {
         await connect();
         const data = await req.json();

         if (
               !user ||
               user.publicMetadata.userMongoId !== data.userMongoId ||
               user.publicMetadata.isAdmin !== true
         ) {
               return new NextResponse("Unauthorized", { status: 401 });
         }

         const newPost = await Post.findByIdAndUpdate(
               data.postId,
               {
                  $set: {
                     title: data.title,
                     content: data.content,
                     category: data.category,
                     image: data.image,
                  },
               },
               { new: true }
         );

         return new NextResponse(JSON.stringify(newPost), {
               status: 200,
               headers: { "Content-Type": "application/json" },
         });
      } catch (error) {
         console.error("Error Updating Post", error);
         return new NextResponse("Error Updating Post", {
               status: 500,
         });
      }
   };
   ```

## Show the Users Inside the Dashboard.
1. Go to `src/app/components/DashUsers.tsx` and paste the following code:
   ```
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
   ```
2. Create the route to get users at `/src/app/api/user/get/route.ts`:
   ```
   import User from "../../../../lib/models/user.model";
   import { connect } from "../../../../lib/mongodb/mongoose";
   import { currentUser } from "@clerk/nextjs/server";

   export const POST = async (req: Request): Promise<Response> => {
      const user = await currentUser();

      try {
         await connect();
         const data = await req.json() as {
               startIndex?: number;
               limit?: number;
               sort?: "asc" | "desc";
         };

         if (!user?.publicMetadata?.isAdmin) {
               return new Response("Unauthorized", { status: 401 });
         }

         const startIndex: number = data.startIndex ? parseInt(String(data.startIndex), 10) : 0;
         const limit: number = data.limit ? parseInt(String(data.limit), 10) : 9;
         const sortDirection: 1 | -1 = data.sort === "asc" ? 1 : -1;

         const users = await User.find()
               .sort({ createdAt: sortDirection })
               .skip(startIndex)
               .limit(limit);

         const totalUsers: number = await User.countDocuments();

         const now = new Date();
         const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

         const lastMonthUsers: number = await User.countDocuments({
               createdAt: { $gte: oneMonthAgo },
         });

         return new Response(
               JSON.stringify({ users, totalUsers, lastMonthUsers }),
               { status: 200 }
         );

      } catch (error) {
         console.error("Error Getting the users:", error);
         return new Response("Error Getting the users", { status: 500 });
      }
   };
   ```

## Complete the App Overview Inside the Admin Dashboard.
1. Go to the file `/src/app/components/DashboardComp.tsx` and paste the following code:
   ```
   "use client";

   import { useEffect, useState } from "react";
   import {
   HiArrowNarrowUp,
   HiDocumentText,
   HiOutlineUserGroup,
   } from "react-icons/hi";
   import { Button, Table } from "flowbite-react";
   import { useUser } from "@clerk/nextjs";
   import Link from "next/link";

   // Define types for Users and Posts
   interface UserType {
   _id: string;
   username: string;
   profilePicture: string;
   }

   interface PostType {
   _id: string;
   title: string;
   category: string;
   image: string;
   }

   export default function DashboardComp() {
   const [users, setUsers] = useState<UserType[]>([]);
   const [posts, setPosts] = useState<PostType[]>([]);
   const [totalUsers, setTotalUsers] = useState<number>(0);
   const [totalPosts, setTotalPosts] = useState<number>(0);
   const [lastMonthUsers, setLastMonthUsers] = useState<number>(0);
   const [lastMonthPosts, setLastMonthPosts] = useState<number>(0);

   const { user } = useUser();

   useEffect(() => {
      const fetchUsers = async () => {
         try {
         const res = await fetch("/api/user/get", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ limit: 5 }),
         });

         if (!res.ok) throw new Error("Failed to fetch users");

         const data: {
            users: UserType[];
            totalUsers: number;
            lastMonthUsers: number;
         } = await res.json();
         setUsers(data.users);
         setTotalUsers(data.totalUsers);
         setLastMonthUsers(data.lastMonthUsers);
         } catch (error) {
         console.error("Error fetching users:", error);
         }
      };

      const fetchPosts = async () => {
         try {
         const res = await fetch("/api/post/get", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ limit: 5 }),
         });

         if (!res.ok) throw new Error("Failed to fetch posts");

         const data: {
            posts: PostType[];
            totalPosts: number;
            lastMonthPosts: number;
         } = await res.json();
         setPosts(data.posts);
         setTotalPosts(data.totalPosts);
         setLastMonthPosts(data.lastMonthPosts);
         } catch (error) {
         console.error("Error fetching posts:", error);
         }
      };

      if (user?.publicMetadata?.isAdmin) {
         fetchUsers();
         fetchPosts();
      }
   }, [user]);

   return (
      <div className="p-3 md:mx-auto">
         <div className="flex-wrap flex gap-4 justify-center">
         {/* Total Users Card */}
         <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
            <div className="flex justify-between">
               <div>
               <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
               <p className="text-2xl">{totalUsers}</p>
               </div>
               <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
               <span className="text-green-500 flex items-center">
               <HiArrowNarrowUp />
               {lastMonthUsers}
               </span>
               <div className="text-gray-500">Last month</div>
            </div>
         </div>

         {/* Total Posts Card */}
         <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
            <div className="flex justify-between">
               <div>
               <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
               <p className="text-2xl">{totalPosts}</p>
               </div>
               <HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
               <span className="text-green-500 flex items-center">
               <HiArrowNarrowUp />
               {lastMonthPosts}
               </span>
               <div className="text-gray-500">Last month</div>
            </div>
         </div>
         </div>

         {/* Recent Users & Posts Tables */}
         <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
         {/* Recent Users */}
         <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
            <div className="flex justify-between p-3 text-sm font-semibold">
               <h1 className="text-center p-2">Recent users</h1>
               <Button outline gradientDuoTone="purpleToPink">
               <Link href={"/dashboard?tab=users"}>See all</Link>
               </Button>
            </div>
            <Table hoverable>
               <Table.Head>
               <Table.HeadCell>User image</Table.HeadCell>
               <Table.HeadCell>Username</Table.HeadCell>
               </Table.Head>
               <Table.Body>
               {users.map((user) => (
                  <Table.Row
                     key={user._id}
                     className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                     <Table.Cell>
                     <img
                        src={user.profilePicture}
                        alt="user"
                        className="w-10 h-10 rounded-full bg-gray-500"
                     />
                     </Table.Cell>
                     <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
               ))}
               </Table.Body>
            </Table>
         </div>

         {/* Recent Posts */}
         <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
            <div className="flex justify-between p-3 text-sm font-semibold">
               <h1 className="text-center p-2">Recent posts</h1>
               <Button outline gradientDuoTone="purpleToPink">
               <Link href={"/dashboard?tab=posts"}>See all</Link>
               </Button>
            </div>
            <Table hoverable>
               <Table.Head>
               <Table.HeadCell>Post image</Table.HeadCell>
               <Table.HeadCell>Post Title</Table.HeadCell>
               <Table.HeadCell>Category</Table.HeadCell>
               </Table.Head>
               <Table.Body>
               {posts.map((post) => (
                  <Table.Row
                     key={post._id}
                     className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                     <Table.Cell>
                     <img
                        src={post.image}
                        alt="post"
                        className="w-14 h-10 rounded-md bg-gray-500"
                     />
                     </Table.Cell>
                     <Table.Cell className="w-96">{post.title}</Table.Cell>
                     <Table.Cell className="w-5">{post.category}</Table.Cell>
                  </Table.Row>
               ))}
               </Table.Body>
            </Table>
         </div>
         </div>
      </div>
   );
   }
   ```

** Deploy into server via Github Actions.**
Automatice the deployment with Github Actions.
  - Go to your repository -> Settings -> Secrets and Variables -> Actions. Go to "New Repository Secret" and create the following secrets:
    - DEPLOY_SSH_KEY: Paste the private Key of the server. You can get it from the one you created on Hostinger.
    - VPS_IP: Paste the IP of the server.
  - Create the file `github/workflows/deploy.yml` with the following code:
   ```
   name: Deploy Node.js app to AlmaLinux

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "22" # Using Node.js 22 as per your environment

      - name: Deploy to VPS
        env:
          DEPLOY_SSH_KEY: ${{ secrets.DEPLOY_SSH_KEY }}
          VPS_IP: ${{ secrets.VPS_IP }}
        run: |
          # Set up SSH for secure connection
          mkdir -p ~/.ssh
          echo "${{ secrets.DEPLOY_SSH_KEY }}" > ~/.ssh/id_ed25519
          chmod 600 ~/.ssh/id_ed25519
          ssh-keyscan -H ${{ secrets.VPS_IP }} >> ~/.ssh/known_hosts

          # Connect to the VPS and deploy
          ssh -o ServerAliveInterval=30 -o ServerAliveCountMax=120 -i ~/.ssh/id_ed25519 vefrmeistari@${{ secrets.VPS_IP }} << 'EOF'
            set -e

            # Mark the repository as safe
            git config --global --add safe.directory /var/www/_blogCronicasDelVejerete
            
            # Navigate to the project directory
            cd /var/www/_blogCronicasDelVejerete

            # Pull the latest code from the repository
            git pull origin main

            # Install backend dependencies
            npm install

            # Build the app in production mode
            NODE_ENV=production npm run build

            # Start or restart the backend using PM2
            pm2 start --name next-blog || pm2 restart next-blog
          EOF
   ```
- Deploy to Github:
    - `git add .`
    - `git commit -m "Add GitHub Actions deployment script"`
    - `git push origin main`
  - Go to Github actions and check if the deployment was succesful (Also you can receibe deploy failed email if any error)
  - Troubleshooting and Tips.
    - Verify if you have the right permisions: `chmod 600 ~/.ssh/id_ed25519`
    - Test manually by SSH-into the VPS: `ssh -i ~/.ssh/id_ed25519 user@VPS_IP`
    - Confirm that the app managed is it pm2 `pm2 list`
    - Check logs of any error: `pm2 logs your-web` 

3:45:42 setSideBarData  

# Create comments section
1. Create file: `src/lib/models/comment.models.ts`
   ```
   // /src/lib/models/comment.model.ts
   import { Schema, model, models, Document } from "mongoose";

   export interface IComment extends Document {
   content: string;
   postId: string;
   userId: string;
   likes: string[];
   numberOfLikes: number;
   }

   const CommentSchema = new Schema<IComment>(
   {
      content: { type: String, required: true },
      postId: { type: String, required: true },
      userId: { type: String, required: true },
      likes: { type: [String], default: [] },
      numberOfLikes: { type: Number, default: 0 },
   },
   { timestamps: true }
   );

   export default models.Comment || model<IComment>("Comment", CommentSchema);

   ```
2. Now create the route `/src/app/api/create/route.ts`
   ```
   // /src/app/api/comments/create/route.ts
   import { NextResponse } from "next/server";
   import { connect } from "@/lib/mongodb/mongoose";
   import Comment, { IComment } from "@/lib/models/comment.model"; // Import the Comment model
   import { auth } from "@clerk/nextjs/server"; // Clerk helper for server-side auth

   export async function POST(req: Request) {
   await connect();

   try {
      // Clerk's auth() returns the current session data.
      const { userId } = await auth(); // Get the authenticated user's id
      if (!userId) {
         return NextResponse.json({ message: "Not authenticated" }, { status: 403 });
      }

      // Parse the request body
      const body = await req.json();
      const { content, postId } = body;

      // Optional: if you require that userId in body should match the authenticated user:
      if (body.userId && body.userId !== userId) {
         return NextResponse.json({ message: "You're not allowed to create comments" }, { status: 403 });
      }

      // Create a new comment using the authenticated user's id
      const newComment: IComment = new Comment({
         content,
         postId,
         userId, // use the authenticated id
      });

      await newComment.save();
      return NextResponse.json(newComment, { status: 200 });
   } catch (error: unknown) {
      let message = "Internal Server Error";
      if (error instanceof Error) {
         message = error.message;
      }
      return NextResponse.json({ message }, { status: 500 });
   }
   }

   ```
3. Now create the route to get the comments: `/src/app/api/comments/getPostComments/[postId]/route.ts`
   ```
   // /src/app/api/comments/getPostComments/[postId]/route.ts

      import { NextRequest, NextResponse } from "next/server";
      import { connect } from "@/lib/mongodb/mongoose";
      import Comment from "@/lib/models/comment.model";

      /**
      * GET /api/comments/getPostComments/[postId]
      * Retrieves all comments for a specific post, sorted by newest first.
      */
      export async function GET(
      req: NextRequest,
      { params }: { params: { postId: string } }  // `postId` matches the [postId] folder name
      ) {
      // 1. Ensure MongoDB connection
      await connect();

      try {
         // 2. Extract `postId` from the dynamic route parameters
         const { postId } = params;

         // 3. Query comments for this post, sorted descending by creation date
         //    .lean() returns plain JS objects (no Mongoose getters or methods)
         const comments = await Comment.find({ postId })
            .sort({ createdAt: -1 })
            .lean();

         // 4. Return the comments with HTTP 200
         return NextResponse.json(comments, { status: 200 });
      } catch (error: unknown) {
         // 5. Error handling: narrow `error` to `Error` before reading message
         const message = error instanceof Error ? error.message : "Internal Server Error";
         return NextResponse.json({ message }, { status: 500 });
      }
      }

   ```

 
## Notes
* Whith this line // eslint-disable-next-line @typescript-eslint/ban-ts-comment you can ommit Eslint validations.
* Using React Quill New on NextJS app https://dev.to/a7u/react-quill-with-nextjs-478b
* sudo chown -R youruser:youruser /var/www/your_page/ changes the ownership
* sudo nginx -t && sudo systemctl restart nginx to restart and check status of nginx server.
* To check the CPU usage: `top` or `htop` if not **htop** installed do:
  - For AlmaLinux: `sudo dnf install htop`
* To check the 10 processes with the highest CPU usage: `ps aux --sort=-%cpu | head -10`
* If having issues with the build with `npm run build` install `npm install --save-dev webpack @types/webpack`
* Use `export const revalidate = 60; // or 300, 3600, 86400 depending on your desired interval` to change the update time of the page. It is important.

## Bibliography
1. Main Tutorial [Code With Sahand](https://www.youtube.com/watch?v=Zw8Wl1W0LW0&t=9s) 
2. [NextJS](https://nextjs.org/docs/getting-started/installation) 

{
   `pm2 start npm --name "nextjs-app" -- start -- -p 3001`
    pm2 save
    pm2 startup

    View logs in real-time:

bash
Copy
Edit
pm2 logs nextjs-app
Restart the app:

bash
Copy
Edit
pm2 restart nextjs-app
Stop the app:

bash
Copy
Edit
pm2 stop nextjs-app
Delete the app from PM2:

bash
Copy
Edit
pm2 delete nextjs-app



}