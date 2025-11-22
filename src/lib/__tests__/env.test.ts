import { getRequiredEnv, validateAuthEnv, validateCloudinaryEnv, REQUIRED_ENV_VARS } from '../env';

describe('getRequiredEnv', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return env variable when it exists', () => {
    process.env.TEST_VAR = 'test-value';
    expect(getRequiredEnv('TEST_VAR')).toBe('test-value');
  });

  it('should throw error when env variable is missing', () => {
    delete process.env.MISSING_VAR;
    expect(() => getRequiredEnv('MISSING_VAR')).toThrow('Missing required environment variable: MISSING_VAR');
  });

  it('should throw error with helpful message', () => {
    delete process.env.MY_VAR;
    expect(() => getRequiredEnv('MY_VAR')).toThrow('.env.local');
    expect(() => getRequiredEnv('MY_VAR')).toThrow('Vercel');
  });
});

describe('validateAuthEnv', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return auth environment variables', () => {
    process.env.AUTH_SECRET = 'secret123';
    process.env.ADMIN_PASSWORD = 'password123';

    const result = validateAuthEnv();
    expect(result.authSecret).toBe('secret123');
    expect(result.adminPassword).toBe('password123');
  });

  it('should throw when AUTH_SECRET is missing', () => {
    delete process.env.AUTH_SECRET;
    process.env.ADMIN_PASSWORD = 'password123';

    expect(() => validateAuthEnv()).toThrow('AUTH_SECRET');
  });

  it('should throw when ADMIN_PASSWORD is missing', () => {
    process.env.AUTH_SECRET = 'secret123';
    delete process.env.ADMIN_PASSWORD;

    expect(() => validateAuthEnv()).toThrow('ADMIN_PASSWORD');
  });
});

describe('validateCloudinaryEnv', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return cloudinary environment variables', () => {
    process.env.CLOUDINARY_CLOUD_NAME = 'my-cloud';
    process.env.CLOUDINARY_API_KEY = 'api-key';
    process.env.CLOUDINARY_API_SECRET = 'api-secret';

    const result = validateCloudinaryEnv();
    expect(result.cloudName).toBe('my-cloud');
    expect(result.apiKey).toBe('api-key');
    expect(result.apiSecret).toBe('api-secret');
  });

  it('should throw when CLOUDINARY_CLOUD_NAME is missing', () => {
    delete process.env.CLOUDINARY_CLOUD_NAME;
    process.env.CLOUDINARY_API_KEY = 'api-key';
    process.env.CLOUDINARY_API_SECRET = 'api-secret';

    expect(() => validateCloudinaryEnv()).toThrow('CLOUDINARY_CLOUD_NAME');
  });

  it('should throw when CLOUDINARY_API_KEY is missing', () => {
    process.env.CLOUDINARY_CLOUD_NAME = 'my-cloud';
    delete process.env.CLOUDINARY_API_KEY;
    process.env.CLOUDINARY_API_SECRET = 'api-secret';

    expect(() => validateCloudinaryEnv()).toThrow('CLOUDINARY_API_KEY');
  });

  it('should throw when CLOUDINARY_API_SECRET is missing', () => {
    process.env.CLOUDINARY_CLOUD_NAME = 'my-cloud';
    process.env.CLOUDINARY_API_KEY = 'api-key';
    delete process.env.CLOUDINARY_API_SECRET;

    expect(() => validateCloudinaryEnv()).toThrow('CLOUDINARY_API_SECRET');
  });
});

describe('REQUIRED_ENV_VARS', () => {
  it('should contain all required environment variables', () => {
    expect(REQUIRED_ENV_VARS).toContain('MONGODB_URI');
    expect(REQUIRED_ENV_VARS).toContain('AUTH_SECRET');
    expect(REQUIRED_ENV_VARS).toContain('ADMIN_PASSWORD');
    expect(REQUIRED_ENV_VARS).toContain('CLOUDINARY_CLOUD_NAME');
    expect(REQUIRED_ENV_VARS).toContain('CLOUDINARY_API_KEY');
    expect(REQUIRED_ENV_VARS).toContain('CLOUDINARY_API_SECRET');
  });

  it('should be an array', () => {
    expect(Array.isArray(REQUIRED_ENV_VARS)).toBe(true);
  });

  it('should have correct number of required variables', () => {
    expect(REQUIRED_ENV_VARS.length).toBe(6);
  });
});
