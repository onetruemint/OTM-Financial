import mongoose from 'mongoose';

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

  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
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
