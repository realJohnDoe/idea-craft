
import React from 'react';
import { Content } from '@/lib/content-utils';
import { MoreVertical, Trash2, Copy, Pencil } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface ContentHeaderProps {
  item: Content;
  onUpdate: (updatedItem: Content) => void;
  onDelete: (id: string) => void;
  onEdit: () => void;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({ 
  item, 
  onDelete,
  onEdit
}) => {
  return (
    <div className="content-item-header flex justify-between items-center mb-2">
      <h3 className="text-base font-medium truncate">{item.title}</h3>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="content-item-menu-trigger opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded-full hover:bg-muted transition-opacity">
            <MoreVertical className="size-4" />
            <span className="sr-only">More options</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => {
              const { formatContentWithYaml } = require('@/lib/content-utils');
              navigator.clipboard.writeText(formatContentWithYaml(item));
            }}
          >
            <Copy className="size-4 mr-2" />
            Copy
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive" 
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ContentHeader;
