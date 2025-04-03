
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
  
  // Centralized tags
  tags: string[];
  
  // Task attributes
  taskDone?: boolean;
  
  // Event attributes
  eventDate?: Date;
  eventEndDate?: Date;
  eventLocation?: string;
  
  // Mail attributes
  mailFrom?: string;
  mailTo?: string[];
  mailSubject?: string;
  mailAttachments?: string[];
  
  // YAML representation
  yaml: string;
}

export interface Item {
  id: string;
  title: string;
  tags: string[];
  content: string;
  createdAt: Date;
  updatedAt: Date;
  done?: boolean;
  date?: Date;
  location?: string;
  from?: string;
  to?: string[];
}

export function contentToItem(content: Content): Item {
  return {
    id: content.id,
    title: content.title,
    tags: content.tags || [],
    content: content.content,
    createdAt: content.createdAt,
    updatedAt: content.updatedAt,
    done: content.taskDone, // Map taskDone to done
    date: content.eventDate, // Map eventDate to date
    location: content.eventLocation, // Map eventLocation to location
    from: content.mailFrom, // Map mailFrom to from
    to: content.mailTo, // Map mailTo to to 
  };
}

export function generateYamlFromItem(item: Item): string {
  const yamlObj: any = {};

  // Add task attributes if `done` is present
  if (item.done !== undefined) {
    yamlObj.task = {
      done: item.done,
    };
  }

  // Add event attributes if `date` or `location` are present
  if (item.date || item.location) {
    yamlObj.event = {};

    if (item.date) {
      yamlObj.event.date = item.date.toISOString().split('T')[0];
    }

    if (item.location) {
      yamlObj.event.location = item.location;
    }

    // If the event object is empty, remove it
    if (Object.keys(yamlObj.event).length === 0) {
      delete yamlObj.event;
    }
  }

  // Add mail attributes if `from` or `to` are present
  if (item.from || item.to) {
    yamlObj.mail = {};

    if (item.from) {
      yamlObj.mail.from = item.from;
    }

    if (item.to) {
      yamlObj.mail.to = item.to;
    }

    // If the mail object is empty, remove it
    if (Object.keys(yamlObj.mail).length === 0) {
      delete yamlObj.mail;
    }
  }
  
  // Add tags if present
  if (item.tags && item.tags.length > 0) {
    yamlObj.tags = item.tags;
  }

  // If the YAML object is empty, return an empty string
  if (Object.keys(yamlObj).length === 0) {
    return '';
  }

  return yaml.stringify(yamlObj);
}

export function hasTaskAttributes(item: Item): boolean {
  return item.done != undefined;
}

export function hasEventAttributes(item: Item): boolean {
  return item.date != undefined || item.location != undefined;
}

export function hasMailAttributes(item: Item): boolean {
  return item.from != undefined || item.to != undefined;
}

export function hasNoteAttributes(item: Item): boolean {
  // return true if no other attributes are present
  return !hasTaskAttributes(item) && !hasEventAttributes(item) && !hasMailAttributes(item);  
}


export function itemToContent(item: Item): Content {
  const isNote = hasNoteAttributes(item);
  const isTask = hasTaskAttributes(item);
  const isEvent = hasEventAttributes(item);
  const isMail = hasMailAttributes(item);

  const content: Content = {
    id: item.id,
    title: item.title,
    tags: item.tags || [],
    content: item.content,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    hasTaskAttributes: isTask,
    taskDone: item.done,
    hasEventAttributes: isEvent,
    eventDate: item.date,
    eventEndDate: undefined,
    eventLocation: item.location,
    hasMailAttributes: isMail,
    mailFrom: item.from,
    mailTo: item.to,
    mailSubject: undefined,
    mailAttachments: [],
    hasNoteAttributes: isNote || (!isTask && !isEvent && !isMail),
    yaml: ''
  };

  // Generate YAML
  content.yaml = generateYaml(content);

  return content;
}

// Parse the YAML frontmatter from the content
export function parseYaml(fileContent: string): { yamlData: any; content: string } {
  // Simple regex to extract YAML frontmatter between --- delimiters
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = fileContent.match(frontmatterRegex);

  if (match) {
    try {
      const yamlStr = match[1];
      const contentStr = match[2];
      const yamlData = yaml.parse(yamlStr);
      return { yamlData, content: contentStr };
    } catch (e) {
      console.error('Error parsing YAML:', e);
      return { yamlData: {}, content: fileContent };
    }
  }
  return { yamlData: {}, content: fileContent };
}

