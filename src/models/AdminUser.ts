import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdminUserDocument {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'editor';
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

type AdminUserModel = Model<IAdminUserDocument, {}, IAdminUserMethods>;

const AdminUserSchema = new Schema<IAdminUserDocument, AdminUserModel, IAdminUserMethods>(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't include password in queries by default
    },
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    role: {
      type: String,
      enum: ['admin', 'editor'],
      default: 'admin',
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
AdminUserSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }

  // Hash with cost factor of 12 (good balance of security and performance)
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
AdminUserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const AdminUser: AdminUserModel =
  mongoose.models.AdminUser || mongoose.model<IAdminUserDocument, AdminUserModel>('AdminUser', AdminUserSchema);

export default AdminUser;
