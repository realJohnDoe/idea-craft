import { Item } from "./content-utils";
import { parseContent } from "./import-utils";
import fs from "fs/promises";
import path from "path";

export const importFromDirectory = async (
  directoryPath: string
): Promise<Item[]> => {
  try {
    const items: Item[] = [];
    const files = await fs.readdir(directoryPath);

    for (const file of files) {
      if (file.endsWith(".md")) {
        const filePath = path.join(directoryPath, file);
        const content = await fs.readFile(filePath, "utf-8");
        const item = parseContent(content);
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
