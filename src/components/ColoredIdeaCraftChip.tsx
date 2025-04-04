import React from "react";
import { FileText, CheckCircle, Calendar, Mail } from "lucide-react";
import BaseIdeaCraftChip from "./BaseIdeaCraftChip";

interface ColoredIdeaCraftChipProps {
  type: "note" | "task" | "event" | "mail";
  toggled: boolean;
  onClick?: () => void;
}

const ColoredIdeaCraftChip: React.FC<ColoredIdeaCraftChipProps> = ({
  type,
  toggled,
  onClick,
}) => {
  const typeFilterTags = {
    note: {
      label: "Note",
      icon: <FileText className="size-3" />,
      className: "border-note",
    },
    task: {
      label: "Task",
      icon: <CheckCircle className="size-3" />,
      className: "border-task",
    },
    event: {
      label: "Event",
      icon: <Calendar className="size-3" />,
      className: "border-event",
    },
    mail: {
      label: "Email",
      icon: <Mail className="size-3" />,
      className: "border-mail",
    },
  };

  const { label, icon, className } = typeFilterTags[type];
  let finalClassName = `border ${className}`;

  if (onClick !== undefined) {
    const hoverClass =
      type === "note"
        ? "hover:text-note hover:bg-note/60 hover:text-note-foreground"
        : type === "task"
        ? "hover:text-task hover:bg-task/60 hover:text-task-foreground"
        : type === "event"
        ? "hover:text-event hover:bg-event/60 hover:text-event-foreground"
        : "hover:text-mail hover:bg-mail/60 hover:text-mail-foreground";
    finalClassName += ` ${hoverClass}`;
  } else {
    finalClassName += " cursor-default";
  }

  if (toggled) {
    const bgClass =
      type === "note"
        ? "bg-note text-note-foreground"
        : type === "task"
        ? "bg-task text-task-foreground"
        : type === "event"
        ? "bg-event text-event-foreground"
        : "bg-mail text-mail-foreground";
    finalClassName += ` ${bgClass} text-white`;
  } else {
    const textClass =
      type === "note"
        ? "text-note"
        : type === "task"
        ? "text-task"
        : type === "event"
        ? "text-event"
        : "text-mail";
    finalClassName += ` ${textClass}`;
  }

  return (
    <BaseIdeaCraftChip
      label={label}
      prefixIcon={icon}
      className={finalClassName}
      onClick={onClick}
    />
  );
};

export default ColoredIdeaCraftChip;
