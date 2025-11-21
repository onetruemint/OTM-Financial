import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Post, Category, Tag, Author } from '@/models';
import { auth } from '@/lib/auth';
import slugify from 'slugify';

// GET all posts (with filters)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const published = searchParams.get('published');

    const query: Record<string, unknown> = {};

    // Only show published posts for public requests
    if (published !== 'all') {
      query.published = true;
    }

    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    if (tag) {
      const tagDoc = await Tag.findOne({ slug: tag });
      if (tagDoc) {
        query.tags = tagDoc._id;
      }
    }

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const posts = await Post.find(query)
      .populate('author', 'name avatar')
      .populate('category', 'name slug color')
      .populate('tags', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Post.countDocuments(query);

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
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST create new post (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { title, excerpt, content, featuredImage, author, category, tags, published } = body;

    const slug = slugify(title, { lower: true, strict: true });

    // Check if slug already exists
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return NextResponse.json(
        { error: 'A post with this title already exists' },
        { status: 400 }
      );
    }

    const post = await Post.create({
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      author,
      category,
      tags: tags || [],
      published: published || false,
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name avatar')
      .populate('category', 'name slug color')
      .populate('tags', 'name slug');

    return NextResponse.json(populatedPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
