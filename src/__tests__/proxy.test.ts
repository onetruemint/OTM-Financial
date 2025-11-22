// Mock auth
const mockAuth = jest.fn();

jest.mock('@/lib/auth', () => ({
  auth: mockAuth,
}));

// Mock NextResponse
const mockRedirect = jest.fn();
const mockNext = jest.fn();

jest.mock('next/server', () => ({
  NextResponse: {
    redirect: mockRedirect,
    next: mockNext,
  },
}));

import { proxy, config } from '../proxy';
import { NextRequest } from 'next/server';

// Create a mock NextRequest
function createMockRequest(pathname: string): NextRequest {
  const url = new URL(`http://localhost${pathname}`);
  return {
    nextUrl: {
      pathname,
    },
    url: url.toString(),
    headers: new Headers(),
  } as unknown as NextRequest;
}

describe('proxy middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('unauthenticated users', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue(null);
    });

    it('should redirect to login when accessing admin pages', async () => {
      const request = createMockRequest('/admin/dashboard');

      await proxy(request);

      expect(mockRedirect).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: '/admin/login',
        })
      );
    });

    it('should allow access to login page', async () => {
      const request = createMockRequest('/admin/login');

      await proxy(request);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRedirect).not.toHaveBeenCalled();
    });
  });

  describe('authenticated users', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({ user: { id: '123', email: 'test@test.com' } });
    });

    it('should allow access to admin pages', async () => {
      const request = createMockRequest('/admin/dashboard');

      await proxy(request);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should redirect from login page to admin', async () => {
      const request = createMockRequest('/admin/login');

      await proxy(request);

      expect(mockRedirect).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: '/admin',
        })
      );
    });
  });

  describe('headers', () => {
    beforeEach(() => {
      mockAuth.mockResolvedValue({ user: { id: '123' } });
      mockNext.mockReturnValue({ headers: new Headers() });
    });

    it('should set x-pathname header', async () => {
      const request = createMockRequest('/admin/posts');

      await proxy(request);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          request: expect.objectContaining({
            headers: expect.any(Headers),
          }),
        })
      );
    });
  });
});

describe('proxy config', () => {
  it('should have matcher for admin routes', () => {
    expect(config.matcher).toContain('/admin/:path*');
  });
});
