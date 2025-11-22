import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

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

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
          throw new Error('Admin credentials not configured');
        }

        if (credentials.email === adminEmail) {
          // Always use bcrypt comparison for security
          // ADMIN_PASSWORD in env should be a bcrypt hash
          // Generate with: npx bcryptjs hash "yourpassword"
          let isValid = false;

          // Check if password is bcrypt hashed (starts with $2)
          if (adminPassword.startsWith('$2')) {
            isValid = await bcrypt.compare(credentials.password as string, adminPassword);
          } else {
            // Fallback for non-hashed passwords (development only)
            // Log warning in production
            if (process.env.NODE_ENV === 'production') {
              console.warn('WARNING: ADMIN_PASSWORD should be bcrypt hashed in production');
            }
            isValid = credentials.password === adminPassword;
          }

          if (isValid) {
            return {
              id: '1',
              email: adminEmail,
              name: 'Admin',
            };
          }
        }

        return null;
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
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
});
