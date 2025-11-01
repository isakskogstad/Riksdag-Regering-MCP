import { useCallback, useRef } from 'react';

/**
 * Custom hook that throttles a function call
 * Ensures function is called at most once per specified delay
 * Useful for rate-limiting API calls or expensive operations
 *
 * @param callback - The function to throttle
 * @param delay - Minimum delay between calls in milliseconds
 * @returns Throttled version of the callback
 *
 * @example
 * const handleScroll = useThrottle(() => {
 *   console.log('Scroll event');
 * }, 1000);
 *
 * window.addEventListener('scroll', handleScroll);
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastRun = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRun.current;

      if (timeSinceLastRun >= delay) {
        // Enough time has passed, execute immediately
        callback(...args);
        lastRun.current = now;
      } else {
        // Schedule execution after remaining time
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(
          () => {
            callback(...args);
            lastRun.current = Date.now();
          },
          delay - timeSinceLastRun
        );
      }
    },
    [callback, delay]
  );
}
