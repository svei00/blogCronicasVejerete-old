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
       Go to the top of the file and import `import flowbite from "flowbite/plugin";`
   5.3 In the content part add: `"./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",`
   5.4 And in plugins add the pluglin:
   `
    plugins: [
        flowbite,
    ],
   `



## Bibliography
1. Main Tutorial [Code With Sahand](https://www.youtube.com/watch?v=Zw8Wl1W0LW0&t=9s) 
2. [NextJS](https://nextjs.org/docs/getting-started/installation)