// Generate YAML for a content item
export function generateYaml(content: Content): string {
  let yamlObj: any = {};
  
  // Add task attributes if present
  if (content.hasTaskAttributes) {
    yamlObj.task = {
      done: content.taskDone
    };
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
    
    // If mail object is empty, remove it
    if (Object.keys(yamlObj.mail).length === 0) {
      delete yamlObj.mail;
    }
  }
  
  // Add tags if present
  if (content.tags && content.tags.length > 0) {
    yamlObj.tags = content.tags;
  }
  
  // If the YAML object is empty, return empty string
  if (Object.keys(yamlObj).length === 0) {
    return '';
  }
  
  return yaml.stringify(yamlObj);
}

// Parse YAML data into Content properties
export function parseYamlToItem(yamlData: any, item: Item): Item {
  const updatedItem = { ...item };
  
  // Initialize tags
  updatedItem.tags = [];
  
  // Process task attributes
  if (yamlData.task) {
    updatedItem.done = yamlData.task.done === true;
  }
  
  // Process event attributes
  if (yamlData.event) {
    
    if (yamlData.event.date) {
      updatedItem.date = new Date(yamlData.event.date);
    }
    
    if (yamlData.event.location) {
      updatedItem.location = yamlData.event.location;
    }
  }
  
  // Process mail attributes
  if (yamlData.mail) {
    
    if (yamlData.mail.from) {
      updatedItem.from = yamlData.mail.from;
    }
    
    if (yamlData.mail.to) {
      updatedItem.to = Array.isArray(yamlData.mail.to) ? 
        yamlData.mail.to : [yamlData.mail.to];
    }
  }
  
  // Process tags
  if (yamlData.tags) {
    updatedItem.tags = Array.isArray(yamlData.tags) ? 
      yamlData.tags : [yamlData.tags];
  }
  return updatedItem;
}

// Toggle an attribute type on a content item
export function toggleContentAttribute(content: Content, attributeType: ContentAttributeType): Content {
  const updatedContent = { ...content };
  
  switch (attributeType) {
    case 'task':
      updatedContent.hasTaskAttributes = !updatedContent.hasTaskAttributes;
      if (updatedContent.hasTaskAttributes && updatedContent.taskDone === undefined) {
        updatedContent.taskDone = false;
      }
      break;
    case 'event':
      updatedContent.hasEventAttributes = !updatedContent.hasEventAttributes;
      if (updatedContent.hasEventAttributes && !updatedContent.eventDate) {
        updatedContent.eventDate = new Date();
      }
      break;
    case 'mail':
      updatedContent.hasMailAttributes = !updatedContent.hasMailAttributes;
      if (updatedContent.hasMailAttributes) {
        if (!updatedContent.mailFrom) updatedContent.mailFrom = '';
        if (!updatedContent.mailTo) updatedContent.mailTo = [];
      }
      break;
    case 'note':
      updatedContent.hasNoteAttributes = !updatedContent.hasNoteAttributes;
      break;
  }
  
  // Make sure note attributes are always present if no other attributes are
  if (!updatedContent.hasTaskAttributes && 
      !updatedContent.hasEventAttributes && 
      !updatedContent.hasMailAttributes) {
    updatedContent.hasNoteAttributes = true;
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

// Function to process content text and transform links
export function processContentLinks(content: string, allItems: any[]): string {
  // Match [[title]] pattern
  const linkRegex = /\[\[(.*?)\]\]/g;
  
  return content.replace(linkRegex, (match, linkTitle) => {
    // Look for an item with this title
    const linkedItem = allItems.find(item => 
      item.title.toLowerCase() === linkTitle.toLowerCase());
    
    // if (linkedItem) {
    //   // Return a span with a special class for styling
    //   return `<span class="content-link" data-item-id="${linkedItem.id}">${linkTitle}</span>`;
    // }
    
    // If no match, return the original link format
    return match;
  });
}

// Get primary type for display purposes
export function getPrimaryContentType(content: Content): ContentAttributeType {
  if (content.hasTaskAttributes) return 'task';
  if (content.hasEventAttributes) return 'event';
  if (content.hasMailAttributes) return 'mail';
  return 'note';
}

// Mock data function stub - will be replaced by our example content
export function getMockData(): Content[] {
  // This function will now be provided by example-content.ts
  return [];
}
