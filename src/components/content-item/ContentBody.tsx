import React, { useEffect, useState } from "react";
import {
  Content,
  contentToItem,
  formatContentWithYaml,
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
  const handleTaskToggle = (checked: boolean) => {
    const updatedItem = {
      ...item,
      taskDone: checked,
    };

    // Re-generate YAML
    updatedItem.yaml = formatContentWithYaml(updatedItem);

    onUpdate(contentToItem(updatedItem));
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
      <Card className="rounded-t-lg">
        <div className="p-1">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur}
            className=""
          />
        </div>
        <div className="p-1 px-3">
          {hasTaskAttributes(contentToItem(item)) && (
            <div className="mb-3 flex items-center">
              <IdeaCraftCheckbox
                checked={item.taskDone}
                onToggle={handleTaskToggle}
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
          {item.hasEventAttributes && item.eventDate && (
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center">
                <svg
                  className="mr-1 h-4 w-4 text-event"
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
                <span className="font-medium text-event">
                  {format(item.eventDate, "PPP")}
                </span>
              </div>

              {item.eventLocation && (
                <div className="mt-1 ml-5 text-sm">
                  <span>Location: {item.eventLocation}</span>
                </div>
              )}
            </div>
          )}

          {item.hasMailAttributes && (
            <div className="mb-3 text-sm">
              {item.mailFrom && (
                <div className="text-muted-foreground">
                  <span className="font-medium">From:</span> {item.mailFrom}
                </div>
              )}

              {item.mailTo && item.mailTo.length > 0 && (
                <div className="text-muted-foreground">
                  <span className="font-medium">To:</span>{" "}
                  {item.mailTo.join(", ")}
                </div>
              )}

              {item.mailSubject && (
                <div className="text-muted-foreground">
                  <span className="font-medium">Subject:</span>{" "}
                  {item.mailSubject}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      <div className="content-item-body px-3">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ContentRenderer
            content={processedContent}
            allItems={allItems}
            handleWikiLinkClick={handleUpdateSelectedItem}
          />
        </div>
      </div>
    </div>
  );
};

export default ContentBody;
