import React, { useState, useEffect } from "react";
import {
  Content,
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
import IdeaCraftCheckbox from "../IdeaCraftCheckbox";
import { Card } from "../ui/card";

interface ContentItemProps {
  item: Content;
  onUpdate: (updatedItem: Content) => void;
  onDelete: (id: string) => void;
  allItems?: Content[];
  isListView?: boolean;
  onSelect?: (item: Content) => void;
}

const ContentItem: React.FC<ContentItemProps> = ({
  item,
  onUpdate,
  onDelete,
  allItems = [],
  isListView = false,
  onSelect,
}) => {
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

  const handleTaskToggle = (checked: boolean) => {
    const updatedItem = {
      ...item,
      taskDone: checked,
    };

    // Re-generate YAML
    updatedItem.yaml = formatContentWithYaml(updatedItem);

    onUpdate(updatedItem);
  };

  return (
    <div id={`content-item-${item.id}`}>
      <Card className={"group py-2 px-3 border-b flex flex-col gap-1 m-2"}>
        <div className="flex items-center">
          {item.hasTaskAttributes && (
            <div className="flex items-center">
              <IdeaCraftCheckbox
                checked={item.taskDone}
                onToggle={handleTaskToggle}
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
      </Card>
    </div>
  );
};

export default ContentItem;
