// Store the config for testing
let capturedConfig: any = null;

// Mock the modules before importing
jest.mock('next-auth', () => {
  return jest.fn((config: any) => {
    capturedConfig = config;
    return {
      handlers: { GET: jest.fn(), POST: jest.fn() },
      signIn: jest.fn(),
      signOut: jest.fn(),
      auth: jest.fn(),
    };
  });
});

jest.mock('next-auth/providers/credentials', () => ({
  __esModule: true,
  default: jest.fn((config) => config),
}));

jest.mock('@/lib/mongodb', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(undefined),
}));

const mockFindOne = jest.fn();
const mockFindByIdAndUpdate = jest.fn();

jest.mock('@/models', () => ({
  AdminUser: {
    findOne: mockFindOne,
    findByIdAndUpdate: mockFindByIdAndUpdate,
  },
}));

describe('auth configuration', () => {
  beforeAll(async () => {
    // Import once to capture config
    await import('../auth');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should export auth functions', async () => {
    const authModule = await import('../auth');

    expect(authModule.handlers).toBeDefined();
    expect(authModule.signIn).toBeDefined();
    expect(authModule.signOut).toBeDefined();
    expect(authModule.auth).toBeDefined();
  });

  it('should configure NextAuth with credentials provider', () => {
    expect(capturedConfig).not.toBeNull();
    expect(capturedConfig.providers).toBeDefined();
    expect(capturedConfig.providers.length).toBe(1);
  });

  it('should configure custom sign-in page', () => {
    expect(capturedConfig.pages.signIn).toBe('/admin/login');
  });

  it('should use JWT session strategy', () => {
    expect(capturedConfig.session.strategy).toBe('jwt');
  });

  describe('authorize callback', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return null for missing credentials', async () => {
      const result = await capturedConfig.providers[0].authorize({});
      expect(result).toBeNull();
    });

    it('should return null for missing email', async () => {
      const result = await capturedConfig.providers[0].authorize({ password: 'test' });
      expect(result).toBeNull();
    });

    it('should return null for missing password', async () => {
      const result = await capturedConfig.providers[0].authorize({ email: 'test@test.com' });
      expect(result).toBeNull();
    });

    it('should return null when user not found', async () => {
      mockFindOne.mockReturnValue({
        select: () => ({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      const result = await capturedConfig.providers[0].authorize({
        email: 'test@test.com',
        password: 'password',
      });

      expect(result).toBeNull();
    });

    it('should return null for invalid password', async () => {
      const mockUser = {
        _id: { toString: () => '123' },
        email: 'test@test.com',
        name: 'Test',
        role: 'admin',
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      mockFindOne.mockReturnValue({
        select: () => ({
          exec: jest.fn().mockResolvedValue(mockUser),
        }),
      });

      const result = await capturedConfig.providers[0].authorize({
        email: 'test@test.com',
        password: 'wrong',
      });

      expect(result).toBeNull();
    });

    it('should return user object for valid credentials', async () => {
      const mockUser = {
        _id: { toString: () => '123' },
        email: 'test@test.com',
        name: 'Test User',
        role: 'admin',
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      mockFindOne.mockReturnValue({
        select: () => ({
          exec: jest.fn().mockResolvedValue(mockUser),
        }),
      });

      mockFindByIdAndUpdate.mockResolvedValue(undefined);

      const result = await capturedConfig.providers[0].authorize({
        email: 'test@test.com',
        password: 'correct',
      });

      expect(result).toEqual({
        id: '123',
        email: 'test@test.com',
        name: 'Test User',
        role: 'admin',
      });
    });

    it('should update last login on successful auth', async () => {
      const mockUser = {
        _id: { toString: () => '123' },
        email: 'test@test.com',
        name: 'Test',
        role: 'admin',
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      mockFindOne.mockReturnValue({
        select: () => ({
          exec: jest.fn().mockResolvedValue(mockUser),
        }),
      });

      mockFindByIdAndUpdate.mockResolvedValue(undefined);

      await capturedConfig.providers[0].authorize({
        email: 'test@test.com',
        password: 'correct',
      });

      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
        mockUser._id,
        expect.objectContaining({ lastLogin: expect.any(Date) })
      );
    });

    it('should return null on error', async () => {
      mockFindOne.mockReturnValue({
        select: () => ({
          exec: jest.fn().mockRejectedValue(new Error('DB Error')),
        }),
      });

      const result = await capturedConfig.providers[0].authorize({
        email: 'test@test.com',
        password: 'password',
      });

      expect(result).toBeNull();
    });
  });

  describe('callbacks', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('jwt callback', () => {
      it('should add user info to token on login', async () => {
        const token = {};
        const user = { id: '123', role: 'admin' };

        const result = await capturedConfig.callbacks.jwt({ token, user });

        expect(result.id).toBe('123');
        expect(result.role).toBe('admin');
      });

      it('should return token unchanged without user', async () => {
        const token = { existing: 'data' };

        const result = await capturedConfig.callbacks.jwt({ token, user: undefined });

        expect(result).toEqual(token);
      });
    });

    describe('session callback', () => {
      it('should add token info to session', async () => {
        const session = { user: {} };
        const token = { id: '123', role: 'admin' };

        const result = await capturedConfig.callbacks.session({ session, token });

        expect(result.user.id).toBe('123');
        expect((result.user as any).role).toBe('admin');
      });

      it('should handle missing user in session', async () => {
        const session = {};
        const token = { id: '123', role: 'admin' };

        const result = await capturedConfig.callbacks.session({ session, token });

        expect(result).toEqual(session);
      });
    });
  });
});
