import { describe, expect, it, test } from "vitest";
import { importFromDirectory } from "../src/lib/import-utils";
import { Item } from "../src/lib/content-utils";
import path from "path";

test("should import tasks and notes correctly", async () => {
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
    // Date format test cases
    {
      id: "ogcux2p1trjjte8spv4l0ut",
      title: "Example Note with Date Format",
      content: "This is the content of the example note.",
      createdAt: new Date("2025-03-23"),
      updatedAt: new Date("2025-04-05"),
    },
    {
      id: "test123",
      title: "Example Note with Timestamps",
      content: "This is a test file with Unix timestamps.",
      createdAt: new Date(1647369160604),
      updatedAt: new Date(1647369185498),
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
    if (expected.createdAt) {
      expect(item?.createdAt).toBeDefined();
      // Compare dates using toLocaleDateString to handle timezone differences
      expect(item?.createdAt.toLocaleDateString("en-CA")).toBe(
        expected.createdAt.toLocaleDateString("en-CA")
      );
    }
    if (expected.updatedAt) {
      expect(item?.updatedAt).toBeDefined();
      // Compare dates using toLocaleDateString to handle timezone differences
      expect(item?.updatedAt.toLocaleDateString("en-CA")).toBe(
        expected.updatedAt.toLocaleDateString("en-CA")
      );
    }
  }

  // Verify the shared task is referenced by both notes
  const taskReference = `![[Finished reading Book 1 on 2022-04-14]]`;
  const referencingNotes = items.filter((item) =>
    item.content.includes(taskReference)
  );
  expect(referencingNotes).toHaveLength(2);

  // Verify task dates match their parent files
  const book1 = items.find((i) => i.id === "reading-progress-book-1");
  const book2 = items.find((i) => i.id === "reading-progress-book-2");

  // Tasks from book 1
  const task1 = items.find((i) => i.id === "2022-04-10");
  const task2 = items.find((i) => i.id === "2022-04-11");
  expect(task1?.createdAt.toLocaleDateString("en-CA")).toEqual(
    book1?.createdAt.toLocaleDateString("en-CA")
  );
  expect(task1?.updatedAt.toLocaleDateString("en-CA")).toEqual(
    book1?.updatedAt.toLocaleDateString("en-CA")
  );
  expect(task2?.createdAt.toLocaleDateString("en-CA")).toEqual(
    book1?.createdAt.toLocaleDateString("en-CA")
  );
  expect(task2?.updatedAt.toLocaleDateString("en-CA")).toEqual(
    book1?.updatedAt.toLocaleDateString("en-CA")
  );

  // Tasks from book 2
  const task3 = items.find((i) => i.id === "2022-04-15");
  const task4 = items.find((i) => i.id === "2022-04-16");
  expect(task3?.createdAt.toLocaleDateString("en-CA")).toEqual(
    book2?.createdAt.toLocaleDateString("en-CA")
  );
  expect(task3?.updatedAt.toLocaleDateString("en-CA")).toEqual(
    book2?.updatedAt.toLocaleDateString("en-CA")
  );
  expect(task4?.createdAt.toLocaleDateString("en-CA")).toEqual(
    book2?.createdAt.toLocaleDateString("en-CA")
  );
  expect(task4?.updatedAt.toLocaleDateString("en-CA")).toEqual(
    book2?.updatedAt.toLocaleDateString("en-CA")
  );
});

test("should export tasks correctly", async () => {
  // This test will verify that:
  // 1. Tasks that are only mentioned in one note are embedded in that note
  // 2. Tasks that are mentioned in multiple notes are exported as separate files
  // 3. Notes that reference shared tasks use the ![[...]] syntax with the task's title
  // We'll implement this after the import functionality is working
});
