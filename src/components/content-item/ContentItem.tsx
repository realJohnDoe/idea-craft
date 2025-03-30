import React, { useState, useEffect } from "react";
import {
  Content,
  processContentLinks,
  contentToItem,
  hasTaskAttributes,
  Item,
} from "@/lib/content-utils";
import ContentEditor from "../content-editor/ContentEditor";
import { cn } from "@/lib/utils";
import ContentTypeTags from "./ContentTypeTags";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import IdeaCraftCheckbox from "../IdeaCraftCheckbox";
import { Card } from "../ui/card";
import { useNavigate } from "react-router-dom";

interface ContentItemProps {
  item: Content;
  onUpdate: (updatedItem: Item) => void;
  allItems?: Content[];
}

const ContentItem: React.FC<ContentItemProps> = ({
  item,
  onUpdate,
  allItems = [],
}) => {
  const [processedContent, setProcessedContent] = useState(item.content);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (allItems.length > 0) {
      setProcessedContent(processContentLinks(item.content, allItems));
    }
  }, [item.content, allItems]);

  const handleEditorUpdate = (updatedItem: Content) => {
    onUpdate(updatedItem);
    setIsEditing(false);
  };

  const handleEditorCancel = () => {
    setIsEditing(false);
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
      ...contentToItem(item),
      done: checked,
    };
    onUpdate(updatedItem);
  };

  const navigate = useNavigate();

  return (
    <div id={`content-item-${item.id}`}>
      <Card
        className={
          "flex flex-col gap-1 px-3 py-2 m-2 rounded-lg border border-b group"
        }
      >
        <div className="flex items-center">
          {hasTaskAttributes(contentToItem(item)) && (
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
            onClick={(e) => {
              e.preventDefault();
              navigate(`/item/${item.id}`);
            }}
          >
            {item.title}
          </h3>
        </div>

        <div className="flex gap-2 items-center mt-1">
          <ContentTypeTags item={contentToItem(item)} />
        </div>
      </Card>
    </div>
  );
};

export default ContentItem;
