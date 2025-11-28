import { describe, it, expect } from 'vitest';
import { formatLastSeen, formatDateTime } from './formatters';

describe('formatters', () => {
  describe('formatLastSeen', () => {
    it('should format recent time as "Just now"', () => {
      const now = new Date().toISOString();
      expect(formatLastSeen(now)).toBe('Just now');
    });

    it('should format time in minutes', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      expect(formatLastSeen(fiveMinutesAgo)).toBe('5 minutes ago');
    });

    it('should format time in hours', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
      expect(formatLastSeen(twoHoursAgo)).toBe('2 hours ago');
    });

    it('should format time in days', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
      expect(formatLastSeen(threeDaysAgo)).toBe('3 days ago');
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time correctly', () => {
      const date = new Date('2025-11-18T09:30:00Z');
      const formatted = formatDateTime(date.toISOString());
      
      // Format should include date and time
      expect(formatted).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
      expect(formatted).toMatch(/\d{1,2}:\d{2}/);
      expect(formatted).toMatch(/(AM|PM)/);
    });

    it('should handle invalid date gracefully', () => {
      const result = formatDateTime('invalid-date');
      expect(result).toBe('Invalid Date');
    });
  });
});
