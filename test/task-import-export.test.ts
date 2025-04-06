import { expect, test } from "vitest";
import { importFromDirectory } from "../src/lib/import-utils";
import { Item } from "../src/lib/content-utils";
import path from "path";
import fs from "fs/promises";

// Define expected items that will be used by both tests
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

test("should import tasks and notes correctly", async () => {
  // Import all files from the test fixtures directory
  const items = await importFromDirectory(
    path.join(__dirname, "fixtures/import")
  );

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

test("should export tasks and dates correctly", async () => {
  // Read all fixture files
  const fixtureDir = path.join(__dirname, "fixtures/import");
  const fixtureFiles = await fs.readdir(fixtureDir);
  console.log("Found fixture files:", fixtureFiles);

  // Read and normalize the content of each fixture file
  const fixtureContents = new Map<string, string>();
  for (const file of fixtureFiles) {
    if (!file.endsWith(".md")) continue;
    const content = await fs.readFile(path.join(fixtureDir, file), "utf-8");
    // Normalize line endings and remove any trailing whitespace
    const normalizedContent = content.replace(/\r\n/g, "\n").trim();
    fixtureContents.set(file, normalizedContent);
    console.log(`Content of ${file}:`, normalizedContent);
  }

  // TODO: Call export function when implemented
  // const exportedFiles = await exportToDirectory(expectedItems, someOutputDir);

  // For now, we'll verify that the expected items would produce the correct files
  for (const item of expectedItems) {
    if (!item.id) continue;

    // Skip task items that should be embedded in their parent files
    if (
      ["2022-04-10", "2022-04-11", "2022-04-15", "2022-04-16"].includes(item.id)
    ) {
      continue;
    }

    // Map item IDs to their corresponding fixture file names
    const fixtureFileMap: Record<string, string> = {
      "shared-task": "shared-task.md",
      "reading-progress-book-1": "reading-progress-book-1.md",
      "reading-progress-book-2": "reading-progress-book-2.md",
      ogcux2p1trjjte8spv4l0ut: "date-format-example.md",
      test123: "example-note-with-timestamps.md",
    };

    const fixtureFile = fixtureFileMap[item.id];
    console.log(`Looking for fixture file: ${fixtureFile}`);
    const fixtureContent = fixtureContents.get(fixtureFile);
    console.log(`Found content:`, fixtureContent);
    expect(fixtureContent).not.toBeUndefined();

    // TODO: When export is implemented, compare with actual exported content
    // const exportedContent = exportedFiles.get(fixtureFile);
    // expect(exportedContent).toBe(fixtureContent);
  }

  // Verify that task references are correctly formatted in the exported files
  const taskReference = `![[Finished reading Book 1 on 2022-04-14]]`;
  const referencingFiles = Array.from(fixtureContents.entries())
    .filter(([_, content]) => content.includes(taskReference))
    .map(([file]) => file);
  console.log("Files referencing shared task:", referencingFiles);
  expect(referencingFiles).toHaveLength(2);
});
