/**
 * Format a time range for display
 * @param {string|Date} start - Start time
 * @param {string|Date} end - End time
 * @returns {string} Formatted time range (e.g., "9:00 AM–10:30 AM")
 */
export const formatTimeRange = (start, end) => {
  const s = new Date(start).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  const e = new Date(end).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${s}–${e}`;
};

/**
 * Format a date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date (e.g., "December 17, 2025")
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString([], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format a full date and time
 * @param {string|Date} dateTime - DateTime to format
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (dateTime) => {
  return new Date(dateTime).toLocaleString([], {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};
