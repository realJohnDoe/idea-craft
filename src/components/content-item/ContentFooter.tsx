import React from "react";
import { Content } from "@/lib/content-utils";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface ContentFooterProps {
  item: Content;
  onUpdate: (updatedItem: Content) => void;
  onDelete: (id: string) => void;
  onEdit: () => void;
}

const ContentFooter: React.FC<ContentFooterProps> = ({
  item,
  onDelete,
  onEdit,
}) => {
  return (
    <div className="p-2 content-item-footer">
      <span className="text-xs text-muted-foreground">
        {format(item.updatedAt, "PPP")}
      </span>

      <div className="flex space-x-1 transition-opacity">
        <button
          className="p-1 rounded transition-colors hover:opacity-80"
          onClick={onEdit}
          aria-label="Edit item"
        >
          <Edit className="size-3 text-muted-foreground" />
        </button>
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
