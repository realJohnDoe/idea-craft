
import React, { useState } from 'react';
import { Content, ContentAttributeType, toggleContentAttribute } from '@/lib/content-utils';
import { cn } from '@/lib/utils';
import { Tag, Plus, CheckCircle, Calendar, Mail, X } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ContentTypeTagsProps {
  item: Content;
  onUpdate: (updatedItem: Content) => void;
}

const ContentTypeTags: React.FC<ContentTypeTagsProps> = ({ item, onUpdate }) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [customTag, setCustomTag] = useState('');
  
  // Get tag color based on content type
  const getTagClass = (type: ContentAttributeType) => {
    switch (type) {
      case 'task':
        return 'bg-task text-task-foreground';
      case 'event':
        return 'bg-event text-event-foreground';
      case 'note':
        return 'bg-note text-note-foreground';
      case 'mail':
        return 'bg-mail text-mail-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  // Add attribute to content
  const handleAddAttribute = (type: ContentAttributeType) => {
    onUpdate(toggleContentAttribute(item, type));
    setIsAddingTag(false);
    toast.success(`Added ${type} attributes`);
  };

  // Add custom tag
  const handleAddCustomTag = () => {
    if (customTag.trim() === '') return;
    
    // Don't add duplicate tags
    if (item.tags && item.tags.includes(customTag.trim())) {
      toast.error('Tag already exists');
      return;
    }
    
    // Create new item with the tag added
    const updatedItem = { ...item, tags: [...(item.tags || []), customTag.trim()] };
    onUpdate(updatedItem);
    setCustomTag('');
    toast.success('Tag added');
  };

  // Remove a tag
  const handleRemoveTag = (tag: string) => {
    const updatedItem = {
      ...item,
      tags: item.tags?.filter(t => t !== tag) || []
    };
    onUpdate(updatedItem);
    toast.success('Tag removed');
  };
  
  // Get content type tag elements
  const getTypeTags = () => {
    const tags = [];
    
    if (item.hasTaskAttributes) {
      tags.push(
        <span key="task" className={cn("content-item-tag", getTagClass('task'))}>
          Task
        </span>
      );
    }
    
    if (item.hasEventAttributes) {
      tags.push(
        <span key="event" className={cn("content-item-tag", getTagClass('event'))}>
          Event
        </span>
      );
    }
    
    if (item.hasMailAttributes) {
      tags.push(
        <span key="mail" className={cn("content-item-tag", getTagClass('mail'))}>
          Mail
        </span>
      );
    }
  
    if (item.hasNoteAttributes && !item.hasTaskAttributes && !item.hasEventAttributes && !item.hasMailAttributes) {
      tags.push(
        <span key="note" className={cn("content-item-tag", getTagClass('note'))}>
          Note
        </span>
      );
    }
    
    // Add user tags if present
    if (item.tags && item.tags.length > 0) {
      item.tags.forEach((tag, idx) => {
        tags.push(
          <span key={`tag-${idx}`} className="content-item-tag bg-muted text-muted-foreground flex items-center gap-1 group">
            <Tag className="size-3" />
            {tag}
            <button 
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveTag(tag);
              }}
            >
              <X className="size-3 text-muted-foreground hover:text-foreground" />
            </button>
          </span>
        );
      });
    }
    
    return tags;
  };

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {getTypeTags()}
      
      <Popover open={isAddingTag} onOpenChange={setIsAddingTag}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="size-6 rounded-full"
          >
            <Plus className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground mb-1">Add attributes or tags:</p>
            
            {/* Type attributes */}
            <div className="space-y-1 mb-2">
              {!item.hasTaskAttributes && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="justify-start gap-2 w-full"
                  onClick={() => handleAddAttribute('task')}
                >
                  <CheckCircle className="size-4 text-task" />
                  Task
                </Button>
              )}
              {!item.hasEventAttributes && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="justify-start gap-2 w-full"
                  onClick={() => handleAddAttribute('event')}
                >
                  <Calendar className="size-4 text-event" />
                  Event
                </Button>
              )}
              {!item.hasMailAttributes && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="justify-start gap-2 w-full"
                  onClick={() => handleAddAttribute('mail')}
                >
                  <Mail className="size-4 text-mail" />
                  Mail
                </Button>
              )}
            </div>
            
            {/* Custom tag input */}
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground mb-1">Add custom tag:</p>
              <div className="flex gap-1">
                <Input
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  placeholder="Tag name"
                  className="h-8 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddCustomTag();
                    }
                  }}
                />
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleAddCustomTag}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ContentTypeTags;
