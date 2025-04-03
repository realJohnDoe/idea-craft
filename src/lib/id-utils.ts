
/**
 * Utility functions for generating and managing IDs
 */

/**
 * Generates a unique ID based on the current timestamp and a random number
 * @returns A unique string ID
 */
export function generateUniqueId(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

/**
 * Creates a safe filename from a title by removing special characters
 * @param title The original title
 * @returns A filename-safe version of the title
 */
export function createSafeFilename(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/[\s_-]+/g, "-") // Replace spaces with dashes
    .replace(/^-+|-+$/g, ""); // Trim dashes
}
