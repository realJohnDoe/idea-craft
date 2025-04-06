import { describe, it, expect } from 'vitest';
import { importFromDirectory } from '../src/lib/node-import-utils';
import path from 'path';

describe('ImportMarkdown', () => {
  describe('importFromDirectory', () => {
    it('should import a markdown file with YYYY-MM-DD dates correctly', async () => {
      // Get the path to our test fixture
      const testDir = path.join(__dirname, 'fixtures', 'import');
      
      // Import the file
      const items = await importFromDirectory(testDir);
      
      // Verify the imported item
      expect(items).toHaveLength(2); // We now have two test files
      
      const item = items.find(i => i.id === 'ogcux2p1trjjte8spv4l0ut');
      expect(item).toBeDefined();
      if (!item) return;
      
      expect(item.title).toBe('Example Note with Date Format');
      expect(item.content).toBe('This is the content of the example note.');
      expect(item.tags).toEqual([]);
      
      // Compare dates using toLocaleDateString to handle timezone differences
      expect(item.createdAt.toLocaleDateString('en-CA')).toBe('2025-03-23');
      expect(item.updatedAt.toLocaleDateString('en-CA')).toBe('2025-04-05');
    });

    it('should import a markdown file with Unix timestamps correctly', async () => {
      // Get the path to our test fixture
      const testDir = path.join(__dirname, 'fixtures', 'import');
      
      // Import the file
      const items = await importFromDirectory(testDir);
      
      // Verify the imported item
      expect(items).toHaveLength(2); // We now have two test files
      
      const item = items.find(i => i.id === 'test123');
      expect(item).toBeDefined();
      if (!item) return;
      
      expect(item.title).toBe('Example Note with Timestamps');
      expect(item.content).toBe('This is a test file with Unix timestamps.');
      expect(item.tags).toEqual([]);
      
      // Verify the dates are parsed correctly
      expect(item.createdAt.getTime()).toBe(1647369160604);
      expect(item.updatedAt.getTime()).toBe(1647369185498);
    });
  });
}); 