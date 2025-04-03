
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, FileDown } from "lucide-react";
import { Item, formatContentWithYaml } from "@/lib/content-utils";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { createSafeFilename } from "@/lib/id-utils";

interface ExportMarkdownProps {
  items: Item[];
}

const ExportMarkdown: React.FC<ExportMarkdownProps> = ({ items }) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToMarkdown = async () => {
    if (items.length === 0) {
      toast.error("No items to export");
      return;
    }
    
    setIsExporting(true);
    
    try {
      // Create a new JSZip instance
      const zip = new JSZip();
      
      // Create a folder for the markdown files
      const markdownFolder = zip.folder("ideacraft-export");
      
      // Add each item as a markdown file
      items.forEach((item) => {
        // Convert title to valid filename
        const fileName = createSafeFilename(item.title) + ".md";
        
        // Format the content with YAML frontmatter
        const markdownContent = formatContentWithYaml(item);
        
        // Add the file to the folder
        markdownFolder.file(fileName, markdownContent);
      });
      
      // Generate the zip file
      const zipBlob = await zip.generateAsync({ type: "blob" });
      
      // Save the zip file
      saveAs(zipBlob, "ideacraft-export.zip");
      
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
      variant="outline"
      onClick={exportToMarkdown}
      disabled={isExporting || items.length === 0}
      className="flex items-center gap-2"
    >
      {isExporting ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <FileDown className="mr-2 h-4 w-4" />
      )}
      {isExporting ? "Exporting..." : "Export as Markdown"}
    </Button>
  );
};

export default ExportMarkdown;
