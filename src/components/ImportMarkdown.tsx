
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, FileUp } from "lucide-react";
import { Item } from "@/lib/content-utils";
import { generateUniqueId, createSafeFilename } from "@/lib/id-utils";
import { toast } from "sonner";
import JSZip from "jszip";
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
      const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      
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
        id: metadata.id || `note-${createSafeFilename(metadata.title)}-${generateUniqueId().substring(0, 8)}`,
        title: metadata.title || "Untitled",
        content: markdownContent,
        createdAt: metadata.createdAt ? new Date(metadata.createdAt) : new Date(),
        updatedAt: metadata.updatedAt ? new Date(metadata.updatedAt) : new Date(),
        tags: metadata.tags || [],
      };

      // Add optional attributes
      if (metadata.done !== undefined) {
        item.done = metadata.done;
      }

      if (metadata.date) {
        item.date = new Date(metadata.date);
      }

      if (metadata.location) {
        item.location = metadata.location;
      }

      if (metadata.from) {
        item.from = metadata.from;
      }

      if (metadata.to) {
        item.to = metadata.to;
      }

      return item;
    } catch (error) {
      console.error("Error parsing markdown content:", error);
      return null;
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsImporting(true);

    try {
      const importedItems: Item[] = [];

      // Check if it's a zip file
      if (files[0].name.endsWith('.zip')) {
        const zip = new JSZip();
        const zipContent = await zip.loadAsync(files[0]);
        
        // Process all markdown files in the zip
        const promises = Object.keys(zipContent.files)
          .filter(filename => filename.endsWith('.md') && !zipContent.files[filename].dir)
          .map(async (filename) => {
            const fileData = await zipContent.files[filename].async("string");
            const item = parseContent(fileData);
            if (item) {
              importedItems.push(item);
            }
          });
        
        await Promise.all(promises);
      } else {
        // Process individual markdown files
        for (let i = 0; i < files.length; i++) {
          if (files[i].name.endsWith('.md')) {
            const content = await files[i].text();
            const item = parseContent(content);
            if (item) {
              importedItems.push(item);
            }
          }
        }
      }

      if (importedItems.length > 0) {
        onImport(importedItems);
      } else {
        toast.error("No valid markdown files found");
      }
    } catch (error) {
      console.error("Error importing files:", error);
      toast.error("Failed to import files");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".md,.zip"
        multiple
        className="hidden"
      />
      <Button
        id={id}
        variant="outline"
        onClick={handleImportClick}
        disabled={isImporting}
        className="flex items-center gap-2"
      >
        {isImporting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FileUp className="mr-2 h-4 w-4" />
        )}
        {isImporting ? "Importing..." : "Import Markdown"}
      </Button>
    </>
  );
};

export default ImportMarkdown;
