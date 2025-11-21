import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Author } from '@/models';
import { auth } from '@/lib/auth';

// GET all authors
export async function GET() {
  try {
    await dbConnect();

    const authors = await Author.find().sort({ name: 1 }).lean();

    return NextResponse.json(authors);
  } catch (error) {
    console.error('Error fetching authors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch authors' },
      { status: 500 }
    );
  }
}

// POST create new author (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();
    const { name, email, bio, avatar } = body;

    const existingAuthor = await Author.findOne({ email });
    if (existingAuthor) {
      return NextResponse.json(
        { error: 'An author with this email already exists' },
        { status: 400 }
      );
    }

    const author = await Author.create({
      name,
      email,
      bio,
      avatar,
    });

    return NextResponse.json(author, { status: 201 });
  } catch (error) {
    console.error('Error creating author:', error);
    return NextResponse.json(
      { error: 'Failed to create author' },
      { status: 500 }
    );
  }
}
