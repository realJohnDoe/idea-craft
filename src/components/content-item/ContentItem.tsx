
import React, { useState } from "react";
import {
  Item,
  processContentLinks,
  hasTaskAttributes,
} from "@/lib/content-utils";
import { cn } from "@/lib/utils";
import ContentTypeTags from "./ContentTypeTags";
import IdeaCraftCheckbox from "../IdeaCraftCheckbox";
import { Card } from "../ui/card";
import { useNavigate } from "react-router-dom";

interface ContentItemProps {
  item: Item;
  onUpdate: (updatedItem: Item) => void;
  allItems?: Item[];
}

const ContentItem: React.FC<ContentItemProps> = ({
  item,
  onUpdate,
  allItems = [],
}) => {
  const navigate = useNavigate();

  const handleTaskToggle = (checked: boolean) => {
    const updatedItem = {
      ...item,
      done: checked,
    };
    onUpdate(updatedItem);
  };

  return (
    <div id={`content-item-${item.id}`}>
      <Card
        className={
          "flex flex-col gap-1 px-3 py-2 my-2 rounded-lg border border-b group"
        }
      >
        <div className="flex items-center">
          {hasTaskAttributes(item) && (
            <div className="flex items-center">
              <IdeaCraftCheckbox
                checked={item.done}
                onToggle={handleTaskToggle}
              />
            </div>
          )}
          <h3
            className={cn(
              "text-sm font-medium cursor-pointer hover:underline",
              hasTaskAttributes(item) &&
                item.done &&
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
          <ContentTypeTags item={item} />
        </div>
      </Card>
    </div>
  );
};

export default ContentItem;
