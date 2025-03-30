import React, { useEffect, useState } from "react";
import {
  Content,
  contentToItem,
  formatContentWithYaml,
  hasEventAttributes,
  hasMailAttributes,
  hasTaskAttributes,
  Item,
} from "@/lib/content-utils";
import { format } from "date-fns";
import ContentRenderer from "./ContentRenderer";
import IdeaCraftCheckbox from "../IdeaCraftCheckbox";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { Card } from "../ui/card";

interface ContentBodyProps {
  item: Content;
  onUpdate: (updatedItem: Item) => void;
  processedContent: string;
  handleWikiLinkClick?: (wikilinkId: string) => void;
  allItems?: Item[];
}

const ContentBody: React.FC<ContentBodyProps> = ({
  item,
  onUpdate,
  processedContent,
  handleWikiLinkClick: handleUpdateSelectedItem,
  allItems = [],
}) => {
  const [title, setTitle] = useState(item.title);

  const handleTitleChanged = (title: string) => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    const updatedContent: Item = {
      ...item,
      title,
      updatedAt: new Date(),
    };
    onUpdate(updatedContent);
  };
  const handleTaskToggle = (itemToUpdate: Item, checked: boolean) => {
    const updatedItem = {
      ...itemToUpdate,
      done: checked,
    };
    console.log("Item before", itemToUpdate);
    console.log("Item after", updatedItem);

    onUpdate(updatedItem);
  };

  useEffect(() => {
    setTitle(item.title);
  }, [item.title]);

  const handleBlur = () => {
    if (title !== item.title) {
      handleTitleChanged(title);
    }
  };

  return (
    <div>
      <Card className="rounded-t-lg border-b">
        <div className="p-1">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur}
            className=""
          />
        </div>
        <div className="flex flex-col gap-2 px-2 mt-1 mb-2">
          {hasTaskAttributes(contentToItem(item)) && (
            <div className="flex items-center px-1">
              <IdeaCraftCheckbox
                checked={item.taskDone}
                onToggle={(checked) =>
                  handleTaskToggle(contentToItem(item), checked)
                }
              />
              <label
                htmlFor={`task-${item.id}`}
                className={`text-sm ${
                  item.taskDone ? "line-through text-muted-foreground" : ""
                }`}
              >
                Mark as done
              </label>
            </div>
          )}
          {hasEventAttributes(contentToItem(item)) && (
            <div className="px-1 text-sm text-event">
              <div className="flex items-center">
                <svg
                  className="mr-1 w-4 h-4 text-event"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                <span>{format(item.eventDate, "PPPP")}</span>
              </div>

              {item.eventLocation && (
                <div className="flex items-center mt-1">
                  <svg
                    className="mr-1 w-4 h-4 text-event"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 21c-4.97-5.46-8-9.25-8-12a8 8 0 0116 0c0 2.75-3.03 6.54-8 12z"></path>
                    <circle cx="12" cy="9" r="3"></circle>
                  </svg>
                  <span>{item.eventLocation}</span>
                </div>
              )}
            </div>
          )}

          {hasMailAttributes(contentToItem(item)) && (
            <div className="px-1 text-sm text-mail">
              {item.mailFrom && (
                <div>
                  <span className="font-medium">From:</span> {item.mailFrom}
                </div>
              )}

              {item.mailTo && item.mailTo.length > 0 && (
                <div>
                  <span className="font-medium">To:</span>{" "}
                  {item.mailTo.join(", ")}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {processedContent && (
        <div className="px-3 py-1 border-b content-item-body">
          <div className="max-w-none prose prose-sm dark:prose-invert">
            <ContentRenderer
              content={processedContent}
              allItems={allItems}
              handleWikiLinkClick={handleUpdateSelectedItem}
              onTaskToggle={handleTaskToggle}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentBody;
