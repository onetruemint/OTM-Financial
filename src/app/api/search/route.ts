import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Post } from '@/models';
import { escapeRegex } from '@/lib/sanitize';

// GET search posts
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const skip = (page - 1) * limit;

    // Use regex for partial matching since text search requires exact words
    // Escape special characters to prevent ReDoS attacks
    const searchRegex = new RegExp(escapeRegex(query), 'i');

    const posts = await Post.find({
      published: true,
      $or: [
        { title: searchRegex },
        { excerpt: searchRegex },
        { content: searchRegex },
      ],
    })
      .populate('author', 'name avatar')
      .populate('category', 'name slug color')
      .populate('tags', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Post.countDocuments({
      published: true,
      $or: [
        { title: searchRegex },
        { excerpt: searchRegex },
        { content: searchRegex },
      ],
    });

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error searching posts:', error);
    return NextResponse.json(
      { error: 'Failed to search posts' },
      { status: 500 }
    );
  }
}
