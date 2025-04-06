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
    console.log('Parsed YAML:', metadata);
    console.log('Task done:', metadata.task?.done);

    // Clean up metadata values
    const cleanMetadata = Object.fromEntries(
      Object.entries(metadata).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value
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
      if (typeof dateStr === 'number') {
        return new Date(dateStr);
      }
      
      // If it's a string in YYYY-MM-DD format, parse it
      if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateStr.split('-').map(Number);
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
      createdAt: cleanMetadata.createdAt || cleanMetadata.created
        ? parseLocalDate(cleanMetadata.createdAt || cleanMetadata.created)
        : new Date(),
      updatedAt: cleanMetadata.updatedAt || cleanMetadata.updated
        ? parseLocalDate(cleanMetadata.updatedAt || cleanMetadata.updated)
        : new Date(),
      tags: cleanMetadata.tags || [],
    };

    // Add task attributes
    if (cleanMetadata.done !== undefined) {
      item.done = cleanMetadata.done === true || cleanMetadata.done === 'true';
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

export async function importFromDirectory(directoryPath: string): Promise<Item[]> {
  const items: Item[] = [];
  const files = await fs.readdir(directoryPath);
  
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    
    const content = await fs.readFile(
      path.join(directoryPath, file),
      'utf-8'
    );
    
    const item = parseContent(content);
    if (item) {
      items.push(item);
    }
  }
  
  return items;
} 