import React, { useState } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  Content, 
  formatContentWithYaml, 
  getPrimaryContentType,
  toggleContentAttribute,
  ContentAttributeType
} from '@/lib/content-utils';
import { 
  CheckCircle, 
  Calendar, 
  FileText, 
  Mail, 
  MoreHorizontal, 
  Edit, 
  RefreshCw, 
  Copy, 
  Trash, 
  Plus,
  X,
  Tag
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface ContentItemProps {
  item: Content;
  onUpdate: (updatedItem: Content) => void;
  onDelete: (id: string) => void;
}

const ContentItem: React.FC<ContentItemProps> = ({ item, onUpdate, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [date, setDate] = useState<Date | undefined>(item.eventDate);
  
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
      setDate(newDate);
    }
  };

  // Toggle attribute type
  const handleToggleAttribute = (attributeType: ContentAttributeType) => {
    const updatedItem = toggleContentAttribute(item, attributeType);
    onUpdate(updatedItem);
    toast.success(`${attributeType.charAt(0).toUpperCase() + attributeType.slice(1)} attributes ${updatedItem[`has${attributeType.charAt(0).toUpperCase() + attributeType.slice(1)}Attributes`] ? 'added' : 'removed'}`);
  };
  
  // Get primary type for styling
  const primaryType = getPrimaryContentType(item);
  
  // Determine icon based on primary content type
  const getIcon = () => {
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
  
  // Get the appropriate style class based on primary content type
  const getTypeClass = () => {
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
    
    return tags;
  };
  
  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(formatContentWithYaml(item));
    toast.success('Copied to clipboard');
  };
  
  // Render all tags from any attribute type
  const renderAllTags = () => {
    const allTags: string[] = [];
    
    if (item.hasTaskAttributes && item.taskTags && item.taskTags.length > 0) {
      allTags.push(...item.taskTags);
    }
    
    if (item.hasEventAttributes && item.eventTags && item.eventTags.length > 0) {
      allTags.push(...item.eventTags);
    }
    
    if (item.hasMailAttributes && item.mailTags && item.mailTags.length > 0) {
      allTags.push(...item.mailTags);
    }
    
    if (item.hasNoteAttributes && item.noteTags && item.noteTags.length > 0) {
      allTags.push(...item.noteTags);
    }
    
    const uniqueTags = Array.from(new Set(allTags));
    
    if (uniqueTags.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {uniqueTags.map((tag, idx) => (
          <span key={idx} className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full flex items-center gap-1">
            <Tag className="size-3" />
            {tag}
          </span>
        ))}
      </div>
    );
  };
  
  // Render the specific attribute sections
  const renderAttributeSections = () => {
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

  // Render the component
  return (
    <Card 
      className={cn(
        "content-item group",
        getTypeClass(),
        isHovered && "ring-1 ring-offset-1"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="content-item-header">
        <div className="flex items-center gap-2">
          {getIcon()}
          <div className="flex flex-wrap gap-1">
            {getTypeTags()}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="size-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
              <MoreHorizontal className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast.info('Edit functionality coming soon')}>
              <Edit className="mr-2 size-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopy}>
              <Copy className="mr-2 size-4" />
              <span>Copy</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Toggle Attributes</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleToggleAttribute('task')}>
              <CheckCircle className="mr-2 size-4 text-task" />
              <span>{item.hasTaskAttributes ? 'Remove' : 'Add'} Task</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleToggleAttribute('event')}>
              <Calendar className="mr-2 size-4 text-event" />
              <span>{item.hasEventAttributes ? 'Remove' : 'Add'} Event</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleToggleAttribute('mail')}>
              <Mail className="mr-2 size-4 text-mail" />
              <span>{item.hasMailAttributes ? 'Remove' : 'Add'} Email</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-destructive">
              <Trash className="mr-2 size-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="content-item-body">
        <h3 className="text-lg font-medium mb-1">{item.title}</h3>
        
        {renderAttributeSections()}
        
        <p className="text-sm text-muted-foreground whitespace-pre-line mt-2">
          {item.content}
        </p>
        
        {renderAllTags()}
      </div>
      
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
                handleToggleAttribute(attributesToAdd[0] as ContentAttributeType);
              }
            }}
          >
            <Plus className="size-3 text-muted-foreground" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ContentItem;
