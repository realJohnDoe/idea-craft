
import React, { useState } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { convertContent, Content, formatContentWithYaml } from '@/lib/content-utils';
import { CheckCircle, Calendar, FileText, Mail, MoreHorizontal, Edit, RefreshCw, Copy, Trash } from 'lucide-react';
import { Card } from '@/components/ui/card';
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
  
  // Determine icon based on content type
  const getIcon = () => {
    switch (item.type) {
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
  
  // Get the appropriate style class based on content type
  const getTypeClass = () => {
    switch (item.type) {
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
  const getTagClass = () => {
    switch (item.type) {
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
  
  // Format date based on content type
  const getFormattedDate = () => {
    if (item.type === 'event' && 'date' in item) {
      return format(item.date, 'MMM d, yyyy');
    }
    return format(item.updatedAt, 'MMM d, yyyy');
  };
  
  // Get specific details based on content type
  const getTypeSpecificDetails = () => {
    switch (item.type) {
      case 'task':
        return (
          <div className="flex items-center mt-1 text-sm">
            <span className={cn(
              "inline-flex items-center", 
              (item as any).done ? "text-muted-foreground line-through" : "text-foreground"
            )}>
              Status: {(item as any).done ? 'Completed' : 'Pending'}
            </span>
          </div>
        );
      case 'event':
        return (
          <div className="flex items-center mt-1 text-sm">
            <Calendar className="size-4 mr-1 text-event" />
            <span>{getFormattedDate()}</span>
            {(item as any).location && (
              <span className="ml-2">at {(item as any).location}</span>
            )}
          </div>
        );
      case 'mail':
        return (
          <div className="flex flex-col gap-1 mt-1 text-sm">
            <div>From: {(item as any).from}</div>
            <div>To: {Array.isArray((item as any).to) ? (item as any).to.join(', ') : (item as any).to}</div>
          </div>
        );
      case 'note':
        if ((item as any).tags && (item as any).tags.length > 0) {
          return (
            <div className="flex flex-wrap gap-1 mt-1">
              {(item as any).tags.map((tag: string, idx: number) => (
                <span key={idx} className="px-2 py-0.5 bg-note-light text-note text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          );
        }
        return null;
      default:
        return null;
    }
  };

  // Handle content conversion
  const handleConvert = (targetType: 'note' | 'task' | 'event' | 'mail') => {
    if (item.type !== targetType) {
      const convertedItem = convertContent(item, targetType);
      onUpdate(convertedItem);
      toast.success(`Converted to ${targetType} successfully`);
    }
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(formatContentWithYaml(item));
    toast.success('Copied to clipboard');
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
          <span className={cn("content-item-tag", getTagClass())}>
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </span>
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
            <DropdownMenuLabel>Convert to</DropdownMenuLabel>
            <DropdownMenuItem 
              onClick={() => handleConvert('note')}
              disabled={item.type === 'note'}
            >
              <FileText className="mr-2 size-4 text-note" />
              <span>Note</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleConvert('task')}
              disabled={item.type === 'task'}
            >
              <CheckCircle className="mr-2 size-4 text-task" />
              <span>Task</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleConvert('event')}
              disabled={item.type === 'event'}
            >
              <Calendar className="mr-2 size-4 text-event" />
              <span>Event</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleConvert('mail')}
              disabled={item.type === 'mail'}
            >
              <Mail className="mr-2 size-4 text-mail" />
              <span>Email</span>
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
        <p className="text-sm text-muted-foreground whitespace-pre-line">{item.content}</p>
        {getTypeSpecificDetails()}
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
            onClick={() => toast.info('Convert functionality in dropdown menu')}
          >
            <RefreshCw className="size-3 text-muted-foreground" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ContentItem;
