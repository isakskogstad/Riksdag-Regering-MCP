/**
 * In-memory cache för MCP-server
 * LRU-baserad cache med TTL-support
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class Cache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private maxSize: number;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }

  /**
   * Lägg till eller uppdatera cache-entry
   * @param key - Cache-nyckel
   * @param data - Data att cacha
   * @param ttl - Time-to-live i millisekunder (default: 5 min)
   */
  set(key: string, data: T, ttl: number = 300000): void {
    // Ta bort äldsta entry om cache är full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Hämta data från cache
   * @param key - Cache-nyckel
   * @returns Data eller null om expired/inte finns
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Flytta entry till slutet (LRU)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.data;
  }

  /**
   * Ta bort entry från cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Rensa hela cachen
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Returnera antal entries i cachen
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Kollar om key finns och inte är expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Hämta cache-statistik
   */
  stats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      utilization: (this.cache.size / this.maxSize) * 100,
    };
  }
}
