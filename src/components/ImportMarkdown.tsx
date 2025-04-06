import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, FileUp } from "lucide-react";
import { Item } from "@/lib/content-utils";
import { toast } from "sonner";
import { parseContent } from "@/lib/import-utils";

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
      const importedItems: Item[] = [];
      const file = files[0];
      const content = await file.text();

      // Log the content details
      console.log("Frontend file content:", content);
      console.log("Frontend file content length:", content.length);
      console.log(
        "Frontend file content bytes:",
        [...content].map((c) => c.charCodeAt(0))
      );

      // Process the content directly without splitting
      const item = parseContent(content);
      if (item) {
        importedItems.push(item);
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
