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
      className: "bg-note text-note-foreground",
    },
    task: {
      type: "task",
      label: "Task",
      icon: <CheckCircle className="size-3" />,
      className: "bg-task text-task-foreground",
    },
    event: {
      type: "event",
      label: "Event",
      icon: <Calendar className="size-3" />,
      className: "bg-event text-event-foreground",
    },
    mail: {
      type: "mail",
      label: "Email",
      icon: <Mail className="size-3" />,
      className: "bg-mail text-mail-foreground",
    },
  };

  const { label, icon, className } = typeFilterTags[type];
  return (
    <BaseIdeaCraftChip
      label={label}
      prefixIcon={icon}
      suffixIcon={toggled && <X className="size-3" />}
      className={toggled ? "red" : className}
      onClick={onClick}
    />
  );
};

export default ColoredIdeaCraftChip;
