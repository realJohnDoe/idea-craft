
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
      className: "border-blue-400 text-blue-500"
    },
    task: {
      label: "Task",
      icon: <CheckCircle className="size-3" />,
      className: "border-green-400 text-green-500"
    },
    event: {
      label: "Event",
      icon: <Calendar className="size-3" />,
      className: "border-orange-400 text-orange-500"
    },
    mail: {
      label: "Email",
      icon: <Mail className="size-3" />,
      className: "border-purple-400 text-purple-500"
    },
  };

  const { label, icon, className } = typeFilterTags[type];
  let finalClassName = `border ${className}`;
  
  if (onClick !== undefined) {
    const hoverClass = type === 'note' ? 'hover:bg-blue-500' : 
                       type === 'task' ? 'hover:bg-green-500' :
                       type === 'event' ? 'hover:bg-orange-500' : 
                       'hover:bg-purple-500';
    finalClassName += ` ${hoverClass} hover:text-white`;
  } else {
    finalClassName += " cursor-default";
  }
  
  if (toggled) {
    const bgClass = type === 'note' ? 'bg-blue-500' : 
                   type === 'task' ? 'bg-green-500' :
                   type === 'event' ? 'bg-orange-500' : 
                   'bg-purple-500';
    finalClassName += ` ${bgClass} text-white`;
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
