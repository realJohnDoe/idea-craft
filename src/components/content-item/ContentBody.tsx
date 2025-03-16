import React from 'react';
import { Content, getPrimaryContentType } from '@/lib/content-utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CheckCircle, Calendar, FileText, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import ContentTypeTags from './ContentTypeTags';

interface ContentBodyProps {
  item: Content;
  onUpdate: (updatedItem: Content) => void;
  processedContent: string;
  handleLinkClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const ContentBody: React.FC<ContentBodyProps> = ({ 
  item,
  onUpdate,
  processedContent,
  handleLinkClick
}) => {
  // Handle task checkbox change
  const handleTaskChange = (checked: boolean) => {
    const { formatContentWithYaml } = require('@/lib/content-utils');
    const updatedItem = { ...item, taskDone: checked };
    updatedItem.yaml = formatContentWithYaml(updatedItem);
    onUpdate(updatedItem);
  };
  
  // Handle date change
  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      const { formatContentWithYaml } = require('@/lib/content-utils');
      const updatedItem = { ...item, eventDate: newDate };
      updatedItem.yaml = formatContentWithYaml(updatedItem);
      onUpdate(updatedItem);
    }
  };

  // Determine icon based on primary content type
  const getIcon = () => {
    const primaryType = getPrimaryContentType(item);
    switch (primaryType) {
      case 'task':
        return <CheckCircle className="size-5 text-task" />;
      case 'event':
        return <Calendar className="size-5 text-event" />;
      case 'note':
        return <FileText className="size-5 text-note" />;
      case 'mail':
        return <Mail className="size-5 text-mail" />;
      default:
        return <FileText className="size-5" />;
    }
  };

  return (
    <div className="content-item-body">
      <div className="flex items-center gap-2 mb-2">
        {getIcon()}
        <ContentTypeTags item={item} />
      </div>
      
      <AttributeSections item={item} onUpdate={onUpdate} handleTaskChange={handleTaskChange} handleDateChange={handleDateChange} />
      
      <div 
        className="text-sm text-muted-foreground whitespace-pre-line mt-2 content-text"
        onClick={handleLinkClick}
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    </div>
  );
};

// Extract AttributeSections to a separate component within the same file
const AttributeSections: React.FC<{
  item: Content;
  onUpdate: (updatedItem: Content) => void;
  handleTaskChange: (checked: boolean) => void;
  handleDateChange: (date: Date | undefined) => void;
}> = ({ item, handleTaskChange, handleDateChange }) => {
  return (
    <div className="space-y-3">
      {/* Task attributes */}
      {item.hasTaskAttributes && (
        <div className="flex items-center gap-2 p-2 bg-task-light/20 rounded-md">
          <Checkbox 
            id={`task-${item.id}`} 
            checked={item.taskDone} 
            onCheckedChange={handleTaskChange}
            className="text-task data-[state=checked]:bg-task data-[state=checked]:text-white border-task"
          />
          <label 
            htmlFor={`task-${item.id}`}
            className={cn(
              "text-sm cursor-pointer flex-grow", 
              item.taskDone && "line-through text-muted-foreground"
            )}
          >
            Complete this task
          </label>
        </div>
      )}
      
      {/* Event attributes */}
      {item.hasEventAttributes && (
        <div className="p-2 bg-event-light/20 rounded-md space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-sm text-event">
              <Calendar className="size-4" />
              <span>Date</span>
            </div>
            
            {item.eventLocation && (
              <div className="text-xs text-muted-foreground">
                {item.eventLocation}
              </div>
            )}
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal border-event/40 text-sm"
              >
                {item.eventDate ? format(item.eventDate, 'PPP') : <span>Select a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={item.eventDate}
                onSelect={handleDateChange}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
      
      {/* Mail attributes */}
      {item.hasMailAttributes && (
        <div className="p-2 bg-mail-light/20 rounded-md space-y-1">
          <div className="flex items-center gap-1.5 text-sm text-mail">
            <Mail className="size-4" />
            <span>Email</span>
          </div>
          <div className="grid text-xs space-y-0.5">
            {item.mailFrom && (
              <div className="flex">
                <span className="w-12 text-muted-foreground">From:</span>
                <span className="font-medium">{item.mailFrom}</span>
              </div>
            )}
            {item.mailTo && item.mailTo.length > 0 && (
              <div className="flex">
                <span className="w-12 text-muted-foreground">To:</span>
                <span className="font-medium">{item.mailTo.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentBody;
