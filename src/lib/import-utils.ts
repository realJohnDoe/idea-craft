import { Item } from "./content-utils";
import { generateUniqueId } from "./id-utils";
import yaml from "yaml";
import fs from "fs/promises";
import path from "path";

export const parseContent = (content: string): Item | null => {
  try {
    // Try to extract YAML front matter
    const frontMatterMatch = content.match(
      /^---\s*\n([\s\S]*?)\n---\s*(\n\s*)*([\s\S]*)$/
    );

    if (!frontMatterMatch) {
      console.error("No front matter found in markdown file");
      return null;
    }

    const frontMatter = frontMatterMatch[1];
    const markdownContent = frontMatterMatch[3].trim();

    // Parse the front matter as YAML
    const metadata = yaml.parse(frontMatter);

    // Clean up metadata values
    const cleanMetadata = Object.fromEntries(
      Object.entries(metadata).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    ) as {
      id?: string;
      title?: string;
      createdAt?: string;
      created?: string;
      updatedAt?: string;
      updated?: string;
      tags?: string[];
      done?: boolean | string;
      task?: { done?: boolean | string };
      event?: { date?: string; location?: string };
      mail?: { from?: string; to?: string };
    };

    // Helper function to parse date in local timezone
    const parseLocalDate = (dateStr: string | number): Date => {
      // If it's a number (Unix timestamp), convert it directly
      if (typeof dateStr === "number") {
        return new Date(dateStr);
      }

      // If it's an ISO string, parse it directly
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}T/)) {
        return new Date(dateStr);
      }

      // If it's a string in YYYY-MM-DD format, parse it
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateStr.split("-").map(Number);
        // Note: month is 0-based in JavaScript Date
        return new Date(year, month - 1, day);
      }

      // If it's a string timestamp, parse it as a number
      if (dateStr.match(/^\d+$/)) {
        return new Date(parseInt(dateStr, 10));
      }

      // Default to current date if format is unknown
      return new Date();
    };

    // Create basic item structure
    const item: Item = {
      id: cleanMetadata.id || generateUniqueId(),
      title: cleanMetadata.title || "Untitled",
      content: markdownContent,
      createdAt:
        cleanMetadata.createdAt || cleanMetadata.created
          ? parseLocalDate(cleanMetadata.createdAt || cleanMetadata.created)
          : new Date(),
      updatedAt:
        cleanMetadata.updatedAt || cleanMetadata.updated
          ? parseLocalDate(cleanMetadata.updatedAt || cleanMetadata.updated)
          : new Date(),
      tags: cleanMetadata.tags || [],
    };

    // Add task attributes
    if (cleanMetadata.done !== undefined) {
      item.done = cleanMetadata.done === true || cleanMetadata.done === "true";
    }

    // Add event attributes
    if (cleanMetadata.event) {
      if (cleanMetadata.event.date) {
        item.date = new Date(cleanMetadata.event.date);
      }
      if (cleanMetadata.event.location) {
        item.location = cleanMetadata.event.location;
      }
    }

    // Add mail attributes
    if (cleanMetadata.mail) {
      if (cleanMetadata.mail.from) {
        item.from = cleanMetadata.mail.from;
      }
      if (cleanMetadata.mail.to) {
        item.to = cleanMetadata.mail.to;
      }
    }

    return item;
  } catch (error) {
    console.error("Error parsing markdown content:", error);
    return null;
  }
};

