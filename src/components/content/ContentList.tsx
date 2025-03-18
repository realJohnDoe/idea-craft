
import React from 'react';
import { Content, formatContentWithYaml } from '@/lib/content-utils';
import ContentItem from '@/components/content-item';

interface ContentListProps {
  items: Content[];
  onUpdate: (updatedItem: Content) => void;
  onDelete: (id: string) => void;
  allItems: Content[];
  onSelect: (item: Content) => void;
}

const ContentList = ({ items, onUpdate, onDelete, allItems, onSelect }: ContentListProps) => {
  const handleTaskToggle = (item: Content, checked: boolean) => {
    const updatedItem = { 
      ...item, 
      taskDone: checked 
    };
    
    // Re-generate YAML
    updatedItem.yaml = formatContentWithYaml(updatedItem);
    
    onUpdate(updatedItem);
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      {items.map((item) => (
        <ContentItem 
          key={item.id} 
          item={item} 
          onUpdate={onUpdate}
          onDelete={onDelete}
          allItems={allItems}
          isListView={true}
          onSelect={onSelect}
          onTaskToggle={handleTaskToggle}
        />
      ))}
    </div>
  );
};

export default ContentList;
