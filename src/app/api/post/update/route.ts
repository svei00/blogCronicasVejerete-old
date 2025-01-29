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