export async function importFromDirectory(
  directoryPath: string
): Promise<Item[]> {
  const items: Item[] = [];
  const files = await fs.readdir(directoryPath);

  // First pass: import all files
  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const content = await fs.readFile(path.join(directoryPath, file), "utf-8");

    const item = parseContent(content);
    if (item) {
      items.push(item);
    }
  }

  // Second pass: convert tasks and create references
  const taskItems: Item[] = [];
  const taskReferences = new Map<string, string>(); // task title -> item id

  for (const item of items) {
    // Find all task lines in the content
    const taskLines = item.content.match(/^[ \t]*- \[(x| )\] (.*)$/gm) || [];

    for (const line of taskLines) {
      const match = line.match(/^[ \t]*- \[(x| )\] (.*)$/);
      if (!match) continue;

      const [, done, title] = match;
      const taskId = title.toLowerCase().replace(/[^a-z0-9-]/g, "-");

      // Create task item
      const taskItem: Item = {
        id: taskId,
        title: title,
        content: "", // TODO: Extract task description if available
        done: done === "x",
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        tags: [], // Required by Item interface
      };

      taskItems.push(taskItem);
      taskReferences.set(title, taskId);
    }
  }

  // Third pass: replace task lines with references
  for (const item of items) {
    let content = item.content;

    // Replace all task lines with references
    content = content.replace(
      /^([ \t]*)- \[(x| )\] (.*)$/gm,
      (match, indent, done, title) => {
        const taskId = taskReferences.get(title);
        return taskId ? `${indent}- ![[${title}]]` : match;
      }
    );

    item.content = content;
  }

  // Return all items including tasks
  return [...items, ...taskItems];
}

export async function exportToDirectory(
  items: Item[],
  directoryPath: string
): Promise<Map<string, string>> {
  const exportedFiles = new Map<string, string>();

  // Create directory if it doesn't exist
  await fs.mkdir(directoryPath, { recursive: true });

  // First pass: count task references
  const taskReferenceCount = new Map<string, number>();
  for (const item of items) {
    const taskReferences = item.content.match(/!\[\[(.*?)\]\]/g) || [];
    for (const ref of taskReferences) {
      const title = ref.slice(3, -2); // Remove ![[ and ]]
      taskReferenceCount.set(title, (taskReferenceCount.get(title) || 0) + 1);
    }
  }

  // Export each item
  for (const item of items) {
    // Skip non-shared tasks as they will be embedded in their parent files
    if (item.done !== undefined) {
      // Check if this task is shared (referenced by multiple files)
      const isShared = taskReferenceCount.get(item.title) > 1;
      if (!isShared) continue;
    }

    // Create YAML front matter
    const frontMatter: Record<string, any> = {
      id: item.id,
      title: item.title,
    };

    // Add dates if they exist
    if (item.createdAt) {
      frontMatter.created = item.createdAt.toISOString();
    }
    if (item.updatedAt) {
      frontMatter.updated = item.updatedAt.toISOString();
    }

    // Add other metadata
    if (item.tags?.length) {
      frontMatter.tags = item.tags;
    }
    if (item.done !== undefined) {
      frontMatter.done = item.done;
    }
    if (item.date) {
      frontMatter.event = { date: item.date.toISOString() };
    }
    if (item.location) {
      frontMatter.event = { ...frontMatter.event, location: item.location };
    }
    if (item.from || item.to) {
      frontMatter.mail = {};
      if (item.from) frontMatter.mail.from = item.from;
      if (item.to) frontMatter.mail.to = item.to;
    }

    // Convert front matter to YAML
    const yamlContent = yaml.stringify(frontMatter);

    // Build the content
    let content = `---\n${yamlContent}---\n\n${item.content}`;

    // Replace task references with appropriate format
    content = content.replace(/!\[\[(.*?)\]\]/g, (match, title) => {
      const count = taskReferenceCount.get(title) || 0;
      if (count > 1) {
        // Keep as reference if shared
        return match;
      } else {
        // Convert to task format if not shared
        const task = items.find((i) => i.title === title);
        return `[${task?.done ? "x" : " "}] ${title}`;
      }
    });

    // Write the file
    const filePath = path.join(directoryPath, `${item.id}.md`);
    await fs.writeFile(filePath, content, "utf-8");
    exportedFiles.set(`${item.id}.md`, content);
  }

  return exportedFiles;
}

export async function importFromFiles(files: File[]): Promise<Item[]> {
  const items: Item[] = [];
  const fileContents = new Map<string, string>();

  for (const file of files) {
    if (!file.name.endsWith(".md")) continue;
    const content = await file.text();
    fileContents.set(file.name, content);
  }

  for (const [fileName, content] of fileContents) {
    const item = parseContent(content);
    if (item) {
      items.push(item);
    }
  }

  return items;
}
