import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, FileUp } from "lucide-react";
import { Item } from "@/lib/content-utils";
import { generateUniqueId } from "@/lib/id-utils";
import { toast } from "sonner";
import yaml from "yaml";

interface ImportMarkdownProps {
  onImport: (items: Item[]) => void;
  id?: string;
}

const ImportMarkdown: React.FC<ImportMarkdownProps> = ({ onImport, id }) => {
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const parseContent = (content: string): Item | null => {
    try {
      // Try to extract YAML front matter
      const frontMatterMatch = content.match(
        /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
      );

      if (!frontMatterMatch) {
        console.error("No front matter found in markdown file");
        return null;
      }

      const frontMatter = frontMatterMatch[1];
      const markdownContent = frontMatterMatch[2].trim();

      // Parse the front matter as YAML
      const metadata = yaml.parse(frontMatter);

      // Create basic item structure
      const item: Item = {
        id: metadata.id || generateUniqueId(),
        title: metadata.title || "Untitled",
        content: markdownContent,
        createdAt: metadata.createdAt
          ? new Date(metadata.createdAt)
          : new Date(),
        updatedAt: metadata.updatedAt
          ? new Date(metadata.updatedAt)
          : new Date(),
        tags: metadata.tags || [],
      };

      // Add task attributes
      if (metadata.task?.done !== undefined) {
        item.done = metadata.task.done;
      }

      // Add event attributes
      if (metadata.event) {
        if (metadata.event.date) {
          item.date = new Date(metadata.event.date);
        }
        if (metadata.event.location) {
          item.location = metadata.event.location;
        }
      }

      // Add mail attributes
      if (metadata.mail) {
        if (metadata.mail.from) {
          item.from = metadata.mail.from;
        }
        if (metadata.mail.to) {
          item.to = metadata.mail.to;
        }
      }

      return item;
    } catch (error) {
      console.error("Error parsing markdown content:", error);
      return null;
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsImporting(true);

    try {
      const importedItems: Item[] = [];
      const file = files[0];
      const content = await file.text();

      // Split content by "---" to separate items
      const itemsContent = content.split(/\n---\n/);

      // Process each item
      for (const itemContent of itemsContent) {
        // Skip the header if it's the first item
        if (itemContent.startsWith("# IdeaCraft Export")) {
          continue;
        }

        const item = parseContent(itemContent);
        if (item) {
          importedItems.push(item);
        }
      }

      if (importedItems.length > 0) {
        onImport(importedItems);
        toast.success(`Successfully imported ${importedItems.length} items`);
      } else {
        toast.error("No valid items found in the file");
      }
    } catch (error) {
      console.error("Error importing markdown:", error);
      toast.error("Failed to import items");
    } finally {
      setIsImporting(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".md"
        className="hidden"
      />
      <Button
        id={id}
        variant="outline"
        size="sm"
        onClick={handleImportClick}
        disabled={isImporting}
        className="w-10 h-10 md:w-auto rounded-full flex items-center"
      >
        {isImporting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <FileUp className="size-4" />
        )}
        <span className="ms-1 hidden md:inline">Import</span>
      </Button>
    </>
  );
};

export default ImportMarkdown;
