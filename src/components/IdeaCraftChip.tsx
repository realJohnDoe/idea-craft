import React from "react";
import { FileText, CheckCircle, Calendar, Mail, X } from "lucide-react";

interface IdeaCraftChipProps {
  type: string;
  toggled: boolean;
  onClick: () => void;
}

const IdeaCraftChip: React.FC<IdeaCraftChipProps> = ({
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
    <button
      className={`hover:opacity-80 text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
        toggled ? "bg-red text-white" : className
      }`}
      onClick={onClick}
    >
      {icon}
      {label}
      {toggled && <X className="size-3" />}
    </button>
  );
};

export default IdeaCraftChip;
