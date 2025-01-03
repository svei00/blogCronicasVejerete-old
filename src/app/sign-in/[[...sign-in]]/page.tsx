import { SignIn } from "@clerk/nextjs";

const Page: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-3">
      <SignIn />
    </div>
  );
};

export default Page;
