/**
 * Simple in-memory rate limiter for widget refresh endpoints
 * Prevents excessive API calls and credit consumption
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface WidgetRefreshEntry {
  lastRefresh: number;
  totalRefreshes: number;
}

class RateLimiter {
  private ipLimits = new Map<string, RateLimitEntry>();
  private sessionLimits = new Map<string, RateLimitEntry>();
  private widgetLimits = new Map<string, WidgetRefreshEntry>();

  /**
   * Check if an IP can make a refresh request
   * Limit: 100 refreshes per hour per IP
   */
  checkIPLimit(ip: string): boolean {
    const now = Date.now();
    const entry = this.ipLimits.get(ip);

    if (!entry || now > entry.resetAt) {
      this.ipLimits.set(ip, {
        count: 1,
        resetAt: now + 60 * 60 * 1000, // 1 hour
      });
      return true;
    }

    if (entry.count >= 100) {
      return false;
    }

    entry.count++;
    return true;
  }

  /**
   * Check if a session can make a refresh request
   * Limit: 20 refreshes per session
   */
  checkSessionLimit(sessionId: string): boolean {
    const now = Date.now();
    const entry = this.sessionLimits.get(sessionId);

    if (!entry) {
      this.sessionLimits.set(sessionId, {
        count: 1,
        resetAt: now + 24 * 60 * 60 * 1000, // 24 hours
      });
      return true;
    }

    if (entry.count >= 20) {
      return false;
    }

    entry.count++;
    return true;
  }

  /**
   * Check if a widget can be refreshed
   * Limits:
   * - Min 5 seconds between refreshes
   * - Max 50 total refreshes per widget
   */
  checkWidgetLimit(widgetId: string): { allowed: boolean; reason?: string } {
    const now = Date.now();
    const entry = this.widgetLimits.get(widgetId);

    if (!entry) {
      this.widgetLimits.set(widgetId, {
        lastRefresh: now,
        totalRefreshes: 1,
      });
      return { allowed: true };
    }

    // Check minimum interval (5 seconds)
    if (now - entry.lastRefresh < 5000) {
      return {
        allowed: false,
        reason: 'Too soon - minimum 5 seconds between refreshes',
      };
    }

    // Check maximum total refreshes (50)
    if (entry.totalRefreshes >= 50) {
      return {
        allowed: false,
        reason: 'Widget refresh limit reached (50 refreshes)',
      };
    }

    entry.lastRefresh = now;
    entry.totalRefreshes++;
    return { allowed: true };
  }

  /**
   * Clean up old entries periodically to prevent memory leaks
   */
  cleanup() {
    const now = Date.now();

    // Clean up IP limits
    for (const [ip, entry] of this.ipLimits.entries()) {
      if (now > entry.resetAt) {
        this.ipLimits.delete(ip);
      }
    }

    // Clean up session limits
    for (const [sessionId, entry] of this.sessionLimits.entries()) {
      if (now > entry.resetAt) {
        this.sessionLimits.delete(sessionId);
      }
    }

    // Widget limits don't expire - they're per-widget-instance
  }

  /**
   * Get remaining refresh count for a widget
   */
  getRemainingRefreshes(widgetId: string): number {
    const entry = this.widgetLimits.get(widgetId);
    if (!entry) return 50;
    return Math.max(0, 50 - entry.totalRefreshes);
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

// Clean up every 5 minutes
setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000);

