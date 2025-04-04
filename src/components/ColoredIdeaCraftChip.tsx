
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
      color: "var(--note)",
      bgColor: "var(--note)",
      textColor: "var(--note-foreground)",
    },
    task: {
      label: "Task",
      icon: <CheckCircle className="size-3" />,
      color: "var(--task)",
      bgColor: "var(--task)",
      textColor: "var(--task-foreground)",
    },
    event: {
      label: "Event",
      icon: <Calendar className="size-3" />,
      color: "var(--event)",
      bgColor: "var(--event)",
      textColor: "var(--event-foreground)",
    },
    mail: {
      label: "Email",
      icon: <Mail className="size-3" />,
      color: "var(--mail)",
      bgColor: "var(--mail)",
      textColor: "var(--mail-foreground)",
    },
  };

  const { label, icon, color, bgColor, textColor } = typeFilterTags[type];
  
  // Apply styles through style attribute to avoid tailwind class name issues
  const style: React.CSSProperties = {
    border: `1px solid ${color}`,
    color: toggled ? textColor : color,
    backgroundColor: toggled ? bgColor : 'transparent',
  };

  // Add hover styles if onClick is provided
  const hoverStyle = onClick ? {
    transition: 'background-color 0.2s, color 0.2s',
    cursor: 'pointer',
  } : { cursor: 'default' };

  // Combine styles
  const combinedStyle = { ...style, ...hoverStyle };

  return (
    <BaseIdeaCraftChip
      label={label}
      prefixIcon={icon}
      className=""
      onClick={onClick}
      style={combinedStyle}
    />
  );
};

export default ColoredIdeaCraftChip;
