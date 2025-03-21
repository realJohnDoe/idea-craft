import React, { useState, useEffect } from "react";
import {
  Content,
  getPrimaryContentType,
  processContentLinks,
  formatContentWithYaml,
} from "@/lib/content-utils";
import { toast } from "sonner";
import ContentHeader from "./ContentHeader";
import ContentBody from "./ContentBody";
import ContentFooter from "./ContentFooter";
import ContentEditor from "../content-editor/ContentEditor";
import { cn } from "@/lib/utils";
import ContentTypeTags from "./ContentTypeTags";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface ContentItemProps {
  item: Content;
  onUpdate: (updatedItem: Content) => void;
  onDelete: (id: string) => void;
  allItems?: Content[];
  isListView?: boolean;
  onSelect?: (item: Content) => void;
  onTaskToggle?: (item: Content, checked: boolean) => void;
}

const ContentItem: React.FC<ContentItemProps> = ({
  item,
  onUpdate,
  onDelete,
  allItems = [],
  isListView = false,
  onSelect,
  onTaskToggle,
}) => {
  const [isHovered, setIsHovered] = useState(false);
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

  const getTypeClass = () => {
    const primaryType = getPrimaryContentType(item);
    switch (primaryType) {
      default:
        return "";
    }
  };

  const handleTaskToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();

    // Use either the passed in onTaskToggle or directly update
    if (onTaskToggle) {
      onTaskToggle(item, e.target.checked);
    } else {
      const updatedItem = {
        ...item,
        taskDone: e.target.checked,
      };
      updatedItem.yaml = formatContentWithYaml(updatedItem);
      onUpdate(updatedItem);
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

  const handleItemSelect = () => {
    if (onSelect && isListView) {
      onSelect(item);
    }
  };

  if (isEditing) {
    return (
      <ContentEditor
        item={item}
        onUpdate={handleEditorUpdate}
        onCancel={handleEditorCancel}
      />
    );
  }

  if (isListView) {
    return (
      <div
        id={`content-item-${item.id}`}
        className={cn("group py-2 px-3 border-b", getTypeClass())}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {item.hasTaskAttributes && (
              <div className="mr-1">
                <input
                  type="checkbox"
                  checked={item.taskDone}
                  onChange={handleTaskToggle}
                  onClick={(e) => e.stopPropagation()}
                  className="form-checkbox h-4 w-4 text-task border-task rounded"
                />
              </div>
            )}
            <h3
              className={cn(
                "text-sm font-medium cursor-pointer hover:underline",
                item.hasTaskAttributes &&
                  item.taskDone &&
                  "line-through text-muted-foreground"
              )}
              onClick={handleItemSelect}
            >
              {item.title}
            </h3>
          </div>
        </div>

        <div className="flex mt-1 items-center gap-2">
          <ContentTypeTags item={item} onUpdate={onUpdate} />
        </div>

        {item.eventDate && (
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Calendar className="size-3 text-event" />
            {format(item.eventDate, "PPP")}
            {item.eventLocation && <span> • {item.eventLocation}</span>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      id={`content-item-${item.id}`}
      className={cn("content-item border rounded-lg shadow-sm", getTypeClass())}
    >
      <ContentHeader
        item={item}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onEdit={handleEditClick}
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
  );
};

export default ContentItem;
