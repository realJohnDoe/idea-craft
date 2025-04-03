
import React from 'react';
import { Item, generateYamlFromItem } from '@/lib/content-utils';

interface YamlPreviewProps {
  content: Partial<Item>;
}

const YamlPreview: React.FC<YamlPreviewProps> = ({ content }) => {
  const getYamlPreview = () => {
    const previewItem: Item = {
      id: 'preview',
      title: '',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: content.tags || [],
      
      // Task attributes
      done: content.done,
      
      // Event attributes
      date: content.date,
      location: content.location,
      
      // Mail attributes
      from: content.from,
      to: content.to,
    };
    
    return generateYamlFromItem(previewItem);
  };

  return (
    <div className="text-xs text-muted-foreground">
      <span className="font-medium">YAML Preview:</span>
      <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto max-w-sm">
        {getYamlPreview() || '{}'}
      </pre>
    </div>
  );
};

export default YamlPreview;
