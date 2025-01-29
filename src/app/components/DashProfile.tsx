import { UserProfile } from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function DashProfile() {
  const theme = useTheme();

  return (
    <div className="flex justify-center items-center w-full">
      <UserProfile
        routing="hash"
        appearance={{
          baseTheme: theme.theme === "dark" ? dark : neobrutalism,
        }}
      />
    </div>
  );
}
