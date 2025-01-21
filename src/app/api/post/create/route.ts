import Post from "../../../../lib/models/post.model";
import { connect } from "../../../../lib/mongodb/mongoose";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const user = await currentUser();
  let data;

  try {
    data = await req.json();
  } catch (err) {
    return new Response("Invalid request body", { status: 400 });
  }

  try {
    await connect();

    if (
      !user ||
      user.publicMetadata.userMongoId !== data.userMongoId ||
      user.publicMetadata.isAdmin !== true
    ) {
      return new Response("Unauthorized", { status: 401 });
    }

    const slug = data.title
      .trim()
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");

    const newPost = new Post({
      userId: user.publicMetadata.userMongoId,
      content: data.content,
      title: data.title,
      image: data.image,
      category: data.category,
      slug,
    });

    await newPost.save();

    return new Response(JSON.stringify({ 
      ok: true, 
      slug: newPost.slug, }), { status: 200 });
  } catch (error) {
    console.error("Error Creating the Post:", error);
    return new Response("Error Creating the Post", { status: 500 });
  }
}
