import yaml from 'yaml';

// Content types become attributes that can be combined
export type ContentAttributeType = 'task' | 'event' | 'mail' | 'note';

// Base interface for all content
export interface Content {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Attribute flags - can have multiple
  hasTaskAttributes: boolean;
  hasEventAttributes: boolean;
  hasMailAttributes: boolean;
  hasNoteAttributes: boolean;
  
  // Task attributes
  taskDone?: boolean;
  taskTags?: string[];
  
  // Event attributes
  eventDate?: Date;
  eventEndDate?: Date;
  eventLocation?: string;
  eventTags?: string[];
  
  // Mail attributes
  mailFrom?: string;
  mailTo?: string[];
  mailSubject?: string;
  mailAttachments?: string[];
  mailTags?: string[];
  
  // Note attributes
  noteTags?: string[];
  
  // YAML representation
  yaml: string;
}

// Parse the YAML frontmatter from the content
export function parseYaml(content: string): { yamlData: any; content: string } {
  // Simple regex to extract YAML frontmatter between --- delimiters
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (match) {
    try {
      const yamlStr = match[1];
      const contentStr = match[2];
      const yamlData = yaml.parse(yamlStr);
      return { yamlData, content: contentStr };
    } catch (e) {
      console.error('Error parsing YAML:', e);
      return { yamlData: {}, content };
    }
  }

  // Check if it's our simplified format
  const simpleFormatRegex = /(task|event|mail|note):\s*\n([\s\S]*?)\n\n([\s\S]*)/;
  const simpleMatch = content.match(simpleFormatRegex);

  if (simpleMatch) {
    try {
      const type = simpleMatch[1];
      const yamlStr = `${type}:\n${simpleMatch[2]}`;
      const contentStr = simpleMatch[3];
      const yamlData = yaml.parse(yamlStr);
      return { yamlData, content: contentStr };
    } catch (e) {
      console.error('Error parsing simple YAML format:', e);
      return { yamlData: {}, content };
    }
  }

  return { yamlData: {}, content };
}

// Generate YAML for a content item
export function generateYaml(content: Content): string {
  let yamlObj: any = {};
  
  // Add task attributes if present
  if (content.hasTaskAttributes) {
    yamlObj.task = {
      done: content.taskDone
    };
    
    if (content.taskTags && content.taskTags.length > 0) {
      yamlObj.task.tags = content.taskTags;
    }
  }
  
  // Add event attributes if present
  if (content.hasEventAttributes) {
    yamlObj.event = {};
    
    if (content.eventDate) {
      yamlObj.event.date = content.eventDate.toISOString().split('T')[0];
    }
    
    if (content.eventEndDate) {
      yamlObj.event.endDate = content.eventEndDate.toISOString().split('T')[0];
    }
    
    if (content.eventLocation) {
      yamlObj.event.location = content.eventLocation;
    }
    
    if (content.eventTags && content.eventTags.length > 0) {
      yamlObj.event.tags = content.eventTags;
    }
    
    // If event object is empty, remove it
    if (Object.keys(yamlObj.event).length === 0) {
      delete yamlObj.event;
    }
  }
  
  // Add mail attributes if present
  if (content.hasMailAttributes) {
    yamlObj.mail = {};
    
    if (content.mailFrom) {
      yamlObj.mail.from = content.mailFrom;
    }
    
    if (content.mailTo && content.mailTo.length > 0) {
      yamlObj.mail.to = content.mailTo;
    }
    
    if (content.mailSubject) {
      yamlObj.mail.subject = content.mailSubject;
    }
    
    if (content.mailAttachments && content.mailAttachments.length > 0) {
      yamlObj.mail.attachments = content.mailAttachments;
    }
    
    if (content.mailTags && content.mailTags.length > 0) {
      yamlObj.mail.tags = content.mailTags;
    }
    
    // If mail object is empty, remove it
    if (Object.keys(yamlObj.mail).length === 0) {
      delete yamlObj.mail;
    }
  }
  
  // Add note attributes if present
  if (content.hasNoteAttributes && content.noteTags && content.noteTags.length > 0) {
    yamlObj.note = {
      tags: content.noteTags
    };
  }
  
  // If the YAML object is empty, return empty string
  if (Object.keys(yamlObj).length === 0) {
    return '';
  }
  
  return yaml.stringify(yamlObj);
}

