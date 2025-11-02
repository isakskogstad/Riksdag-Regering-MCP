/**
 * URL Helper Utilities
 * Handles conversion of relative URLs to absolute URLs for external links
 */

/**
 * Converts relative URLs to absolute URLs with proper domain
 *
 * @param url - The URL to convert (can be relative or absolute)
 * @param domain - The domain to prepend (default: regeringen.se)
 * @returns Absolute URL or null if input is invalid
 *
 * @example
 * getAbsoluteUrl('/pressmeddelanden/2025/10/...')
 * // Returns: 'https://www.regeringen.se/pressmeddelanden/2025/10/...'
 *
 * getAbsoluteUrl('https://example.com/...')
 * // Returns: 'https://example.com/...'
 */
export const getAbsoluteUrl = (
  url: string | null | undefined,
  domain: string = 'https://www.regeringen.se'
): string | null => {
  if (!url) return null;

  // If URL already starts with http:// or https://, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If URL starts with /, prepend domain
  if (url.startsWith('/')) {
    return `${domain}${url}`;
  }

  // Otherwise return the URL as-is
  return url;
};

/**
 * Check if a URL is external (not from regeringen.se or internal routes)
 */
export const isExternalUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
};
