import mongoose, { Schema, Model } from 'mongoose';

export interface IAuthorDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  createdAt: Date;
}

const AuthorSchema = new Schema<IAuthorDocument>(
  {
    name: {
      type: String,
      required: [true, 'Please provide an author name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot be more than 500 characters'],
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Author: Model<IAuthorDocument> =
  mongoose.models.Author || mongoose.model<IAuthorDocument>('Author', AuthorSchema);

export default Author;
