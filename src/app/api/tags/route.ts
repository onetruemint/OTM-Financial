import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Tag } from '@/models';
import { auth } from '@/lib/auth';
import slugify from 'slugify';

// GET all tags
export async function GET() {
  try {
    await dbConnect();

    const tags = await Tag.find().sort({ name: 1 }).lean();

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

// POST create new tag (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { name } = body;

    const slug = slugify(name, { lower: true, strict: true });

    const existingTag = await Tag.findOne({ slug });
    if (existingTag) {
      return NextResponse.json(
        { error: 'A tag with this name already exists' },
        { status: 400 }
      );
    }

    const tag = await Tag.create({
      name,
      slug,
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    );
  }
}