// Parse YAML data into Content properties
export function parseYamlToContent(yamlData: any, content: Content): Content {
  const updatedContent = { ...content };
  
  // Reset all attribute flags
  updatedContent.hasTaskAttributes = false;
  updatedContent.hasEventAttributes = false;
  updatedContent.hasMailAttributes = false;
  updatedContent.hasNoteAttributes = false;
  
  // Process task attributes
  if (yamlData.task) {
    updatedContent.hasTaskAttributes = true;
    updatedContent.taskDone = yamlData.task.done === true;
    
    if (yamlData.task.tags) {
      updatedContent.taskTags = Array.isArray(yamlData.task.tags) ? 
        yamlData.task.tags : [yamlData.task.tags];
    }
  }
  
  // Process event attributes
  if (yamlData.event) {
    updatedContent.hasEventAttributes = true;
    
    if (yamlData.event.date) {
      updatedContent.eventDate = new Date(yamlData.event.date);
    }
    
    if (yamlData.event.endDate) {
      updatedContent.eventEndDate = new Date(yamlData.event.endDate);
    }
    
    if (yamlData.event.location) {
      updatedContent.eventLocation = yamlData.event.location;
    }
    
    if (yamlData.event.tags) {
      updatedContent.eventTags = Array.isArray(yamlData.event.tags) ?
        yamlData.event.tags : [yamlData.event.tags];
    }
  }
  
  // Process mail attributes
  if (yamlData.mail) {
    updatedContent.hasMailAttributes = true;
    
    if (yamlData.mail.from) {
      updatedContent.mailFrom = yamlData.mail.from;
    }
    
    if (yamlData.mail.to) {
      updatedContent.mailTo = Array.isArray(yamlData.mail.to) ? 
        yamlData.mail.to : [yamlData.mail.to];
    }
    
    if (yamlData.mail.subject) {
      updatedContent.mailSubject = yamlData.mail.subject;
    }
    
    if (yamlData.mail.attachments) {
      updatedContent.mailAttachments = yamlData.mail.attachments;
    }
    
    if (yamlData.mail.tags) {
      updatedContent.mailTags = Array.isArray(yamlData.mail.tags) ?
        yamlData.mail.tags : [yamlData.mail.tags];
    }
  }
  
  // Process note attributes
  if (yamlData.note) {
    updatedContent.hasNoteAttributes = true;
    
    if (yamlData.note.tags) {
      updatedContent.noteTags = Array.isArray(yamlData.note.tags) ? 
        yamlData.note.tags : [yamlData.note.tags];
    }
  }
  
  // If no specific attributes, default to note
  if (!updatedContent.hasTaskAttributes && 
      !updatedContent.hasEventAttributes && 
      !updatedContent.hasMailAttributes) {
    updatedContent.hasNoteAttributes = true;
  }
  
  // Regenerate YAML
  updatedContent.yaml = generateYaml(updatedContent);
  
  return updatedContent;
}

