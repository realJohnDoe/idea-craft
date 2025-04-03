
import yaml from 'yaml';

// Content types become attributes that can be combined
export type ContentAttributeType = 'task' | 'event' | 'mail' | 'note';

// Base interface for all items
export interface Item {
  id: string;
  title: string;
  tags: string[];
  content: string;
  createdAt: Date;
  updatedAt: Date;
  done?: boolean;          // Task attribute
  date?: Date;             // Event attribute
  location?: string;       // Event attribute
  from?: string;           // Mail attribute
  to?: string[];           // Mail attribute
  yaml?: string;           // YAML representation
}

export function hasTaskAttributes(item: Item): boolean {
  return item.done !== undefined;
}

export function hasEventAttributes(item: Item): boolean {
  return item.date !== undefined || item.location !== undefined;
}

export function hasMailAttributes(item: Item): boolean {
  return item.from !== undefined || item.to !== undefined;
}

export function hasNoteAttributes(item: Item): boolean {
  // return true if no other attributes are present
  return !hasTaskAttributes(item) && !hasEventAttributes(item) && !hasMailAttributes(item);  
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

// Generate YAML for an item
export function generateYaml(item: Item): string {
  return generateYamlFromItem(item);
}

// Parse YAML data into Item properties
export function parseYamlToItem(yamlData: any, item: Item): Item {
  const updatedItem = { ...item };
  
  // Initialize tags
  updatedItem.tags = updatedItem.tags || [];
  
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

// Toggle an attribute type on an item
export function toggleItemAttribute(item: Item, attributeType: ContentAttributeType): Item {
  const updatedItem = { ...item };
  
  switch (attributeType) {
    case 'task':
      if (updatedItem.done !== undefined) {
        delete updatedItem.done;
      } else {
        updatedItem.done = false;
      }
      break;
    case 'event':
      if (updatedItem.date !== undefined || updatedItem.location !== undefined) {
        delete updatedItem.date;
        delete updatedItem.location;
      } else {
        updatedItem.date = new Date();
        updatedItem.location = '';
      }
      break;
    case 'mail':
      if (updatedItem.from !== undefined || updatedItem.to !== undefined) {
        delete updatedItem.from;
        delete updatedItem.to;
      } else {
        updatedItem.from = '';
        updatedItem.to = [];
      }
      break;
    case 'note':
      // Note is automatic when no other attributes are present
      break;
  }
  
  // Generate YAML
  updatedItem.yaml = generateYaml(updatedItem);
  
  return updatedItem;
}

// Format the content display string with the YAML
export function formatContentWithYaml(item: Item): string {
  const yaml = generateYaml(item);
  
  if (yaml) {
    return `---\n${yaml}---\n\n${item.content}`;
  }
  
  return item.content;
}

// Function to process content text and transform links
export function processContentLinks(content: string, allItems: Item[]): string {
  // Match [[title]] pattern
  const linkRegex = /\[\[(.*?)\]\]/g;
  
  return content.replace(linkRegex, (match, linkTitle) => {
    // Look for an item with this title
    const linkedItem = allItems.find(item => 
      item.title.toLowerCase() === linkTitle.toLowerCase());
    
    return match;
  });
}

// Get primary type for display purposes
export function getPrimaryContentType(item: Item): ContentAttributeType {
  if (hasTaskAttributes(item)) return 'task';
  if (hasEventAttributes(item)) return 'event';
  if (hasMailAttributes(item)) return 'mail';
  return 'note';
}
