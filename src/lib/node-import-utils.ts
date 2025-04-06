import { Item } from "./content-utils";
import { parseContent } from "./import-utils";
import fs from "fs/promises";
import path from "path";

export const importFromDirectory = async (directoryPath: string): Promise<Item[]> => {
  try {
    const items: Item[] = [];
    console.log(`Reading directory: ${directoryPath}`);
    const files = await fs.readdir(directoryPath);
    console.log(`Found files: ${files.join(', ')}`);
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(directoryPath, file);
        console.log(`Processing file: ${filePath}`);
        const content = await fs.readFile(filePath, 'utf-8');
        console.log(`File content: ${content.substring(0, 100)}...`);
        const item = parseContent(content);
        console.log(`Parsed item:`, item);
        if (item) {
          items.push(item);
        }
      }
    }
    
    return items;
  } catch (error) {
    console.error("Error importing from directory:", error);
    throw error;
  }
}; 