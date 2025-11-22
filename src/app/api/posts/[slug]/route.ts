import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Post } from '@/models';
import { auth } from '@/lib/auth';
import slugify from 'slugify';
import cloudinary from '@/lib/cloudinary';

// Extract public_id from Cloudinary URL
function extractPublicId(url: string): string | null {
  if (!url || !url.includes('cloudinary.com')) {
    return null;
  }

  // URL format: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{public_id}.{ext}
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
  return match ? match[1] : null;
}

// GET single post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();

    const { slug } = await params;

    const post = await Post.findOne({ slug })
      .populate('author', 'name avatar bio')
      .populate('category', 'name slug color')
      .populate('tags', 'name slug')
      .lean();

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PUT update post (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { slug } = await params;
    const body = await request.json();
    const { title, excerpt, content, featuredImage, author, category, tags, published } = body;

    const post = await Post.findOne({ slug });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Update slug if title changed
    let newSlug = slug;
    if (title && title !== post.title) {
      newSlug = slugify(title, { lower: true, strict: true });

      // Check if new slug already exists
      const existingPost = await Post.findOne({ slug: newSlug, _id: { $ne: post._id } });
      if (existingPost) {
        return NextResponse.json(
          { error: 'A post with this title already exists' },
          { status: 400 }
        );
      }
    }

    const updatedPost = await Post.findByIdAndUpdate(
      post._id,
      {
        title: title || post.title,
        slug: newSlug,
        excerpt: excerpt || post.excerpt,
        content: content || post.content,
        featuredImage: featuredImage !== undefined ? featuredImage : post.featuredImage,
        author: author || post.author,
        category: category || post.category,
        tags: tags !== undefined ? tags : post.tags,
        published: published !== undefined ? published : post.published,
      },
      { new: true }
    )
      .populate('author', 'name avatar')
      .populate('category', 'name slug color')
      .populate('tags', 'name slug');

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE post (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { slug } = await params;

    const post = await Post.findOneAndDelete({ slug });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Delete featured image from Cloudinary if it exists
    if (post.featuredImage) {
      const publicId = extractPublicId(post.featuredImage);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudinaryError) {
          // Log but don't fail the request if image deletion fails
          console.error('Error deleting image from Cloudinary:', cloudinaryError);
        }
      }
    }

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
