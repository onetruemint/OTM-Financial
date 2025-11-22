import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

// Admin user details - CHANGE THESE
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'changeme123'; // Minimum 8 characters
const ADMIN_NAME = 'Admin User';

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not available');
    }

    // Hash password with bcrypt (cost factor 12)
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    // Check if user already exists
    const existingUser = await db
      .collection('adminusers')
      .findOne({ email: ADMIN_EMAIL.toLowerCase() });

    if (existingUser) {
      console.log('Admin user already exists. Updating password...');
      await db
        .collection('adminusers')
        .updateOne(
          { email: ADMIN_EMAIL.toLowerCase() },
          { $set: { password: hashedPassword, updatedAt: new Date() } }
        );
      console.log('Password updated successfully!');
    } else {
      // Insert new admin user
      await db.collection('adminusers').insertOne({
        email: ADMIN_EMAIL.toLowerCase(),
        password: hashedPassword,
        name: ADMIN_NAME,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('Admin user created successfully!');
    }

    console.log('\nCredentials:');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log('\nIMPORTANT: Change the password after first login!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

createAdmin();
