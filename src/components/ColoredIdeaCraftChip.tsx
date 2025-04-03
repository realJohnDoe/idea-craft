import React from "react";
import { FileText, CheckCircle, Calendar, Mail, X } from "lucide-react";
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
    },
    task: {
      label: "Task",
      icon: <CheckCircle className="size-3" />,
    },
    event: {
      label: "Event",
      icon: <Calendar className="size-3" />,
    },
    mail: {
      label: "Email",
      icon: <Mail className="size-3" />,
    },
  };

  const { label, icon } = typeFilterTags[type];
  let className = `border border-${type} text-${type}`;
  if (onClick !== undefined) {
    className += ` hover:bg-${type}/80 hover:text-task-foreground`;
  } else {
    className += " cursor-default";
  }
  if (toggled) {
    className += ` bg-${type} text-task-foreground`;
  }
  return (
    <BaseIdeaCraftChip
      label={label}
      prefixIcon={icon}
      className={className}
      onClick={onClick}
    />
  );
};

export default ColoredIdeaCraftChip;
