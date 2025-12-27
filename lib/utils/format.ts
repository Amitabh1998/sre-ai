/**
 * Formatting utilities
 */

import { formatDistanceToNow, format } from "date-fns";

/**
 * Format date to relative time (e.g., "2 minutes ago")
 */
export function formatRelativeTime(date: string | Date): string {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return "Unknown time";
  }
}

/**
 * Format date to readable format
 */
export function formatDate(
  date: string | Date,
  formatString: string = "MMM d, yyyy 'at' HH:mm"
): string {
  try {
    return format(new Date(date), formatString);
  } catch {
    return "Invalid date";
  }
}

/**
 * Format duration (e.g., "8 min", "1h 30m")
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

