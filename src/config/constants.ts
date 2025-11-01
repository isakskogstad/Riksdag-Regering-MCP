/**
 * Application-wide configuration constants
 * Centralized place for magic numbers and strings to improve maintainability
 */

export const PAGINATION = {
  /** Number of items displayed per page in document lists */
  ITEMS_PER_PAGE: 20,
  /** Maximum pages to process per execution in Edge Functions */
  MAX_PAGES_PER_EXECUTION: 20,
  /** Default page size for API requests */
  API_PAGE_SIZE: 500,
} as const;

export const SEARCH = {
  /** Debounce delay in milliseconds for search inputs */
  DEBOUNCE_DELAY: 300,
  /** Minimum characters before triggering search */
  MIN_SEARCH_LENGTH: 2,
} as const;

export const API = {
  /** Retry attempts for failed requests */
  MAX_RETRIES: 3,
  /** Timeout in milliseconds for API requests */
  TIMEOUT_MS: 30000,
  /** Delay between requests to avoid rate limiting (ms) */
  RATE_LIMIT_DELAY: 1000,
  /** Maximum exponential backoff delay (ms) */
  MAX_BACKOFF_DELAY: 10000,
} as const;

export const CACHE = {
  /** Default stale time for React Query cache (ms) */
  STALE_TIME: 1000 * 60 * 5, // 5 minutes
  /** Cache time for React Query (ms) */
  CACHE_TIME: 1000 * 60 * 30, // 30 minutes
} as const;

export const FILE_QUEUE = {
  /** Batch size for file downloads */
  BATCH_SIZE: 100,
  /** Maximum retry attempts for file downloads */
  MAX_RETRY_ATTEMPTS: 3,
} as const;

export const STORAGE = {
  /** Maximum file size for riksdagen-images bucket (bytes) */
  RIKSDAGEN_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  /** Maximum file size for regeringskansliet-files bucket (bytes) */
  REGERINGSKANSLIET_MAX_SIZE: 50 * 1024 * 1024, // 50MB
} as const;

export const REFRESH_INTERVALS = {
  /** Refresh interval for activity stream (ms) */
  ACTIVITY_STREAM: 5000,
  /** Refresh interval for progress tracker (ms) */
  PROGRESS_TRACKER: 3000,
  /** Refresh interval for storage stats (ms) */
  STORAGE_STATS: 60000,
  /** Refresh interval for file queue (ms) */
  FILE_QUEUE: 10000,
} as const;

export const RIKSDAGEN_API = {
  /** Base URL for Riksdagen's open data API */
  BASE_URL: 'https://data.riksdagen.se',
  /** Available endpoints */
  ENDPOINTS: {
    DOCUMENTS: '/dokumentlista/',
    MEMBERS: '/personlista/',
    SPEECHES: '/anforandelista/',
    VOTES: '/voteringlista/',
  },
} as const;

export const GOV_API = {
  /** Base URL for g0v.se government data API */
  BASE_URL: 'https://g0v.se',
} as const;

export const PARTY_CODES = {
  S: 'Socialdemokraterna',
  M: 'Moderaterna',
  SD: 'Sverigedemokraterna',
  C: 'Centerpartiet',
  V: 'Vänsterpartiet',
  KD: 'Kristdemokraterna',
  L: 'Liberalerna',
  MP: 'Miljöpartiet',
} as const;

export const DOCUMENT_TYPES = {
  PROP: 'Proposition',
  MOT: 'Motion',
  BET: 'Betänkande',
  IP: 'Interpellation',
} as const;
