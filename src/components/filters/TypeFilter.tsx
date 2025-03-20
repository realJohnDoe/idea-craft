
import React from 'react';
import { FileText, CheckCircle, Calendar, Mail, X } from 'lucide-react';

interface TypeFilterProps {
  activeFilter: string;
  toggleTypeTag: (type: string) => void;
}

const TypeFilter = ({ activeFilter, toggleTypeTag }: TypeFilterProps) => {
  const typeFilterTags = [
    { type: 'note', label: 'Note', icon: <FileText className="size-3" />, className: 'bg-note text-note-foreground' },
    { type: 'task', label: 'Task', icon: <CheckCircle className="size-3" />, className: 'bg-task text-task-foreground' },
    { type: 'event', label: 'Event', icon: <Calendar className="size-3" />, className: 'bg-event text-event-foreground' },
    { type: 'mail', label: 'Email', icon: <Mail className="size-3" />, className: 'bg-mail text-mail-foreground' }
  ];

  return (
    <div className="mb-4">
      <div className="text-sm text-muted-foreground mb-2">Filter by type:</div>
      <div className="flex flex-wrap gap-1">
        {typeFilterTags.map(({ type, label, icon, className }) => (
          <button
            key={type}
            className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
              activeFilter === type
                ? 'bg-red text-white'
                : className + ' hover:opacity-80'
            }`}
            onClick={() => toggleTypeTag(type)}
          >
            {icon}
            {label}
            {activeFilter === type && <X className="size-3" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TypeFilter;
