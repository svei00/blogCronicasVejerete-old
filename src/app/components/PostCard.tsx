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
