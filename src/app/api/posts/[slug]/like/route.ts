import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Post } from '@/models';
import { ratelimit, getClientId } from '@/lib/ratelimit';

// POST increment likes for a post
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Apply rate limiting if configured
    if (ratelimit) {
      const clientId = getClientId(request);
      const { success, limit, reset, remaining } = await ratelimit.limit(clientId);

      if (!success) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            },
          }
        );
      }
    }

    await dbConnect();

    const { slug } = await params;

    const post = await Post.findOneAndUpdate(
      { slug },
      { $inc: { likes: 1 } },
      { new: true }
    ).select('likes');

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ likes: post.likes });
  } catch (error) {
    console.error('Error liking post:', error);
    return NextResponse.json(
      { error: 'Failed to like post' },
      { status: 500 }
    );
  }
}
