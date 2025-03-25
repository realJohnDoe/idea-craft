import React, { useState } from "react";
import { Content } from "@/lib/content-utils";

import ColoredIdeaCraftChip from "../ColoredIdeaCraftChip";
import BaseIdeaCraftChip from "../BaseIdeaCraftChip";

interface ContentTypeTagsProps {
  item: Content;
}

const ContentTypeTags: React.FC<ContentTypeTagsProps> = ({ item }) => {
  // Get content type tag elements
  const getTypeTags = () => {
    const tags = [];

    if (item.hasTaskAttributes) {
      tags.push(
        <ColoredIdeaCraftChip
          key="task"
          type={"task"}
          toggled={false}
          onClick={() => {}}
        />
      );
    }

    if (item.hasEventAttributes) {
      tags.push(
        <ColoredIdeaCraftChip
          key="event"
          type={"event"}
          toggled={false}
          onClick={() => {}}
        />
      );
    }

    if (item.hasMailAttributes) {
      tags.push(
        <ColoredIdeaCraftChip
          key="mail"
          type={"mail"}
          toggled={false}
          onClick={() => {}}
        />
      );
    }

    if (
      item.hasNoteAttributes &&
      !item.hasTaskAttributes &&
      !item.hasEventAttributes &&
      !item.hasMailAttributes
    ) {
      tags.push(
        <ColoredIdeaCraftChip
          key={"note"}
          type={"note"}
          toggled={false}
          onClick={() => {}}
        />
      );
    }

    // Add user tags if present
    if (item.tags && item.tags.length > 0) {
      item.tags.forEach((tag, idx) => {
        tags.push(
          <BaseIdeaCraftChip
            key={tag}
            label={tag}
            className="bg-muted text-muted-foreground"
            onClick={() => {}}
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
