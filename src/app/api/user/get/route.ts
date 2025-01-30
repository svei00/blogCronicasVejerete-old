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
