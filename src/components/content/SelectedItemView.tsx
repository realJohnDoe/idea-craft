
import { useEffect, useState } from "react";
import { Item, itemToContent, processContentLinks } from "@/lib/content-utils";
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
    <div className={`fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-1/3 z-50 bg-background shadow-lg overflow-y-auto border-l ${isMobile ? "" : "backdrop-blur-sm"}`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Item Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>

        <div
          id={`content-item-${item.id}`}
          className="rounded-lg border shadow-sm content-item"
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

        {getReferencingItems().length > 0 && (
          <div className="mt-4">
            <h3 className="mb-2 font-medium text-md">Referenced By</h3>
            <div className="border rounded-lg overflow-hidden shadow-sm">
              {getReferencingItems().map((refItem) => (
                <div 
                  key={refItem.id} 
                  className="p-3 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer"
                  onClick={() => {
                    onUpdate(refItem);
                  }}
                >
                  <p className="font-medium">{refItem.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedItemView;
