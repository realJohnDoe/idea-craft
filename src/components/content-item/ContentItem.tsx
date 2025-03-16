
import React, { useState, useEffect } from 'react';
import { Content, processContentLinks } from '@/lib/content-utils';
import { toast } from 'sonner';
import ContentHeader from './ContentHeader';
import ContentBody from './ContentBody';
import ContentFooter from './ContentFooter';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getPrimaryContentType } from '@/lib/content-utils';

interface ContentItemProps {
  item: Content;
  onUpdate: (updatedItem: Content) => void;
  onDelete: (id: string) => void;
  allItems?: Content[];
}

const ContentItem: React.FC<ContentItemProps> = ({ 
  item, 
  onUpdate, 
  onDelete, 
  allItems = [] 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [processedContent, setProcessedContent] = useState(item.content);
  
  // Process content links when content changes or allItems changes
  useEffect(() => {
    if (allItems.length > 0) {
      setProcessedContent(processContentLinks(item.content, allItems));
    }
  }, [item.content, allItems]);

  // Handle link click event
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
  
  // Get the appropriate style class based on primary content type
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

  return (
    <Card 
      id={`content-item-${item.id}`}
      className={cn(
        "content-item group",
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
      />
      
      <ContentBody 
        item={item} 
        onUpdate={onUpdate} 
        processedContent={processedContent}
        handleLinkClick={handleLinkClick}
      />
      
      <ContentFooter 
        item={item} 
        onUpdate={onUpdate}
        handleCopy={() => {
          const { formatContentWithYaml } = require('@/lib/content-utils');
          navigator.clipboard.writeText(formatContentWithYaml(item));
          toast.success('Copied to clipboard');
        }} 
      />
    </Card>
  );
};

export default ContentItem;
