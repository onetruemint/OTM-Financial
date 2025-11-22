// Mock mongoose before importing the module
const mockConnect = jest.fn();

jest.mock('mongoose', () => ({
  connect: mockConnect,
  models: {},
  model: jest.fn(),
}));

describe('dbConnect', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    mockConnect.mockReset();
    // Reset global mongoose cache
    (global as any).mongoose = undefined;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should throw error when MONGODB_URI is not defined', async () => {
    delete process.env.MONGODB_URI;

    const { default: dbConnect } = await import('../mongodb');

    await expect(dbConnect()).rejects.toThrow('Please define the MONGODB_URI environment variable');
  });

  it('should throw error for invalid URI format', async () => {
    process.env.MONGODB_URI = 'invalid-uri';

    const { default: dbConnect } = await import('../mongodb');

    await expect(dbConnect()).rejects.toThrow('MONGODB_URI must start with mongodb://');
  });

  it('should throw error for placeholder hostname', async () => {
    process.env.MONGODB_URI = 'mongodb+srv://user:pass@cluster.mongodb.net/db';

    const { default: dbConnect } = await import('../mongodb');

    await expect(dbConnect()).rejects.toThrow('placeholder hostname');
  });

  it('should connect with valid mongodb:// URI', async () => {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';

    const mockMongoose = { connection: { readyState: 1 } };
    mockConnect.mockResolvedValue(mockMongoose);

    const { default: dbConnect } = await import('../mongodb');
    const result = await dbConnect();

    expect(mockConnect).toHaveBeenCalledWith(
      'mongodb://localhost:27017/test',
      expect.objectContaining({
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      })
    );
    expect(result).toBe(mockMongoose);
  });

  it('should connect with valid mongodb+srv:// URI', async () => {
    process.env.MONGODB_URI = 'mongodb+srv://user:pass@cluster0.abc123.mongodb.net/test';

    const mockMongoose = { connection: { readyState: 1 } };
    mockConnect.mockResolvedValue(mockMongoose);

    const { default: dbConnect } = await import('../mongodb');
    const result = await dbConnect();

    expect(mockConnect).toHaveBeenCalled();
    expect(result).toBe(mockMongoose);
  });

  it('should return cached connection on subsequent calls', async () => {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';

    const mockMongoose = { connection: { readyState: 1 } };
    mockConnect.mockResolvedValue(mockMongoose);

    const { default: dbConnect } = await import('../mongodb');

    const result1 = await dbConnect();
    const result2 = await dbConnect();

    expect(mockConnect).toHaveBeenCalledTimes(1);
    expect(result1).toBe(result2);
  });

  it('should handle ENOTFOUND errors with helpful message', async () => {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';

    const error = new Error('getaddrinfo ENOTFOUND') as any;
    error.code = 'ENOTFOUND';
    mockConnect.mockRejectedValue(error);

    const { default: dbConnect } = await import('../mongodb');

    await expect(dbConnect()).rejects.toThrow('DNS resolution failed');
  });

  it('should reset promise on connection error', async () => {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/test';

    const error = new Error('Connection failed');
    mockConnect.mockRejectedValueOnce(error);

    const { default: dbConnect } = await import('../mongodb');

    await expect(dbConnect()).rejects.toThrow('Connection failed');

    // Verify promise was reset by checking that a new connection attempt would work
    const mockMongoose = { connection: { readyState: 1 } };
    mockConnect.mockResolvedValueOnce(mockMongoose);

    const result = await dbConnect();
    expect(result).toBe(mockMongoose);
  });
});
