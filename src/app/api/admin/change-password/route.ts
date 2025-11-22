import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { AdminUser } from '@/models';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const body = await request.json();

    // Validate input
    const result = changePasswordSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.issues.map(e => e.message).join(', ');
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const { currentPassword, newPassword } = result.data;

    // Get user with password
    const user = await AdminUser.findById(session.user.id).select('+password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    );
  }
}
