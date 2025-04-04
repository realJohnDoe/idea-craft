
import React from "react";
import { Item } from "@/lib/content-utils";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

interface ContentFooterProps {
  item: Item;
  onUpdate: (updatedItem: Item) => void;
  onDelete: (id: string) => void;
  onEdit: () => void;
}

const ContentFooter: React.FC<ContentFooterProps> = ({
  item,
  onDelete,
}) => {
  return (
    <div className="p-2 content-item-footer">
      <span className="text-xs text-muted-foreground">
        {format(item.updatedAt, "PPPP")}
      </span>

      <div className="flex space-x-1 transition-opacity">
        <button
          className="p-1 rounded transition-colors hover:bg-red/10"
          onClick={() => onDelete(item.id)}
          aria-label="Delete item"
        >
          <Trash2 className="size-3 text-red" />
        </button>
      </div>
    </div>
  );
};

export default ContentFooter;
