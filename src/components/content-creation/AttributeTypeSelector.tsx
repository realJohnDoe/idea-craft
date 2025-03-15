
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Mail, X } from 'lucide-react';
import { ContentAttributeType } from '@/lib/content-utils';

interface AttributeTypeSelectorProps {
  hasTaskAttributes: boolean;
  hasEventAttributes: boolean;
  hasMailAttributes: boolean;
  hasNoteAttributes: boolean;
  toggleAttribute: (type: ContentAttributeType) => void;
}

const AttributeTypeSelector: React.FC<AttributeTypeSelectorProps> = ({
  hasTaskAttributes,
  hasEventAttributes,
  hasMailAttributes,
  toggleAttribute
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={hasTaskAttributes ? "default" : "outline"}
        size="sm"
        onClick={() => toggleAttribute('task')}
        className={cn(
          "gap-1.5",
          hasTaskAttributes && "bg-task hover:bg-task/90"
        )}
      >
        <CheckCircle className="size-4" />
        <span>Task</span>
        {hasTaskAttributes && (
          <X className="size-3 ml-1 opacity-70" onClick={(e) => {
            e.stopPropagation();
            toggleAttribute('task');
          }} />
        )}
      </Button>
      
      <Button
        variant={hasEventAttributes ? "default" : "outline"}
        size="sm"
        onClick={() => toggleAttribute('event')}
        className={cn(
          "gap-1.5",
          hasEventAttributes && "bg-event hover:bg-event/90"
        )}
      >
        <Calendar className="size-4" />
        <span>Event</span>
        {hasEventAttributes && (
          <X className="size-3 ml-1 opacity-70" onClick={(e) => {
            e.stopPropagation();
            toggleAttribute('event');
          }} />
        )}
      </Button>
      
      <Button
        variant={hasMailAttributes ? "default" : "outline"}
        size="sm"
        onClick={() => toggleAttribute('mail')}
        className={cn(
          "gap-1.5",
          hasMailAttributes && "bg-mail hover:bg-mail/90"
        )}
      >
        <Mail className="size-4" />
        <span>Mail</span>
        {hasMailAttributes && (
          <X className="size-3 ml-1 opacity-70" onClick={(e) => {
            e.stopPropagation();
            toggleAttribute('mail');
          }} />
        )}
      </Button>
      
      {/* Note type has been removed since everything is automatically a note if it has no other attributes */}
    </div>
  );
};

export default AttributeTypeSelector;
