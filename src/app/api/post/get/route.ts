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
