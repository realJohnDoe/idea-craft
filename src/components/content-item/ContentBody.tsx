
import React from "react";
import { Item } from "@/lib/content-utils";
import { formatDate } from "date-fns";
import ContentRenderer from "./ContentRenderer";

interface ContentBodyProps {
  item: Item;
  onUpdate: (updatedItem: Item) => void;
  processedContent: string;
  handleWikiLinkClick: (wikilinkId: string) => void;
  allItems: Item[];
}

const ContentBody: React.FC<ContentBodyProps> = ({
  item,
  onUpdate,
  processedContent,
  handleWikiLinkClick,
  allItems,
}) => {
  const handleTaskToggle = (linkedItem: Item, isDone: boolean) => {
    const updatedItem = {
      ...linkedItem,
      done: isDone,
    };
    onUpdate(updatedItem);
  };

  return (
    <div className="p-4">
      {/* Attributes rendered here */}
      {item.date && (
        <div className="text-sm text-muted-foreground mb-2">
          <span className="font-medium">Date:</span>{" "}
          {formatDate(new Date(item.date), "PPP")}
        </div>
      )}

      {item.location && (
        <div className="text-sm text-muted-foreground mb-2">
          <span className="font-medium">Location:</span> {item.location}
        </div>
      )}

      {item.from && (
        <div className="text-sm text-muted-foreground mb-2">
          <span className="font-medium">From:</span> {item.from}
        </div>
      )}

      {item.to && (
        <div className="text-sm text-muted-foreground mb-2">
          <span className="font-medium">To:</span> {item.to}
        </div>
      )}

      {/* Content rendering */}
      <div className="mt-3">
        <ContentRenderer
          content={processedContent}
          allItems={allItems}
          handleWikiLinkClick={handleWikiLinkClick}
          onTaskToggle={handleTaskToggle}
        />
      </div>
    </div>
  );
};

export default ContentBody;
