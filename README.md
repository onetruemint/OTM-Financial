# OneTrueMint Financial - Next.js Blog with MongoDB Atlas

A modern, user-friendly blog platform built with Next.js 15, MongoDB Atlas, and Tailwind CSS.

## Features

- **Public Blog**: Browse posts, search, filter by categories and tags
- **Like System**: Users can like posts
- **Admin Dashboard**: Create, edit, and manage posts, categories, tags, and authors
- **Authentication**: Secure admin login with NextAuth.js
- **Responsive Design**: Clean, modern UI with custom color palette
- **SEO Friendly**: Server-side rendering for better search engine optimization

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: MongoDB Atlas
- **Authentication**: NextAuth.js v5
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd otm-blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env.local` and update the values:
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog?retryWrites=true&w=majority
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=your-secure-password
   ```

   To generate a secure secret:
   ```bash
   openssl rand -base64 32
   ```

4. **Seed the database (optional)**

   This creates sample data to get you started:
   ```bash
   npm run seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Blog: http://localhost:3000
   - Admin: http://localhost:3000/admin

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin dashboard pages
│   ├── api/                # API routes
│   ├── blog/               # Blog pages
│   ├── category/           # Category pages
│   ├── search/             # Search page
│   └── tag/                # Tag pages
├── components/             # React components
│   └── admin/              # Admin-specific components
├── lib/                    # Utility functions
├── models/                 # Mongoose models
└── types/                  # TypeScript types
```

## Color Palette

The blog uses a custom pastel color palette:

- White: `#f5f5f5`
- Mint: `#d5f3ed`
- Black: `#1e1e1e`
- Blue: `#d5eaf3`
- Green: `#d5f3de`
- Purple: `#edd5f3`
- Tan: `#f3edd5`
- Red: `#f3d5db`

And darker variants for accents.

## Admin Usage

1. Go to `/admin/login`
2. Sign in with the credentials from your `.env.local`
3. Create authors, categories, and tags first
4. Then create blog posts

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

Build the project:
```bash
npm run build
npm start
```

## License

MIT
