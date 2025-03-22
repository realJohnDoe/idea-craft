import React from "react";
import { Content } from "@/lib/content-utils";

interface ContentHeaderProps {
  item: Content;
  onUpdate: (updatedItem: Content) => void;
  onDelete: (id: string) => void;
  onEdit: () => void;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({ item }) => {
  return (
    <div className="content-item-header bg-background p-2 rounded-md flex justify-between items-center mb-2">
      <h3 className=" text-base font-medium truncate">{item.title}</h3>
    </div>
  );
};

export default ContentHeader;
