import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Category } from '@/models';
import { auth } from '@/lib/auth';
import slugify from 'slugify';

// GET single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();

    const { slug } = await params;

    const category = await Category.findOne({ slug }).lean();

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT update category (admin only)
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
    const { name, description, color } = body;

    const category = await Category.findOne({ slug });
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    let newSlug = slug;
    if (name && name !== category.name) {
      newSlug = slugify(name, { lower: true, strict: true });

      const existingCategory = await Category.findOne({ slug: newSlug, _id: { $ne: category._id } });
      if (existingCategory) {
        return NextResponse.json(
          { error: 'A category with this name already exists' },
          { status: 400 }
        );
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      category._id,
      {
        name: name || category.name,
        slug: newSlug,
        description: description !== undefined ? description : category.description,
        color: color || category.color,
      },
      { new: true }
    );

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE category (admin only)
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

    const category = await Category.findOneAndDelete({ slug });
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
