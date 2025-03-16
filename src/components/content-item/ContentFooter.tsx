
import React from 'react';
import { Content, toggleContentAttribute, ContentAttributeType } from '@/lib/content-utils';
import { Edit, Copy, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface ContentFooterProps {
  item: Content;
  onUpdate: (updatedItem: Content) => void;
  handleCopy: () => void;
  onEdit: () => void;
}

const ContentFooter: React.FC<ContentFooterProps> = ({ item, onUpdate, handleCopy, onEdit }) => {
  // Handle adding a new attribute type
  const handleAddAttribute = () => {
    const attributesToAdd = ['task', 'event', 'mail'].filter(
      type => !item[`has${type.charAt(0).toUpperCase() + type.slice(1)}Attributes`]
    );
    
    if (attributesToAdd.length > 0) {
      onUpdate(toggleContentAttribute(item, attributesToAdd[0] as ContentAttributeType));
      toast.success(`Added ${attributesToAdd[0]} attributes`);
    } else {
      toast.info('All attribute types are already added');
    }
  };

  return (
    <div className="content-item-footer">
      <span className="text-xs text-muted-foreground">
        {format(item.updatedAt, 'PPP')}
      </span>
      
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
        <button 
          className="p-1 rounded hover:bg-muted transition-colors"
          onClick={onEdit}
          aria-label="Edit item"
        >
          <Edit className="size-3 text-muted-foreground" />
        </button>
        <button 
          className="p-1 rounded hover:bg-muted transition-colors"
          onClick={handleCopy}
          aria-label="Copy content"
        >
          <Copy className="size-3 text-muted-foreground" />
        </button>
        <button 
          className="p-1 rounded hover:bg-muted transition-colors"
          onClick={handleAddAttribute}
          aria-label="Add attribute"
        >
          <Plus className="size-3 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

export default ContentFooter;
