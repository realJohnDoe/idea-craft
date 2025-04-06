import { expect, test } from 'vitest';
import { importFromDirectory } from '../src/lib/import-utils';
import path from 'path';

test('should import tasks correctly', async () => {
  // Import all files from the test fixtures directory
  const items = await importFromDirectory(
    path.join(__dirname, 'fixtures/import')
  );

  // Find the shared task
  const sharedTask = items.find(
    item => item.title === 'Finished reading Book 1 on 2022-04-14'
  );
  expect(sharedTask).not.toBeUndefined();
  expect(sharedTask?.done).toBe(true);
  expect(sharedTask?.content).toBe('This task is shared between multiple notes because it represents finishing Book 1, which is relevant to both reading progress notes.');

  // Find the notes that reference the shared task
  const uniqueTaskNote = items.find(
    item => item.title === 'Reading Progress - Book 1'
  );
  const noteWithSharedTask = items.find(
    item => item.title === 'Reading Progress - Book 2'
  );

  expect(uniqueTaskNote).not.toBeUndefined();
  expect(noteWithSharedTask).not.toBeUndefined();

  // Verify both notes reference the shared task by its title
  const taskReference = `![[Finished reading Book 1 on 2022-04-14]]`;
  expect(uniqueTaskNote?.content).toContain(taskReference);
  expect(noteWithSharedTask?.content).toContain(taskReference);

  // Verify the unique tasks are embedded
  const embeddedTasks = uniqueTaskNote!.content.match(/-\s*\[(x| )\]\s*.*/g);
  expect(embeddedTasks).toHaveLength(2); // All non-shared tasks should be embedded
});

test('should export tasks correctly', async () => {
  // This test will verify that:
  // 1. Tasks that are only mentioned in one note are embedded in that note
  // 2. Tasks that are mentioned in multiple notes are exported as separate files
  // 3. Notes that reference shared tasks use the ![[...]] syntax with the task's title
  // We'll implement this after the import functionality is working
}); 