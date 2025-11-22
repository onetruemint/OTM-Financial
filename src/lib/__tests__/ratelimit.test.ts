// Mock the Upstash modules before importing
jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('@upstash/ratelimit', () => {
  const mockRatelimit = jest.fn().mockImplementation(() => ({
    limit: jest.fn(),
  })) as jest.Mock & {
    slidingWindow: jest.Mock;
  };
  mockRatelimit.slidingWindow = jest.fn().mockReturnValue('slidingWindow');
  return {
    Ratelimit: mockRatelimit,
  };
});

import { getClientId } from '../ratelimit';

describe('getClientId', () => {
  it('should extract IP from x-forwarded-for header', () => {
    const request = new Request('http://localhost', {
      headers: {
        'x-forwarded-for': '192.168.1.1',
      },
    });
    expect(getClientId(request)).toBe('192.168.1.1');
  });

  it('should extract first IP when multiple IPs in x-forwarded-for', () => {
    const request = new Request('http://localhost', {
      headers: {
        'x-forwarded-for': '192.168.1.1, 10.0.0.1, 172.16.0.1',
      },
    });
    expect(getClientId(request)).toBe('192.168.1.1');
  });

  it('should trim whitespace from IP', () => {
    const request = new Request('http://localhost', {
      headers: {
        'x-forwarded-for': '  192.168.1.1  ',
      },
    });
    expect(getClientId(request)).toBe('192.168.1.1');
  });

  it('should return anonymous when no x-forwarded-for header', () => {
    const request = new Request('http://localhost');
    expect(getClientId(request)).toBe('anonymous');
  });
});

describe('ratelimit', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return null when Upstash credentials are not configured', () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;

    // Re-import to get fresh module
    jest.isolateModules(() => {
      const { ratelimit } = require('../ratelimit');
      expect(ratelimit).toBeNull();
    });
  });

  it('should create ratelimiter when credentials are configured', () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://redis.upstash.io';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'token123';

    jest.isolateModules(() => {
      const { ratelimit } = require('../ratelimit');
      expect(ratelimit).not.toBeNull();
    });
  });
});
