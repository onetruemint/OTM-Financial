// Environment variable validation - import this in server-side code that needs env vars
// This ensures proper error messages when variables are missing

export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
      `Please add it to your .env.local file or Vercel environment variables.`
    );
  }
  return value;
}

// Validate environment variables for specific features
export function validateAuthEnv() {
  return {
    authSecret: getRequiredEnv('AUTH_SECRET'),
    adminPassword: getRequiredEnv('ADMIN_PASSWORD'),
  };
}

export function validateCloudinaryEnv() {
  return {
    cloudName: getRequiredEnv('CLOUDINARY_CLOUD_NAME'),
    apiKey: getRequiredEnv('CLOUDINARY_API_KEY'),
    apiSecret: getRequiredEnv('CLOUDINARY_API_SECRET'),
  };
}

// List of all required environment variables for production
export const REQUIRED_ENV_VARS = [
  'MONGODB_URI',
  'AUTH_SECRET',
  'ADMIN_PASSWORD',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];
