
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
import { toast } from 'sonner';

interface ContentTypeTagsProps {
  item: Content;
  onUpdate: (updatedItem: Content) => void;
}

const ContentTypeTags: React.FC<ContentTypeTagsProps> = ({ item, onUpdate }) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  
  // Get tag color based on content type
  const getTagClass = (type: ContentAttributeType) => {
    switch (type) {
      case 'task':
        return 'bg-task-light text-task';
      case 'event':
        return 'bg-event-light text-event';
      case 'note':
        return 'bg-note-light text-note';
      case 'mail':
        return 'bg-mail-light text-mail';
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
          <span key={`tag-${idx}`} className="content-item-tag bg-muted text-muted-foreground flex items-center gap-1">
            <Tag className="size-3" />
            {tag}
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
          <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground mb-1">Add attribute type:</p>
            {!item.hasTaskAttributes && (
              <Button 
                size="sm" 
                variant="outline"
                className="justify-start gap-2"
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
                className="justify-start gap-2"
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
                className="justify-start gap-2"
                onClick={() => handleAddAttribute('mail')}
              >
                <Mail className="size-4 text-mail" />
                Mail
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ContentTypeTags;
