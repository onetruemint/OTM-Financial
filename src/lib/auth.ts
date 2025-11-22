import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import dbConnect from '@/lib/mongodb';
import { AdminUser } from '@/models';

declare module 'next-auth' {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      role?: string;
    };
  }
  interface JWT {
    id?: string;
    role?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await dbConnect();

          // Find user and explicitly select password field
          const user = await AdminUser.findOne({ email: credentials.email })
            .select('+password')
            .exec();

          if (!user) {
            return null;
          }

          // Compare password using the model method
          const isValid = await user.comparePassword(credentials.password as string);

          if (!isValid) {
            return null;
          }

          // Update last login
          await AdminUser.findByIdAndUpdate(user._id, { lastLogin: new Date() });

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string | undefined;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
});
