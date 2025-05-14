// src/app/post/[slug]/page.tsx

import React from "react";
import { Button } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import CallToAction from "@/app/components/CallToAction";
import RecentPosts from "@/app/components/RecentPosts";
import CommentSection from "@/app/components/CommentSection";

// Define the shape of the post data returned by your API
// This interface is preserved for documentation and type safety
interface PostData {
  title: string;
  category: string;
  image: string;
  content: string;
  createdAt: string;
  slug: string;
}

/**
 * Dynamic post page component for individual blog posts
 * @param params - Object containing route parameters
 * @param params.slug - The slug identifier for the post from the URL
 * @returns Promise<React.ReactElement> - The rendered post page component
 */
export default async function Page({
  params, // Destructured route parameters
}: {
  params: { slug: string }; // Inline type definition for Next.js compatibility
}): Promise<React.ReactElement> {
  const { slug } = params;

  // Fetch post data from API endpoint
  let post: PostData;
  try {
    // API request configuration
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/post/get`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Required for POST requests
        },
        body: JSON.stringify({ slug }), // Send slug as JSON payload
        cache: "no-store", // Ensure fresh data on each request
      }
    );

    // Handle HTTP errors
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse JSON response
    const data = await response.json();
    post = data.posts[0];

    // Validate post data exists
    if (!post) {
      throw new Error("No post found in response data");
    }
  } catch (error) {
    // Error handling and logging
    console.error("Error loading post:", error);

    // Return error state UI
    return (
      <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h2 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          Publicación no encontrada
        </h2>
        <p className="text-center text-red-500 mt-4">
          Lo sentimos, no pudimos cargar esta publicación.
        </p>
      </main>
    );
  }

  // Calculate reading time in minutes
  const tiempoLectura = Math.ceil(post.content.length / 1000);

  // Main component render
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      {/* Encabezado del artículo */}
      <article>
        {/* Título principal */}
        <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
          {post.title}
        </h1>

        {/* Categoría */}
        <div className="self-center mt-5">
          <Link
            href={`/search?category=${encodeURIComponent(post.category)}`}
            className="hover:underline"
          >
            <Button color="gray" pill size="xs">
              {post.category}
            </Button>
          </Link>
        </div>

        {/* Imagen destacada */}
        <div className="mt-10 p-3">
          <Image
            src={post.image}
            alt={`Imagen destacada para ${post.title}`}
            width={800}
            height={600}
            className="max-h-[600px] w-full object-cover rounded-lg shadow-xl"
            priority // Priorizar carga de imagen principal
          />
        </div>

        {/* Metadatos del artículo */}
        <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          {/* Fecha de publicación */}
          <time dateTime={post.createdAt}>
            {new Date(post.createdAt).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>

          {/* Tiempo de lectura */}
          <span>{tiempoLectura} min de lectura</span>
        </div>
      </article>

      {/* Contenido HTML del artículo */}
      <section
        className="p-3 max-w-2xl mx-auto w-full post-content prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Sección de llamada a la acción */}
      <div className="max-w-4xl mx-auto w-full my-12">
        <CallToAction />
      </div>

      {/* Publicaciones recientes relacionadas */}
      <div className="my-12">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Más publicaciones recientes
        </h2>
        <RecentPosts limit={3} excludeSlug={post.slug} />
      </div>

      {/* Sección de comentarios */}
      <section className="max-w-4xl mx-auto w-full mt-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Únete a la conversación
        </h2>
        <CommentSection postId={slug} />
      </section>
    </main>
  );
}
