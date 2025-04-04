import React from "react";
import {
  hasEventAttributes,
  hasMailAttributes,
  hasNoteAttributes,
  hasTaskAttributes,
  Item,
} from "@/lib/content-utils";

import ColoredIdeaCraftChip from "../ColoredIdeaCraftChip";
import BaseIdeaCraftChip from "../BaseIdeaCraftChip";
import { X } from "lucide-react";

interface ContentTypeTagsProps {
  item: Item;
  editable?: boolean;
  onRemoveTag?: (tag: string) => void;
}

const ContentTypeTags: React.FC<ContentTypeTagsProps> = ({
  item,
  editable = false,
  onRemoveTag,
}) => {
  // Get content type tag elements
  const getTypeTags = () => {
    const tags = [];

    if (hasTaskAttributes(item)) {
      tags.push(<ColoredIdeaCraftChip key="task" type="task" toggled={true} />);
    }

    if (hasEventAttributes(item)) {
      tags.push(
        <ColoredIdeaCraftChip key="event" type="event" toggled={true} />
      );
    }

    if (hasMailAttributes(item)) {
      tags.push(<ColoredIdeaCraftChip key="mail" type="mail" toggled={true} />);
    }

    if (hasNoteAttributes(item)) {
      tags.push(<ColoredIdeaCraftChip key="note" type="note" toggled={true} />);
    }

    // Add user tags if present
    if (item.tags && item.tags.length > 0) {
      item.tags.forEach((tag) => {
        tags.push(
          <BaseIdeaCraftChip
            key={tag}
            label={tag}
            className="bg-muted cursor-default text-muted-foreground border border-muted-foreground/20"
            onClick={() => {}}
            suffixIcon={
              editable && onRemoveTag ? (
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveTag(tag);
                  }}
                />
              ) : undefined
            }
          />
        );
      });
    }

    return tags;
  };

  return (
    <div className="flex flex-wrap gap-1 items-center">{getTypeTags()}</div>
  );
};

export default ContentTypeTags;
