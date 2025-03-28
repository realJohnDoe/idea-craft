import { useEffect, useState } from "react";
import {
  Item,
  itemToContent,
  processContentLinks,
} from "@/lib/content-utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ContentFooter from "../content-item/ContentFooter";
import ContentBody from "../content-item/ContentBody";
import ContentEditor from "../content-editor/ContentEditor";

interface SelectedItemViewProps {
  item: Item;
  onUpdate: (updatedItem: Item) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  allItems: Item[];
  isMobile: boolean;
}

const SelectedItemView = ({
  item,
  onUpdate,
  onDelete,
  onClose,
  allItems,
  isMobile,
}: SelectedItemViewProps) => {
  const [processedContent, setProcessedContent] = useState(item.content);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (allItems.length > 0) {
      setProcessedContent(processContentLinks(item.content, allItems));
    }
  }, [item.content, allItems]);

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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditorUpdate = (updatedItem: Item) => {
    onUpdate(updatedItem);
    setIsEditing(false);
  };

  const handleEditorCancel = () => {
    setIsEditing(false);
  };

  return (
    <div
      className={
        isMobile
          ? "fixed inset-0 z-20 bg-background p-4"
          : "md:w-1/2 lg:w-3/5 sticky top-4 self-start"
      }
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Selected Item</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>

      <div
        id={`content-item-${item.id}`}
        className={"content-item border rounded-lg shadow-sm"}
      >
        {/* If editing, show the editor instead of the item */}
        {isEditing && (
          <ContentEditor
            item={itemToContent(item)}
            onUpdate={handleEditorUpdate}
            onCancel={handleEditorCancel}
          />
        )}
        {!isEditing && (
          <div>
            <ContentBody
              item={itemToContent(item)}
              onUpdate={onUpdate}
              processedContent={processedContent}
              handleWikiLinkClick={handleUpdateSelectedItem}
              allItems={allItems}
            />

            <ContentFooter
              item={itemToContent(item)}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onEdit={handleEditClick}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedItemView;
