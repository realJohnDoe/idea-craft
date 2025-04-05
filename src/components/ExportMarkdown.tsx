import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, FileDown } from "lucide-react";
import { Item, formatContentWithYaml } from "@/lib/content-utils";
import { toast } from "sonner";
import { createSafeFilename } from "@/lib/id-utils";

interface ExportMarkdownProps {
  items: Item[];
  id?: string;
}

const ExportMarkdown: React.FC<ExportMarkdownProps> = ({ items, id }) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToMarkdown = async () => {
    if (items.length === 0) {
      toast.error("No items to export");
      return;
    }

    setIsExporting(true);

    try {
      // Create a single markdown file with all items
      let markdownContent = "# IdeaCraft Export\n\n";

      items.forEach((item) => {
        markdownContent += `## ${item.title}\n\n`;
        markdownContent += formatContentWithYaml(item);
        markdownContent += "\n\n---\n\n";
      });

      // Create a blob and download it
      const blob = new Blob([markdownContent], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ideacraft-export.md";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Successfully exported ${items.length} items`);
    } catch (error) {
      console.error("Error exporting markdown:", error);
      toast.error("Failed to export items");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      id={id}
      variant="outline"
      size="sm"
      onClick={exportToMarkdown}
      disabled={isExporting || items.length === 0}
      className="w-10 h-10 md:w-auto rounded-full flex items-center"
    >
      {isExporting ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <FileDown className="size-4" />
      )}
      <span className="ms-1 hidden md:inline">Export</span>
    </Button>
  );
};

export default ExportMarkdown;
