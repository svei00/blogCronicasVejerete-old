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
