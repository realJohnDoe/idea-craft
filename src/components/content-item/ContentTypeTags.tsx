import React from "react";
import {
  hasEventAttributes,
  hasMailAttributes,
  hasNoteAttributes,
  hasTaskAttributes,
  toggleItemAttribute,
  Item,
  ContentAttributeType,
} from "@/lib/content-utils";

import ColoredIdeaCraftChip from "../ColoredIdeaCraftChip";
import BaseIdeaCraftChip from "../BaseIdeaCraftChip";
import { Pencil, X } from "lucide-react";

interface ContentTypeTagsProps {
  item: Item;
  editable?: boolean;
  onRemoveTag?: (tag: string) => void;
  onToggleType?: (type: ContentAttributeType) => void;
  onEditTags?: () => void;
}

const ContentTypeTags: React.FC<ContentTypeTagsProps> = ({
  item,
  editable = false,
  onRemoveTag,
  onToggleType,
  onEditTags,
}) => {
  // Get content type tag elements
  const getTypeTags = () => {
    const tags = [];

    if (hasTaskAttributes(item)) {
      tags.push(
        <ColoredIdeaCraftChip
          key="task"
          type="task"
          toggled={true}
          onClick={
            editable && onToggleType ? () => onToggleType("task") : undefined
          }
        />
      );
    } else if (editable && onToggleType) {
      tags.push(
        <ColoredIdeaCraftChip
          key="task"
          type="task"
          toggled={false}
          onClick={() => onToggleType("task")}
        />
      );
    }

    if (hasEventAttributes(item)) {
      tags.push(
        <ColoredIdeaCraftChip
          key="event"
          type="event"
          toggled={true}
          onClick={
            editable && onToggleType ? () => onToggleType("event") : undefined
          }
        />
      );
    } else if (editable && onToggleType) {
      tags.push(
        <ColoredIdeaCraftChip
          key="event"
          type="event"
          toggled={false}
          onClick={() => onToggleType("event")}
        />
      );
    }

    if (hasMailAttributes(item)) {
      tags.push(
        <ColoredIdeaCraftChip
          key="mail"
          type="mail"
          toggled={true}
          onClick={
            editable && onToggleType ? () => onToggleType("mail") : undefined
          }
        />
      );
    } else if (editable && onToggleType) {
      tags.push(
        <ColoredIdeaCraftChip
          key="mail"
          type="mail"
          toggled={false}
          onClick={() => onToggleType("mail")}
        />
      );
    }

    if (hasNoteAttributes(item)) {
      tags.push(
        <ColoredIdeaCraftChip
          key="note"
          type="note"
          toggled={true}
          onClick={undefined}
        />
      );
    } else if (editable && onToggleType) {
      tags.push(
        <ColoredIdeaCraftChip
          key="note"
          type="note"
          toggled={false}
          onClick={undefined}
        />
      );
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
    <div className="flex flex-wrap gap-1 items-center">
      {getTypeTags()}
      {editable && onEditTags && (
        <div
          className="cursor-pointer ml-1 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          onClick={onEditTags}
        >
          <Pencil className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};

export default ContentTypeTags;
