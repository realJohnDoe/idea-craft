
import React, { useState, useEffect } from 'react';
import { Content, processContentLinks } from '@/lib/content-utils';
import { toast } from 'sonner';
import ContentHeader from './ContentHeader';
import ContentBody from './ContentBody';
import ContentFooter from './ContentFooter';
import ContentEditor from '../content-editor/ContentEditor';
import { cn } from '@/lib/utils';
import ContentTypeTags from './ContentTypeTags';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface ContentItemProps {
  item: Content;
  onUpdate: (updatedItem: Content) => void;
  onDelete: (id: string) => void;
  allItems?: Content[];
  isListView?: boolean;
  onSelect?: (item: Content) => void;
}

const ContentItem: React.FC<ContentItemProps> = ({ 
  item, 
  onUpdate, 
  onDelete, 
  allItems = [], 
  isListView = false,
  onSelect
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [processedContent, setProcessedContent] = useState(item.content);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (allItems.length > 0) {
      setProcessedContent(processContentLinks(item.content, allItems));
    }
  }, [item.content, allItems]);

  const handleLinkClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('content-link')) {
      e.stopPropagation();
      const itemId = target.getAttribute('data-item-id');
      if (itemId) {
        const linkedItem = allItems.find(item => item.id === itemId);
        if (linkedItem) {
          toast.info(`Linked to: ${linkedItem.title}`);
          
          const linkedElement = document.getElementById(`content-item-${itemId}`);
          if (linkedElement) {
            linkedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            linkedElement.classList.add('highlight-pulse');
            setTimeout(() => {
              linkedElement.classList.remove('highlight-pulse');
            }, 2000);
          }
        }
      }
    }
  };

  const getTypeClass = () => {
    const primaryType = getPrimaryContentType(item);
    switch (primaryType) {
      case 'task':
        return 'content-task';
      case 'event':
        return 'content-event';
      case 'note':
        return 'content-note';
      case 'mail':
        return 'content-mail';
      default:
        return '';
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditorUpdate = (updatedItem: Content) => {
    onUpdate(updatedItem);
    setIsEditing(false);
  };

  const handleEditorCancel = () => {
    setIsEditing(false);
  };

  const handleItemSelect = () => {
    if (onSelect && isListView) {
      onSelect(item);
    }
  };

  if (isEditing) {
    return (
      <ContentEditor 
        item={item} 
        onUpdate={handleEditorUpdate} 
        onCancel={handleEditorCancel}
      />
    );
  }

  if (isListView) {
    return (
      <div 
        id={`content-item-${item.id}`}
        className={cn(
          "list-content-item group py-2 px-3 border-b cursor-pointer",
          getTypeClass(),
          isHovered && "bg-muted/50"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleItemSelect}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {item.hasTaskAttributes && (
              <div className="mr-1">
                <input 
                  type="checkbox" 
                  checked={item.taskDone}
                  onChange={(e) => {
                    e.stopPropagation();
                    const { formatContentWithYaml } = require('@/lib/content-utils');
                    const updatedItem = { ...item, taskDone: e.target.checked };
                    updatedItem.yaml = formatContentWithYaml(updatedItem);
                    onUpdate(updatedItem);
                  }}
                  className="form-checkbox h-4 w-4 text-task border-task rounded"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            <h3 className={cn(
              "text-sm font-medium",
              item.hasTaskAttributes && item.taskDone && "line-through text-muted-foreground"
            )}>
              {item.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-2">
            <ContentTypeTags item={item} onUpdate={onUpdate} />
            
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 ml-2">
              <button 
                className="p-1 rounded hover:bg-muted transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick();
                }}
                aria-label="Edit item"
              >
                <span className="sr-only">Edit</span>
                <svg className="size-3 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button 
                className="p-1 rounded hover:bg-destructive/10 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                aria-label="Delete item"
              >
                <span className="sr-only">Delete</span>
                <svg className="size-3 text-destructive" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        </div>
        
        {item.eventDate && (
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Calendar className="size-3 text-event" />
            {format(item.eventDate, 'PPP')}
            {item.eventLocation && <span> • {item.eventLocation}</span>}
          </div>
        )}
        
        {item.content && (
          <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
            {item.content}
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      id={`content-item-${item.id}`}
      className={cn(
        "content-item group p-4 border rounded-lg shadow-sm",
        getTypeClass(),
        isHovered && "ring-1 ring-offset-1"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ContentHeader 
        item={item} 
        onUpdate={onUpdate} 
        onDelete={onDelete}
        onEdit={handleEditClick}
      />
      
      <ContentBody 
        item={item} 
        onUpdate={onUpdate} 
        processedContent={processedContent}
        handleLinkClick={handleLinkClick}
        allItems={allItems}
      />
      
      <ContentFooter 
        item={item} 
        onUpdate={onUpdate}
        onDelete={onDelete}
        onEdit={handleEditClick}
      />
    </div>
  );
};

export default ContentItem;
