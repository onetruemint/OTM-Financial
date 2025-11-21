import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

// Define schemas inline for the seed script
const AuthorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  bio: String,
  avatar: String,
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: { type: String, unique: true },
  slug: { type: String, unique: true },
  description: String,
  color: String,
}, { timestamps: true });

const TagSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  slug: { type: String, unique: true },
}, { timestamps: true });

const PostSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  excerpt: String,
  content: String,
  featuredImage: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  likes: { type: Number, default: 0 },
  published: { type: Boolean, default: false },
}, { timestamps: true });

const Author = mongoose.models.Author || mongoose.model('Author', AuthorSchema);
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
const Tag = mongoose.models.Tag || mongoose.model('Tag', TagSchema);
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Author.deleteMany({}),
      Category.deleteMany({}),
      Tag.deleteMany({}),
      Post.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Create author
    const author = await Author.create({
      name: 'Admin',
      email: 'admin@example.com',
      bio: 'Welcome to our blog! I share insights on technology, design, and more.',
    });
    console.log('Created author');

    // Create categories
    const categories = await Category.create([
      { name: 'Technology', slug: 'technology', description: 'Latest tech news and tutorials', color: 'blue' },
      { name: 'Design', slug: 'design', description: 'UI/UX and visual design', color: 'purple' },
      { name: 'Lifestyle', slug: 'lifestyle', description: 'Tips for better living', color: 'green' },
      { name: 'Travel', slug: 'travel', description: 'Adventures around the world', color: 'tan' },
    ]);
    console.log('Created categories');

    // Create tags
    const tags = await Tag.create([
      { name: 'Next.js', slug: 'nextjs' },
      { name: 'React', slug: 'react' },
      { name: 'TypeScript', slug: 'typescript' },
      { name: 'Tailwind CSS', slug: 'tailwind-css' },
      { name: 'MongoDB', slug: 'mongodb' },
      { name: 'Tutorial', slug: 'tutorial' },
    ]);
    console.log('Created tags');

    // Create sample posts
    await Post.create([
      {
        title: 'Getting Started with Next.js 15',
        slug: 'getting-started-with-nextjs-15',
        excerpt: 'Learn how to build modern web applications with Next.js 15, featuring the new App Router and React Server Components.',
        content: `<p>Next.js 15 brings exciting new features that make building web applications easier than ever. In this guide, we'll explore the basics and get you up and running quickly.</p>

<h2>Why Next.js?</h2>
<p>Next.js provides a great developer experience with features like:</p>
<ul>
<li>Server-side rendering and static generation</li>
<li>File-based routing</li>
<li>API routes</li>
<li>Built-in optimizations</li>
</ul>

<h2>Getting Started</h2>
<p>Create a new Next.js project with:</p>
<pre><code>npx create-next-app@latest my-app</code></pre>

<p>Happy coding!</p>`,
        featuredImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
        author: author._id,
        category: categories[0]._id,
        tags: [tags[0]._id, tags[1]._id, tags[2]._id, tags[5]._id],
        likes: 42,
        published: true,
      },
      {
        title: 'Designing Beautiful User Interfaces',
        slug: 'designing-beautiful-user-interfaces',
        excerpt: 'Explore the principles of good UI design and learn how to create interfaces that users love.',
        content: `<p>Great design is invisible. It's not about making things look pretty—it's about making things work well while looking good.</p>

<h2>Core Principles</h2>
<p>Follow these principles to create better interfaces:</p>
<ul>
<li><strong>Clarity:</strong> Make it obvious what users can do</li>
<li><strong>Consistency:</strong> Use familiar patterns</li>
<li><strong>Feedback:</strong> Respond to user actions</li>
<li><strong>Simplicity:</strong> Remove unnecessary elements</li>
</ul>

<h2>Color Theory</h2>
<p>Colors evoke emotions and guide attention. Use them purposefully to create hierarchy and meaning.</p>`,
        featuredImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
        author: author._id,
        category: categories[1]._id,
        tags: [tags[3]._id],
        likes: 28,
        published: true,
      },
      {
        title: 'Building Full-Stack Apps with MongoDB',
        slug: 'building-full-stack-apps-with-mongodb',
        excerpt: 'Discover how MongoDB can power your full-stack applications with flexible data modeling.',
        content: `<p>MongoDB is a powerful NoSQL database that pairs perfectly with modern JavaScript frameworks.</p>

<h2>Why MongoDB?</h2>
<ul>
<li>Flexible schema design</li>
<li>Horizontal scaling</li>
<li>Rich query language</li>
<li>Great for rapid development</li>
</ul>

<h2>Getting Connected</h2>
<p>Use Mongoose to connect your Node.js app to MongoDB:</p>
<pre><code>import mongoose from 'mongoose';
await mongoose.connect(process.env.MONGODB_URI);</code></pre>

<p>Start building your data models and watch your app come to life!</p>`,
        featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
        author: author._id,
        category: categories[0]._id,
        tags: [tags[4]._id, tags[5]._id],
        likes: 35,
        published: true,
      },
    ]);
    console.log('Created posts');

    console.log('\\n✅ Seed completed successfully!');
    console.log('\\nYou can now:');
    console.log('1. Start your dev server: npm run dev');
    console.log('2. View your blog at: http://localhost:3000');
    console.log('3. Access admin at: http://localhost:3000/admin');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
