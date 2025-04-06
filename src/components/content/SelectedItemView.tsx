import { useEffect, useState } from "react";
import { Item, processContentLinks, generateYaml } from "@/lib/content-utils";
import { Button } from "@/components/ui/button";
import { FileText, X } from "lucide-react";
import ContentFooter from "../content-item/ContentFooter";
import ContentBody from "../content-item/ContentBody";
import ContentList from "./ContentList";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface SelectedItemViewProps {
  item: Item;
  onUpdate: (updatedItem: Item) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  allItems: Item[];
}

const SelectedItemView = ({
  item,
  onUpdate,
  onDelete,
  onClose,
  allItems,
}: SelectedItemViewProps) => {
  const [processedContent, setProcessedContent] = useState(item.content);
  const [showYaml, setShowYaml] = useState(false);
  const [yaml, setYaml] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (allItems.length > 0) {
      setProcessedContent(processContentLinks(item.content, allItems));
    }

    // Generate YAML for the dialog
    setYaml(generateYaml(item));
  }, [item, allItems]);

  const handleUpdateSelectedItem = (wikilinkId: string) => {
    const linkedItem = allItems.find((item) => item.id === wikilinkId);
    if (linkedItem) {
      const linkedElement = document.getElementById(
        `content-item-${wikilinkId}`
      );
      if (linkedElement) {
        linkedElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        linkedElement.classList.add("highlight-pulse");
        setTimeout(() => {
          linkedElement.classList.remove("highlight-pulse");
        }, 2000);
      }
    }
  };

  const getReferencingItems = () => {
    const referencingItems = allItems.filter(
      (referencingItem) =>
        referencingItem.content.includes(`[[${item.id}]]`) ||
        referencingItem.content.includes(`[[${item.title}]]`) ||
        referencingItem.content.includes(`[[${item.title}|`)
    );
    return referencingItems;
  };

  return (
    <div className="px-4 py-1 h-full overflow-auto border-s">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium">
          {item.id.includes("new-") ? "Selected Item" : "Selected Item"}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowYaml(true)}>
            <FileText className="size-4 mr-1" />
            YAML
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>
      </div>

      <div
        id={`content-item-${item.id}`}
        className="rounded-lg border shadow-sm content-item"
      >
        <ContentBody
          item={item}
          onUpdate={onUpdate}
          processedContent={processedContent}
          handleWikiLinkClick={handleUpdateSelectedItem}
          allItems={allItems}
        />

        <ContentFooter
          item={item}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onEdit={() => setIsEditing(true)}
        />
      </div>

      <div className="mt-4">
        <h3 className="mb-2 font-medium text-md">Referenced By</h3>
        {getReferencingItems().length > 0 ? (
          <ContentList
            items={getReferencingItems()}
            onUpdate={onUpdate}
            allItems={allItems}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            No other items reference this content yet.
          </p>
        )}
      </div>

      {/* YAML Dialog */}
      <Dialog open={showYaml} onOpenChange={setShowYaml}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>YAML Metadata</DialogTitle>
          </DialogHeader>
          <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
            {yaml || "No metadata available"}
          </pre>
          <DialogClose asChild>
            <Button variant="outline" className="mt-2">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SelectedItemView;
