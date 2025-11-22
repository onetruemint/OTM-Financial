import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create rate limiter only if Upstash credentials are configured
function createRatelimit() {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!upstashUrl || !upstashToken) {
    // Return null if not configured - rate limiting will be skipped
    return null;
  }

  const redis = new Redis({
    url: upstashUrl,
    token: upstashToken,
  });

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
    analytics: true,
  });
}

export const ratelimit = createRatelimit();

// Helper to get client identifier
export function getClientId(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'anonymous';
  return ip;
}
