import { expect, test } from 'vitest';
import { parseContent } from '../src/lib/import-utils';
import { Item } from '../src/lib/content-utils';
import path from 'path';
import { promises as fs } from 'fs';

test('should import tasks correctly', async () => {
  // Read all test files
  const uniqueTaskContent = await fs.readFile(
    path.join(__dirname, 'fixtures/import/unique-task-note.md'),
    'utf-8'
  );
  const sharedTaskContent = await fs.readFile(
    path.join(__dirname, 'fixtures/import/shared-task.md'),
    'utf-8'
  );
  const noteWithSharedTaskContent = await fs.readFile(
    path.join(__dirname, 'fixtures/import/note-with-shared-task.md'),
    'utf-8'
  );

  // Parse all files
  const uniqueTaskNote = parseContent(uniqueTaskContent);
  const sharedTask = parseContent(sharedTaskContent);
  const noteWithSharedTask = parseContent(noteWithSharedTaskContent);

  // Verify the files were parsed correctly
  expect(uniqueTaskNote).not.toBeNull();
  expect(sharedTask).not.toBeNull();
  expect(noteWithSharedTask).not.toBeNull();

  // Verify the shared task has the correct properties
  expect(sharedTask?.title).toBe('Finished reading Book 1 on 2022-04-14');
  expect(sharedTask?.done).toBe(true);
  expect(sharedTask?.content).toBe('This task is shared between multiple notes because it represents finishing Book 1, which is relevant to both reading progress notes.');

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