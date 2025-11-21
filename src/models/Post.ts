import mongoose, { Schema, Model } from 'mongoose';

export interface IPostDocument {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];
  likes: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPostDocument>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      required: [true, 'Please provide an excerpt'],
      maxlength: [300, 'Excerpt cannot be more than 300 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
    },
    featuredImage: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'Author',
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
    likes: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
PostSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

const Post: Model<IPostDocument> =
  mongoose.models.Post || mongoose.model<IPostDocument>('Post', PostSchema);

export default Post;
