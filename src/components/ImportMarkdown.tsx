import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, FolderDown } from "lucide-react";
import { Item } from "@/lib/content-utils";
import { toast } from "sonner";
import { importFromFiles } from "@/lib/import-utils";

// Add type declaration for webkitdirectory
declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}

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

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsImporting(true);

    try {
      const items = await importFromFiles(Array.from(files));

      if (items.length > 0) {
        onImport(items);
        toast.success(`Successfully imported ${items.length} items`);
      } else {
        toast.error("No valid items found in the files");
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
        multiple
        webkitdirectory=""
        directory=""
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
          <FolderDown className="size-4" />
        )}
        <span className="ms-1 hidden md:inline">Import</span>
      </Button>
    </>
  );
};

export default ImportMarkdown;
