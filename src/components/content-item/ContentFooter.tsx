
import React from 'react';
import { Content, toggleContentAttribute, ContentAttributeType } from '@/lib/content-utils';
import { Edit, Copy, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface ContentFooterProps {
  item: Content;
  onUpdate: (updatedItem: Content) => void;
  handleCopy: () => void;
}

const ContentFooter: React.FC<ContentFooterProps> = ({ item, onUpdate, handleCopy }) => {
  return (
    <div className="content-item-footer">
      <span className="text-xs text-muted-foreground">
        {format(item.updatedAt, 'PPP')}
      </span>
      
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
        <button 
          className="p-1 rounded hover:bg-muted transition-colors"
          onClick={() => toast.info('Edit functionality coming soon')}
        >
          <Edit className="size-3 text-muted-foreground" />
        </button>
        <button 
          className="p-1 rounded hover:bg-muted transition-colors"
          onClick={handleCopy}
        >
          <Copy className="size-3 text-muted-foreground" />
        </button>
        <button 
          className="p-1 rounded hover:bg-muted transition-colors"
          onClick={() => {
            const attributesToAdd = ['task', 'event', 'mail'].filter(
              type => !item[`has${type.charAt(0).toUpperCase() + type.slice(1)}Attributes`]
            );
            if (attributesToAdd.length > 0) {
              const { toggleContentAttribute } = require('@/lib/content-utils');
              onUpdate(toggleContentAttribute(item, attributesToAdd[0] as ContentAttributeType));
            }
          }}
        >
          <Plus className="size-3 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

export default ContentFooter;
