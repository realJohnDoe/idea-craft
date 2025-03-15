
import React from 'react';
import { Content, generateYaml } from '@/lib/content-utils';

interface YamlPreviewProps {
  content: Partial<Content>;
}

const YamlPreview: React.FC<YamlPreviewProps> = ({ content }) => {
  const getYamlPreview = () => {
    const previewContent: Content = {
      id: 'preview',
      title: '',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      
      // Attribute flags
      hasTaskAttributes: content.hasTaskAttributes || false,
      hasEventAttributes: content.hasEventAttributes || false,
      hasMailAttributes: content.hasMailAttributes || false,
      hasNoteAttributes: content.hasNoteAttributes || false,
      
      // Task attributes
      taskDone: content.hasTaskAttributes ? content.taskDone : undefined,
      taskTags: content.hasTaskAttributes && content.taskTags ? 
        (Array.isArray(content.taskTags) ? content.taskTags : []) : undefined,
      
      // Event attributes
      eventDate: content.hasEventAttributes ? content.eventDate : undefined,
      eventLocation: content.hasEventAttributes ? content.eventLocation || undefined : undefined,
      eventTags: content.hasEventAttributes && content.eventTags ? 
        (Array.isArray(content.eventTags) ? content.eventTags : []) : undefined,
      
      // Mail attributes
      mailFrom: content.hasMailAttributes ? content.mailFrom : undefined,
      mailTo: content.hasMailAttributes && content.mailTo ? 
        (Array.isArray(content.mailTo) ? content.mailTo : []) : undefined,
      mailTags: content.hasMailAttributes && content.mailTags ? 
        (Array.isArray(content.mailTags) ? content.mailTags : []) : undefined,
      
      // Note attributes
      noteTags: content.hasNoteAttributes && content.noteTags ? 
        (Array.isArray(content.noteTags) ? content.noteTags : []) : undefined,
      
      yaml: ''
    };
    
    return generateYaml(previewContent);
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
