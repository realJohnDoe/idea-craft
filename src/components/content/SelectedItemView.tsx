import React, { useEffect, useState } from "react";
import { Content, processContentLinks } from "@/lib/content-utils";
import ContentItem from "@/components/content-item";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import ContentFooter from "../content-item/ContentFooter";
import ContentHeader from "../content-item/ContentHeader";
import ContentBody from "../content-item/ContentBody";
import ContentEditor from "../content-editor/ContentEditor";

interface SelectedItemViewProps {
  item: Content;
  onUpdate: (updatedItem: Content) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  allItems: Content[];
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

  const handleLinkClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("content-link")) {
      e.stopPropagation();
      const itemId = target.getAttribute("data-item-id");
      if (itemId) {
        const linkedItem = allItems.find((item) => item.id === itemId);
        if (linkedItem) {
          toast.info(`Linked to: ${linkedItem.title}`);

          const linkedElement = document.getElementById(
            `content-item-${itemId}`
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
      }
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditorUpdate = (updatedItem: Content) => {
    onUpdate(updatedItem);
    setIsEditing(false);
  };

  const handleEditorCancel = () => {
    setIsEditing(false);
  };

  const handleTitleChanged = (title: string) => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    const updatedContent: Content = {
      ...item,
      title,
      updatedAt: new Date(),
    };
    onUpdate(updatedContent);
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
            item={item}
            onUpdate={handleEditorUpdate}
            onCancel={handleEditorCancel}
          />
        )}
        {!isEditing && (
          <div>
            <ContentHeader
              title_in={item.title}
              onUpdate={handleTitleChanged}
            />

            <ContentBody
              item={item}
              onUpdate={onUpdate}
              processedContent={processedContent}
              handleLinkClick={handleLinkClick}
              allItems={allItems}
            />

            <ContentFooter
              item={item}
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
