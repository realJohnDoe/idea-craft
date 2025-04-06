import { expect, test } from "vitest";
import { importFromDirectory } from "../src/lib/import-utils";
import { Item } from "../src/lib/content-utils";
import path from "path";

test("should import tasks correctly", async () => {
  // Import all files from the test fixtures directory
  const items = await importFromDirectory(
    path.join(__dirname, "fixtures/import")
  );

  // Define expected items
  const expectedItems: Partial<Item>[] = [
    {
      id: "shared-task",
      title: "Finished reading Book 1 on 2022-04-14",
      content:
        "This task is shared between multiple notes because it represents finishing Book 1, which is relevant to both reading progress notes.",
      done: true,
    },
    {
      id: "reading-progress-book-1",
      title: "Reading Progress - Book 1",
      content: `- CW15:
- ![[2022-04-10]]
- ![[2022-04-11]]
  - ![[Finished reading Book 1 on 2022-04-14]]`,
    },
    {
      id: "reading-progress-book-2",
      title: "Reading Progress - Book 2",
      content: `- ![[Finished reading Book 1 on 2022-04-14]]
- ![[2022-04-15]]
- ![[2022-04-16]]`,
    },
    // Individual task items
    {
      id: "2022-04-10",
      title: "2022-04-10",
      done: true,
      content: "",
    },
    {
      id: "2022-04-11",
      title: "2022-04-11",
      done: true,
      content: "",
    },
    {
      id: "2022-04-15",
      title: "2022-04-15",
      done: true,
      content: "",
    },
    {
      id: "2022-04-16",
      title: "2022-04-16",
      done: true,
      content: "",
    },
  ];

  // Verify all expected items are present
  for (const expected of expectedItems) {
    const item = items.find((i) => i.id === expected.id);
    expect(item).not.toBeUndefined();

    // Verify properties match
    if (expected.title) expect(item?.title).toBe(expected.title);
    if (expected.done !== undefined) expect(item?.done).toBe(expected.done);
    if (expected.content) {
      // Normalize line endings before comparison
      const expectedContent = expected.content.replace(/\r\n/g, "\n");
      const actualContent = item?.content.replace(/\r\n/g, "\n");
      expect(actualContent).toBe(expectedContent);
    }
  }

  // Verify the shared task is referenced by both notes
  const taskReference = `![[Finished reading Book 1 on 2022-04-14]]`;
  const referencingNotes = items.filter((item) =>
    item.content.includes(taskReference)
  );
  expect(referencingNotes).toHaveLength(2);
});

test("should export tasks correctly", async () => {
  // This test will verify that:
  // 1. Tasks that are only mentioned in one note are embedded in that note
  // 2. Tasks that are mentioned in multiple notes are exported as separate files
  // 3. Notes that reference shared tasks use the ![[...]] syntax with the task's title
  // We'll implement this after the import functionality is working
});
