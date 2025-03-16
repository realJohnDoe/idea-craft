
import React from 'react';
import { Content, ContentAttributeType } from '@/lib/content-utils';
import { cn } from '@/lib/utils';
import { Tag } from 'lucide-react';

interface ContentTypeTagsProps {
  item: Content;
}

const ContentTypeTags: React.FC<ContentTypeTagsProps> = ({ item }) => {
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
    <div className="flex flex-wrap gap-1">
      {getTypeTags()}
    </div>
  );
};

export default ContentTypeTags;
