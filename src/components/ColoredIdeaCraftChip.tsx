import React from "react";
import { FileText, CheckCircle, Calendar, Mail, X } from "lucide-react";
import BaseIdeaCraftChip from "./BaseIdeaCraftChip";

interface IdeaCraftChipProps {
  type: string;
  toggled: boolean;
  onClick: () => void;
}

const ColoredIdeaCraftChip: React.FC<IdeaCraftChipProps> = ({
  type,
  toggled,
  onClick,
}) => {
  const typeFilterTags = {
    note: {
      label: "Note",
      icon: <FileText className="size-3" />,
      className: "bg-note hover:bg-note/80 text-note-foreground",
    },
    task: {
      type: "task",
      label: "Task",
      icon: <CheckCircle className="size-3" />,
      className: "bg-task hover:bg-task/80 text-task-foreground",
    },
    event: {
      type: "event",
      label: "Event",
      icon: <Calendar className="size-3" />,
      className: "bg-event hover:bg-event/80 text-event-foreground",
    },
    mail: {
      type: "mail",
      label: "Email",
      icon: <Mail className="size-3" />,
      className: "bg-mail hover:bg-mail/80 text-mail-foreground",
    },
  };

  const { label, icon, className } = typeFilterTags[type];
  return (
    <BaseIdeaCraftChip
      label={label}
      prefixIcon={icon}
      suffixIcon={toggled && <X className="size-3" />}
      className={
        toggled ? "bg-red hover:bg-red/80 text-red-foreground " : className
      }
      onClick={onClick}
    />
  );
};

export default ColoredIdeaCraftChip;
