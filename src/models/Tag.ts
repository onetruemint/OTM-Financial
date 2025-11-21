import mongoose, { Schema, Model } from 'mongoose';

export interface ITagDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  createdAt: Date;
}

const TagSchema = new Schema<ITagDocument>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a tag name'],
      trim: true,
      unique: true,
      maxlength: [30, 'Name cannot be more than 30 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

const Tag: Model<ITagDocument> =
  mongoose.models.Tag || mongoose.model<ITagDocument>('Tag', TagSchema);

export default Tag;
