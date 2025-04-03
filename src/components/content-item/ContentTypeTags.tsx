
import React from "react";
import { Calendar, Mail, CheckSquare, FileText } from "lucide-react";
import { Item } from "@/lib/content-utils";
import ColoredIdeaCraftChip from "@/components/ColoredIdeaCraftChip";
import BaseIdeaCraftChip from "../BaseIdeaCraftChip";

interface ContentTypeTagsProps {
  item: Item;
  onClick?: (type: string) => void;
}

const ContentTypeTags: React.FC<ContentTypeTagsProps> = ({
  item,
  onClick = () => {},
}) => {
  const { done, date, from, to } = item;

  const isTask = done !== undefined;
  const isEvent = date !== undefined;
  const isMail = from !== undefined || to !== undefined;
  const isNote = !isTask && !isEvent && !isMail;

  return (
    <div className="flex flex-wrap gap-1">
      {isTask && (
        <ColoredIdeaCraftChip
          label="Task"
          icon={<CheckSquare className="size-3" />}
          type="task"
          onClick={() => onClick("task")}
        />
      )}

      {isEvent && (
        <ColoredIdeaCraftChip
          label="Event"
          icon={<Calendar className="size-3" />}
          type="event"
          onClick={() => onClick("event")}
        />
      )}

      {isMail && (
        <ColoredIdeaCraftChip
          label="Mail"
          icon={<Mail className="size-3" />}
          type="mail"
          onClick={() => onClick("mail")}
        />
      )}

      {isNote && (
        <ColoredIdeaCraftChip
          label="Note"
          icon={<FileText className="size-3" />}
          type="note"
          onClick={() => onClick("note")}
        />
      )}

      {item.tags && item.tags.length > 0 && 
        item.tags.map((tag) => (
          <BaseIdeaCraftChip
            key={tag}
            label={tag}
            type="tag"
            className="bg-muted text-muted-foreground border border-muted-foreground/20"
            onClick={() => onClick("tag")}
          />
        ))}
    </div>
  );
};

export default ContentTypeTags;
