
import React from 'react';
import { Content, toggleContentAttribute, ContentAttributeType } from '@/lib/content-utils';
import { MoreHorizontal, Edit, Copy, Trash, CheckCircle, Calendar, Mail } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ContentHeaderProps {
  item: Content;
  onUpdate: (updatedItem: Content) => void;
  onDelete: (id: string) => void;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({ item, onUpdate, onDelete }) => {
  // Toggle attribute type
  const handleToggleAttribute = (attributeType: ContentAttributeType) => {
    const updatedItem = toggleContentAttribute(item, attributeType);
    onUpdate(updatedItem);
    toast.success(`${attributeType.charAt(0).toUpperCase() + attributeType.slice(1)} attributes ${updatedItem[`has${attributeType.charAt(0).toUpperCase() + attributeType.slice(1)}Attributes`] ? 'added' : 'removed'}`);
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    const { formatContentWithYaml } = require('@/lib/content-utils');
    navigator.clipboard.writeText(formatContentWithYaml(item));
    toast.success('Copied to clipboard');
  };

  return (
    <div className="content-item-header">
      <h3 className="text-lg font-medium">{item.title}</h3>
      
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
  );
};

export default ContentHeader;