// Toggle an attribute type on a content item
export function toggleContentAttribute(content: Content, attributeType: ContentAttributeType): Content {
  const updatedContent = { ...content };
  
  switch (attributeType) {
    case 'task':
      updatedContent.hasTaskAttributes = !updatedContent.hasTaskAttributes;
      if (updatedContent.hasTaskAttributes && updatedContent.taskDone === undefined) {
        updatedContent.taskDone = false;
        if (!updatedContent.taskTags) updatedContent.taskTags = [];
      }
      break;
    case 'event':
      updatedContent.hasEventAttributes = !updatedContent.hasEventAttributes;
      if (updatedContent.hasEventAttributes) {
        if (!updatedContent.eventDate) updatedContent.eventDate = new Date();
        if (!updatedContent.eventTags) updatedContent.eventTags = [];
      }
      break;
    case 'mail':
      updatedContent.hasMailAttributes = !updatedContent.hasMailAttributes;
      if (updatedContent.hasMailAttributes) {
        if (!updatedContent.mailFrom) updatedContent.mailFrom = '';
        if (!updatedContent.mailTo) updatedContent.mailTo = [];
        if (!updatedContent.mailTags) updatedContent.mailTags = [];
      }
      break;
    case 'note':
      updatedContent.hasNoteAttributes = !updatedContent.hasNoteAttributes;
      if (updatedContent.hasNoteAttributes && !updatedContent.noteTags) {
        updatedContent.noteTags = [];
      }
      break;
  }
  
  // Make sure note attributes are always present if no other attributes are
  if (!updatedContent.hasTaskAttributes && 
      !updatedContent.hasEventAttributes && 
      !updatedContent.hasMailAttributes) {
    updatedContent.hasNoteAttributes = true;
    if (!updatedContent.noteTags) updatedContent.noteTags = [];
  }
  
  // Regenerate YAML
  updatedContent.yaml = generateYaml(updatedContent);
  
  return updatedContent;
}

// Format the content display string with the YAML
export function formatContentWithYaml(content: Content): string {
  const yaml = generateYaml(content);
  
  if (yaml) {
    return `---\n${yaml}---\n\n${content.content}`;
  }
  
  return content.content;
}

// Get primary type for display purposes
export function getPrimaryContentType(content: Content): ContentAttributeType {
  if (content.hasTaskAttributes) return 'task';
  if (content.hasEventAttributes) return 'event';
  if (content.hasMailAttributes) return 'mail';
  return 'note';
}

// Get mock data for initial display
export function getMockData(): Content[] {
  return [
    {
      id: '1',
      title: 'Complete project proposal',
      content: 'Need to finish the proposal for the new client project by Friday.',
      createdAt: new Date('2023-06-01'),
      updatedAt: new Date('2023-06-01'),
      hasTaskAttributes: true,
      hasEventAttributes: true,
      hasMailAttributes: false,
      hasNoteAttributes: false,
      taskDone: false,
      taskTags: ['proposal'],
      eventDate: new Date('2023-06-05'),
      yaml: 'task:\n  done: false\nevent:\n  date: 2023-06-05'
    },
    {
      id: '2',
      title: 'Team meeting',
      content: 'Weekly team sync to discuss project progress and roadblocks.',
      createdAt: new Date('2023-06-02'),
      updatedAt: new Date('2023-06-02'),
      hasTaskAttributes: false,
      hasEventAttributes: true,
      hasMailAttributes: false,
      hasNoteAttributes: false,
      eventDate: new Date('2023-06-05'),
      eventLocation: 'Conference Room A',
      yaml: 'event:\n  date: 2023-06-05\n  location: Conference Room A'
    },
    {
      id: '3',
      title: 'Ideas for new feature',
      content: 'The new dashboard should include:\n- User activity metrics\n- Conversion rates\n- Custom date ranges',
      createdAt: new Date('2023-06-03'),
      updatedAt: new Date('2023-06-03'),
      hasTaskAttributes: false,
      hasEventAttributes: false,
      hasMailAttributes: false,
      hasNoteAttributes: true,
      noteTags: ['feature', 'dashboard'],
      yaml: 'note:\n  tags:\n    - feature\n    - dashboard'
    },
    {
      id: '4',
      title: 'Meeting follow-up',
      content: 'Thank you for joining our meeting yesterday. As discussed, I\'m sharing the resources we talked about.',
      createdAt: new Date('2023-06-04'),
      updatedAt: new Date('2023-06-04'),
      hasTaskAttributes: true,
      hasEventAttributes: false,
      hasMailAttributes: true,
      hasNoteAttributes: false,
      taskDone: true,
      mailFrom: 'john.doe@example.com',
      mailTo: ['jane.smith@example.com'],
      yaml: 'task:\n  done: true\nmail:\n  from: john.doe@example.com\n  to:\n    - jane.smith@example.com'
    }
  ];
}
