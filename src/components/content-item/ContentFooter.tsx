
import React from 'react';
import { Content } from '@/lib/content-utils';
import { Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface ContentFooterProps {
  item: Content;
  onUpdate: (updatedItem: Content) => void;
  onDelete: (id: string) => void;
  onEdit: () => void;
}

const ContentFooter: React.FC<ContentFooterProps> = ({ item, onDelete, onEdit }) => {
  return (
    <div className="content-item-footer">
      <span className="text-xs text-muted-foreground">
        {format(item.updatedAt, 'PPP')}
      </span>
      
      <div className="transition-opacity flex space-x-1">
        <button 
          className="p-1 rounded hover:opacity-80 transition-colors"
          onClick={onEdit}
          aria-label="Edit item"
        >
          <Edit className="size-3 text-muted-foreground" />
        </button>
        <button 
          className="p-1 rounded hover:bg-red/10 transition-colors"
          onClick={() => onDelete(item.id)}
          aria-label="Delete item"
        >
          <Trash2 className="size-3 text-red" />
        </button>
      </div>
    </div>
  );
};

export default ContentFooter;
