import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Post } from '@/models';

// POST increment likes for a post
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
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
