import React from "react";
import { Content } from "@/lib/content-utils";
import ContentItem from "@/components/content-item";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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

      <ContentItem
        item={item}
        onUpdate={onUpdate}
        onDelete={onDelete}
        allItems={allItems}
      />
    </div>
  );
};

export default SelectedItemView;
