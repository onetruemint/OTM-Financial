import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Validate connection string format
if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
  throw new Error('MONGODB_URI must start with mongodb:// or mongodb+srv://');
}

// Check for placeholder hostname
if (MONGODB_URI.includes('cluster.mongodb.net') && !MONGODB_URI.match(/cluster\d+\.\w+\.mongodb\.net/)) {
  throw new Error(
    'MONGODB_URI contains placeholder hostname. Please replace "cluster.mongodb.net" with your actual MongoDB Atlas cluster hostname (e.g., cluster0.xxxxx.mongodb.net). ' +
    'Get your connection string from MongoDB Atlas: https://cloud.mongodb.com -> Connect -> Connect your application'
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    cached.promise = null;

    // Provide helpful error messages
    if (e?.code === 'ENOTFOUND' || e?.message?.includes('ENOTFOUND')) {
      const errorMsg = new Error(
        `DNS resolution failed for MongoDB connection.\n` +
        `Error: ${e.message}\n\n` +
        `Possible solutions:\n` +
        `1. Verify your MONGODB_URI in .env.local has the correct cluster hostname\n` +
        `2. Check your internet connection\n` +
        `3. If using WSL2, try: sudo bash -c 'echo "nameserver 8.8.8.8" > /etc/resolv.conf'\n` +
        `4. Verify your MongoDB Atlas cluster is running and accessible\n` +
        `5. Check if your IP address is whitelisted in MongoDB Atlas Network Access settings`
      );
      errorMsg.stack = e.stack;
      throw errorMsg;
    }

    throw e;
  }

  return cached.conn;
}

export default dbConnect;
