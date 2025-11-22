// Mock dependencies before importing the module
const mockConnect = jest.fn();
const mockDisconnect = jest.fn();
const mockDeleteMany = jest.fn();
const mockCreate = jest.fn();

jest.mock('mongoose', () => {
  const mockModel = {
    deleteMany: mockDeleteMany,
    create: mockCreate,
  };

  const MockSchema = jest.fn(() => ({}));
  (MockSchema as any).Types = { ObjectId: 'ObjectId' };

  return {
    connect: mockConnect,
    disconnect: mockDisconnect,
    model: jest.fn(() => mockModel),
    models: {},
    Schema: MockSchema,
  };
});

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

describe('seed.ts', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let processExitSpy: jest.SpyInstance;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };

    // Clear all mocks
    jest.clearAllMocks();

    // Setup console spies
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Mock process.exit to not throw
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);

    // Setup default mock returns
    mockConnect.mockResolvedValue(undefined);
    mockDisconnect.mockResolvedValue(undefined);
    mockDeleteMany.mockResolvedValue({ deletedCount: 0 });
    mockCreate.mockImplementation((data) => {
      if (Array.isArray(data)) {
        return Promise.resolve(data.map((item, i) => ({ ...item, _id: `id${i}` })));
      }
      return Promise.resolve({ ...data, _id: 'id1' });
    });
  });

  afterEach(() => {
    // Restore environment
    process.env = originalEnv;
    // Restore spies
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
    // Reset modules to clear cached imports
    jest.resetModules();
  });

  describe('MONGODB_URI validation', () => {
    it('should throw if MONGODB_URI is not defined', async () => {
      // Clear MONGODB_URI
      delete process.env.MONGODB_URI;

      // Import should throw
      await expect(async () => {
        await jest.isolateModulesAsync(async () => {
          await import('../seed');
        });
      }).rejects.toThrow('MONGODB_URI');
    });
  });

  describe('seed execution', () => {
    beforeEach(() => {
      // Set MONGODB_URI for all tests
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
    });

    it('should connect and seed successfully', async () => {
      let seedPromise: Promise<void>;

      await jest.isolateModulesAsync(async () => {
        // Import the module - this triggers seed()
        await import('../seed');

        // The seed function runs async, wait for it
        await new Promise(resolve => setImmediate(resolve));
      });

      // Verify mongoose.connect was called
      expect(mockConnect).toHaveBeenCalledWith('mongodb://localhost:27017/test');
    });

    it('should delete existing data', async () => {
      await jest.isolateModulesAsync(async () => {
        await import('../seed');
        await new Promise(resolve => setImmediate(resolve));
      });

      // deleteMany should be called for each model
      expect(mockDeleteMany).toHaveBeenCalled();
    });

    it('should create author, categories, tags, and posts', async () => {
      await jest.isolateModulesAsync(async () => {
        await import('../seed');
        await new Promise(resolve => setImmediate(resolve));
      });

      // create should be called for each type of data
      expect(mockCreate).toHaveBeenCalled();
    });

    it('should disconnect and exit', async () => {
      await jest.isolateModulesAsync(async () => {
        await import('../seed');
        await new Promise(resolve => setImmediate(resolve));
      });

      expect(mockDisconnect).toHaveBeenCalled();
      expect(processExitSpy).toHaveBeenCalledWith(0);
    });

    it('should log progress messages', async () => {
      await jest.isolateModulesAsync(async () => {
        await import('../seed');
        await new Promise(resolve => setImmediate(resolve));
      });

      expect(consoleLogSpy).toHaveBeenCalledWith('Connected to MongoDB');
      expect(consoleLogSpy).toHaveBeenCalledWith('Cleared existing data');
      expect(consoleLogSpy).toHaveBeenCalledWith('Created author');
      expect(consoleLogSpy).toHaveBeenCalledWith('Created categories');
      expect(consoleLogSpy).toHaveBeenCalledWith('Created tags');
      expect(consoleLogSpy).toHaveBeenCalledWith('Created posts');
    });

    it('should show success message', async () => {
      await jest.isolateModulesAsync(async () => {
        await import('../seed');
        await new Promise(resolve => setImmediate(resolve));
      });

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Seed completed successfully'));
    });

    it('should handle connection errors', async () => {
      mockConnect.mockRejectedValue(new Error('Connection failed'));

      await jest.isolateModulesAsync(async () => {
        await import('../seed');
        await new Promise(resolve => setImmediate(resolve));
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error seeding database:',
        expect.any(Error)
      );
    });

    it('should handle deletion errors', async () => {
      mockDeleteMany.mockRejectedValue(new Error('Delete failed'));

      await jest.isolateModulesAsync(async () => {
        await import('../seed');
        await new Promise(resolve => setImmediate(resolve));
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error seeding database:',
        expect.any(Error)
      );
    });

    it('should handle creation errors', async () => {
      mockCreate.mockRejectedValue(new Error('Create failed'));

      await jest.isolateModulesAsync(async () => {
        await import('../seed');
        await new Promise(resolve => setImmediate(resolve));
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error seeding database:',
        expect.any(Error)
      );
    });
  });
});
