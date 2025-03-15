
import yaml from 'yaml';

// Content types
export type ContentType = 'note' | 'task' | 'event' | 'mail';

// Base interface for all content
export interface BaseContent {
  id: string;
  type: ContentType;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  yaml: string;
}

// Task specific interface
export interface TaskContent extends BaseContent {
  type: 'task';
  done: boolean;
}

// Event specific interface
export interface EventContent extends BaseContent {
  type: 'event';
  date: Date;
  endDate?: Date;
  location?: string;
}

// Mail specific interface
export interface MailContent extends BaseContent {
  type: 'mail';
  from: string;
  to: string[];
  subject?: string;
  attachments?: string[];
}

// Note specific interface
export interface NoteContent extends BaseContent {
  type: 'note';
  tags?: string[];
}

// Union type for all content types
export type Content = TaskContent | EventContent | MailContent | NoteContent;

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
  const simpleFormatRegex = /(task|event|mail):\s*\n([\s\S]*?)\n\n([\s\S]*)/;
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
  
  switch (content.type) {
    case 'task':
      yamlObj.task = {
        done: content.done
      };
      break;
    case 'event':
      yamlObj.event = {
        date: content.date.toISOString().split('T')[0]
      };
      if (content.endDate) {
        yamlObj.event.endDate = content.endDate.toISOString().split('T')[0];
      }
      if (content.location) {
        yamlObj.event.location = content.location;
      }
      break;
    case 'mail':
      yamlObj.mail = {
        from: content.from,
        to: content.to
      };
      if (content.subject) {
        yamlObj.mail.subject = content.subject;
      }
      if (content.attachments && content.attachments.length > 0) {
        yamlObj.mail.attachments = content.attachments;
      }
      break;
    case 'note':
      if (content.tags && content.tags.length > 0) {
        yamlObj.note = {
          tags: content.tags
        };
      }
      break;
  }
  
  // If the YAML object is empty (like for a simple note without metadata), return empty string
  if (Object.keys(yamlObj).length === 0) {
    return '';
  }
  
  return yaml.stringify(yamlObj);
}

// Convert content from one type to another
export function convertContent(content: Content, targetType: ContentType): Content {
  const base = {
    id: content.id,
    title: content.title,
    content: content.content,
    createdAt: content.createdAt,
    updatedAt: new Date(),
    yaml: ''
  };

  let converted: Content;

  switch (targetType) {
    case 'task':
      converted = {
        ...base,
        type: 'task',
        done: false
      } as TaskContent;
      break;
    case 'event':
      converted = {
        ...base,
        type: 'event',
        date: new Date()
      } as EventContent;
      break;
    case 'mail':
      converted = {
        ...base,
        type: 'mail',
        from: '',
        to: ['']
      } as MailContent;
      break;
    case 'note':
    default:
      converted = {
        ...base,
        type: 'note'
      } as NoteContent;
      break;
  }

  // Generate YAML for the new content type
  converted.yaml = generateYaml(converted);
  
  return converted;
}

// Format the content display string with the YAML
export function formatContentWithYaml(content: Content): string {
  const yaml = generateYaml(content);
  
  if (yaml) {
    return `---\n${yaml}---\n\n${content.content}`;
  }
  
  return content.content;
}

// Get mock data for initial display
export function getMockData(): Content[] {
  return [
    {
      id: '1',
      type: 'task',
      title: 'Complete project proposal',
      content: 'Need to finish the proposal for the new client project by Friday.',
      createdAt: new Date('2023-06-01'),
      updatedAt: new Date('2023-06-01'),
      yaml: 'task:\n  done: false',
      done: false
    },
    {
      id: '2',
      type: 'event',
      title: 'Team meeting',
      content: 'Weekly team sync to discuss project progress and roadblocks.',
      createdAt: new Date('2023-06-02'),
      updatedAt: new Date('2023-06-02'),
      yaml: 'event:\n  date: 2023-06-05',
      date: new Date('2023-06-05')
    },
    {
      id: '3',
      type: 'note',
      title: 'Ideas for new feature',
      content: 'The new dashboard should include:\n- User activity metrics\n- Conversion rates\n- Custom date ranges',
      createdAt: new Date('2023-06-03'),
      updatedAt: new Date('2023-06-03'),
      yaml: '',
      tags: ['feature', 'dashboard']
    },
    {
      id: '4',
      type: 'mail',
      title: 'Meeting follow-up',
      content: 'Thank you for joining our meeting yesterday. As discussed, I\'m sharing the resources we talked about.',
      createdAt: new Date('2023-06-04'),
      updatedAt: new Date('2023-06-04'),
      yaml: 'mail:\n  from: john.doe@example.com\n  to: jane.smith@example.com',
      from: 'john.doe@example.com',
      to: ['jane.smith@example.com']
    }
  ];
}
