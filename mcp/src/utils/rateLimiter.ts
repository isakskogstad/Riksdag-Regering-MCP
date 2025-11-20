/**
 * Rate limiter för API-anrop
 * Token bucket algorithm för att begränsa API-requests
 */

export class RateLimiter {
  private tokens: number;
  private maxTokens: number;
  private refillRate: number;
  private lastRefill: number;

  /**
   * @param maxTokens - Max antal requests som tillåts
   * @param refillInterval - Tidsintervall för att fylla på tokens (ms)
   */
  constructor(maxTokens: number, refillInterval: number) {
    this.maxTokens = maxTokens;
    this.tokens = maxTokens;
    this.refillRate = maxTokens / refillInterval;
    this.lastRefill = Date.now();
  }

  private refill() {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd = elapsed * this.refillRate;

    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  async waitForToken(): Promise<void> {
    this.refill();

    if (this.tokens < 1) {
      const waitTime = (1 - this.tokens) / this.refillRate;
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.refill();
    }

    this.tokens -= 1;
  }

  /**
   * Kollar om det finns tillgängliga tokens utan att vänta
   */
  hasToken(): boolean {
    this.refill();
    return this.tokens >= 1;
  }

  /**
   * Återställ rate limiter
   */
  reset(): void {
    this.tokens = this.maxTokens;
    this.lastRefill = Date.now();
  }
}
