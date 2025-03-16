
import React, { useState } from 'react';
import { Content, getPrimaryContentType, formatContentWithYaml } from '@/lib/content-utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { format } from 'date-fns';
import { CheckCircle, Calendar, FileText, Mail, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import ContentTypeTags from './ContentTypeTags';

interface ContentBodyProps {
  item: Content;
  onUpdate: (updatedItem: Content) => void;
  processedContent: string;
  handleLinkClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  allItems?: Content[];
}

const ContentBody: React.FC<ContentBodyProps> = ({ 
  item,
  onUpdate,
  processedContent,
  handleLinkClick,
  allItems = []
}) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // Handle task checkbox change
  const handleTaskChange = (checked: boolean) => {
    const updatedItem = { ...item, taskDone: checked };
    updatedItem.yaml = formatContentWithYaml(updatedItem);
    onUpdate(updatedItem);
  };
  
  // Handle date change
  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
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

  // Toggle embedded item expansion
  const toggleItemExpansion = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Process content to include embedded items
  const renderProcessedContent = () => {
    // If no linked items or no allItems, just render the processed content
    if (!processedContent.includes('content-link') || !allItems.length) {
      return (
        <div 
          className="text-sm text-muted-foreground whitespace-pre-line mt-2 content-text"
          onClick={handleLinkClick}
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      );
    }

    // Split the content by links to handle embedded items
    const parts = processedContent.split(/<span class="content-link" data-item-id="(.*?)">(.*?)<\/span>/g);
    const result = [];

    for (let i = 0; i < parts.length; i += 3) {
      // Add the text before the link
      if (parts[i]) {
        result.push(
          <span key={`text-${i}`} className="whitespace-pre-line">{parts[i]}</span>
        );
      }

      // Add the embedded item if we have a link
      if (i + 2 < parts.length) {
        const itemId = parts[i + 1];
        const itemTitle = parts[i + 2];
        const linkedItem = allItems.find(item => item.id === itemId);

        if (linkedItem) {
          result.push(
            <EmbeddedItem 
              key={`embed-${itemId}-${i}`}
              item={linkedItem}
              onUpdate={onUpdate}
              isExpanded={expandedItems[itemId]}
              toggleExpansion={() => toggleItemExpansion(itemId)}
            />
          );
        } else {
          // If linked item not found, just display as a regular link
          result.push(
            <span 
              key={`link-${i}`} 
              className="content-link" 
              data-item-id={itemId}
              onClick={handleLinkClick}
            >
              {itemTitle}
            </span>
          );
        }
      }
    }

    return <div className="text-sm text-muted-foreground mt-2 content-text">{result}</div>;
  };

  return (
    <div className="content-item-body">
      <div className="flex items-center gap-2 mb-2">
        {getIcon()}
        <ContentTypeTags item={item} onUpdate={onUpdate} />
      </div>
      
      <AttributeSections item={item} onUpdate={onUpdate} handleTaskChange={handleTaskChange} handleDateChange={handleDateChange} />
      
      {renderProcessedContent()}
    </div>
  );
};

// Embedded item component
const EmbeddedItem: React.FC<{ 
  item: Content; 
  onUpdate: (updatedItem: Content) => void;
  isExpanded: boolean;
  toggleExpansion: () => void;
}> = ({ item, onUpdate, isExpanded, toggleExpansion }) => {
  // Task checkbox change handler for embedded tasks
  const handleTaskChange = (checked: boolean) => {
    const updatedItem = { ...item, taskDone: checked };
    updatedItem.yaml = formatContentWithYaml(updatedItem);
    onUpdate(updatedItem);
  };

  return (
    <Collapsible 
      open={isExpanded} 
      onOpenChange={toggleExpansion}
      className="my-2 border rounded-md overflow-hidden bg-muted/30"
    >
      <div className="flex items-center gap-2 px-2 py-1">
        {item.hasTaskAttributes && (
          <Checkbox 
            id={`embedded-task-${item.id}`} 
            checked={item.taskDone} 
            onCheckedChange={handleTaskChange}
            onClick={(e) => e.stopPropagation()}
            className="text-task data-[state=checked]:bg-task data-[state=checked]:text-white border-task"
          />
        )}
        
        <ContentTypeTags item={item} onUpdate={onUpdate} />
        
        <CollapsibleTrigger asChild className="flex-grow">
          <Button 
            variant="ghost" 
            className="px-2 h-8 w-full flex items-center justify-between text-sm hover:bg-muted"
          >
            <span className={cn(
              "font-medium text-primary",
              item.hasTaskAttributes && item.taskDone && "line-through text-muted-foreground"
            )}>
              {item.title}
            </span>
            {isExpanded ? 
              <ChevronDown className="size-4 text-muted-foreground" /> : 
              <ChevronRight className="size-4 text-muted-foreground" />
            }
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="p-3 bg-background border-t">
        {/* Show content details without nested embeddings */}
        <div className="text-sm text-muted-foreground whitespace-pre-line">
          {item.content}
        </div>
        
        {/* Show specific attributes based on type */}
        {item.hasEventAttributes && item.eventDate && (
          <div className="mt-2 p-2 bg-event-light/20 rounded-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-event">
                <Calendar className="size-3" />
                <span>{format(item.eventDate, 'PPP')}</span>
              </div>
              {item.eventLocation && (
                <div className="text-xs text-muted-foreground">
                  {item.eventLocation}
                </div>
              )}
            </div>
          </div>
        )}
        
        {item.hasMailAttributes && (
          <div className="mt-2 p-2 bg-mail-light/20 rounded-sm">
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
      </CollapsibleContent>
    </Collapsible>
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
