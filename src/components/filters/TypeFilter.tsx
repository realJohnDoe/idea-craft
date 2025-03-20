
import React from 'react';
import { FileText, CheckCircle, Calendar, Mail, X } from 'lucide-react';

interface TypeFilterProps {
  activeFilter: string;
  toggleTypeTag: (type: string) => void;
}

const TypeFilter = ({ activeFilter, toggleTypeTag }: TypeFilterProps) => {
  const typeFilterTags = [
    { type: 'note', label: 'Notes', icon: <FileText className="size-3" />, className: 'bg-[#98C379] text-black' },
    { type: 'task', label: 'Tasks', icon: <CheckCircle className="size-3" />, className: 'bg-[#C678DD] text-white' },
    { type: 'event', label: 'Events', icon: <Calendar className="size-3" />, className: 'bg-[#61AFEF] text-black' },
    { type: 'mail', label: 'Emails', icon: <Mail className="size-3" />, className: 'bg-[#E5C07B] text-black' }
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
                ? 'bg-[#E06C75] text-white'
                : className + ' hover:opacity-90'
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
