import mongoose, { Schema, Model } from 'mongoose';

export interface ICategoryDocument {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  color: string;
  createdAt: Date;
}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      trim: true,
      unique: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot be more than 200 characters'],
    },
    color: {
      type: String,
      default: 'blue',
      enum: ['blue', 'green', 'purple', 'tan', 'red', 'mint'],
    },
  },
  {
    timestamps: true,
  }
);

const Category: Model<ICategoryDocument> =
  mongoose.models.Category || mongoose.model<ICategoryDocument>('Category', CategorySchema);

export default Category;
