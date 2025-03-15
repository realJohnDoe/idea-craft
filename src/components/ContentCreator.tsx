
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { parseYaml, Content, ContentType } from '@/lib/content-utils';
import { CheckCircle, Calendar, FileText, Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ContentCreatorProps {
  onCreate: (content: Content) => void;
  onCancel: () => void;
}

const ContentCreator: React.FC<ContentCreatorProps> = ({ onCreate, onCancel }) => {
  const [activeTab, setActiveTab] = useState<ContentType>('note');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  // Task specific state
  const [taskDone, setTaskDone] = useState(false);
  
  // Event specific state
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  
  // Mail specific state
  const [mailFrom, setMailFrom] = useState('');
  const [mailTo, setMailTo] = useState('');
  
  // Note specific state
  const [noteTags, setNoteTags] = useState('');
  
  const handleCreate = () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    const id = Math.random().toString(36).substring(2, 9);
    const now = new Date();
    
    let newContent: Content;
    
    switch (activeTab) {
      case 'task':
        newContent = {
          id,
          type: 'task',
          title,
          content,
          createdAt: now,
          updatedAt: now,
          yaml: `task:\n  done: ${taskDone}`,
          done: taskDone
        };
        break;
      case 'event':
        if (!eventDate) {
          toast.error('Date is required for events');
          return;
        }
        newContent = {
          id,
          type: 'event',
          title,
          content,
          createdAt: now,
          updatedAt: now,
          yaml: `event:\n  date: ${eventDate}${eventLocation ? `\n  location: ${eventLocation}` : ''}`,
          date: new Date(eventDate),
          location: eventLocation || undefined
        };
        break;
      case 'mail':
        if (!mailFrom || !mailTo) {
          toast.error('From and To fields are required for emails');
          return;
        }
        newContent = {
          id,
          type: 'mail',
          title,
          content,
          createdAt: now,
          updatedAt: now,
          yaml: `mail:\n  from: ${mailFrom}\n  to: ${mailTo}`,
          from: mailFrom,
          to: [mailTo]
        };
        break;
      case 'note':
      default:
        newContent = {
          id,
          type: 'note',
          title,
          content,
          createdAt: now,
          updatedAt: now,
          yaml: noteTags ? `note:\n  tags: [${noteTags}]` : '',
          tags: noteTags ? noteTags.split(',').map(tag => tag.trim()) : []
        };
        break;
    }
    
    onCreate(newContent);
    
    // Reset form
    setTitle('');
    setContent('');
    setTaskDone(false);
    setEventDate('');
    setEventLocation('');
    setMailFrom('');
    setMailTo('');
    setNoteTags('');
  };
  
  // Handle YAML input
  const handleYamlInput = () => {
    try {
      const yamlContent = `---\n${activeTab}:\n  ${getYamlContent()}\n---\n\n${content}`;
      const { yamlData } = parseYaml(yamlContent);
      
      // Update form based on parsed YAML
      if (yamlData) {
        switch (activeTab) {
          case 'task':
            if (yamlData.task && typeof yamlData.task.done === 'boolean') {
              setTaskDone(yamlData.task.done);
            }
            break;
          case 'event':
            if (yamlData.event) {
              if (yamlData.event.date) {
                setEventDate(yamlData.event.date);
              }
              if (yamlData.event.location) {
                setEventLocation(yamlData.event.location);
              }
            }
            break;
          case 'mail':
            if (yamlData.mail) {
              if (yamlData.mail.from) {
                setMailFrom(yamlData.mail.from);
              }
              if (yamlData.mail.to) {
                setMailTo(Array.isArray(yamlData.mail.to) ? yamlData.mail.to[0] : yamlData.mail.to);
              }
            }
            break;
          case 'note':
            if (yamlData.note && yamlData.note.tags) {
              setNoteTags(Array.isArray(yamlData.note.tags) ? yamlData.note.tags.join(', ') : yamlData.note.tags);
            }
            break;
        }
      }
    } catch (error) {
      console.error('Error parsing YAML input:', error);
    }
  };
  
  // Get YAML content based on the active tab
  const getYamlContent = () => {
    switch (activeTab) {
      case 'task':
        return `done: ${taskDone}`;
      case 'event':
        return `date: ${eventDate}${eventLocation ? `\n  location: ${eventLocation}` : ''}`;
      case 'mail':
        return `from: ${mailFrom}\n  to: ${mailTo}`;
      case 'note':
        return noteTags ? `tags: [${noteTags}]` : '';
      default:
        return '';
    }
  };
  
  return (
    <div className="border rounded-xl p-6 shadow-sm bg-card animate-fade-in space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Create New Content</h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="size-4" />
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ContentType)} className="w-full">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="note" className="flex items-center gap-1.5">
            <FileText className="size-4 text-note" />
            <span>Note</span>
          </TabsTrigger>
          <TabsTrigger value="task" className="flex items-center gap-1.5">
            <CheckCircle className="size-4 text-task" />
            <span>Task</span>
          </TabsTrigger>
          <TabsTrigger value="event" className="flex items-center gap-1.5">
            <Calendar className="size-4 text-event" />
            <span>Event</span>
          </TabsTrigger>
          <TabsTrigger value="mail" className="flex items-center gap-1.5">
            <Mail className="size-4 text-mail" />
            <span>Mail</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Enter your content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>
          
          <TabsContent value="note" className="space-y-2 mt-0">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              placeholder="productivity, ideas, research"
              value={noteTags}
              onChange={(e) => setNoteTags(e.target.value)}
            />
          </TabsContent>
          
          <TabsContent value="task" className="space-y-2 mt-0">
            <div className="flex items-center space-x-2">
              <input
                id="done"
                type="checkbox"
                checked={taskDone}
                onChange={(e) => setTaskDone(e.target.checked)}
                className="size-4 rounded border-gray-300 text-task focus:ring-task"
              />
              <Label htmlFor="done">Mark as completed</Label>
            </div>
          </TabsContent>
          
          <TabsContent value="event" className="space-y-2 mt-0">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location (optional)</Label>
                <Input
                  id="location"
                  placeholder="Enter a location"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="mail" className="space-y-2 mt-0">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="from">From</Label>
                <Input
                  id="from"
                  type="email"
                  placeholder="your.email@example.com"
                  value={mailFrom}
                  onChange={(e) => setMailFrom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  type="email"
                  placeholder="recipient@example.com"
                  value={mailTo}
                  onChange={(e) => setMailTo(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">YAML Preview:</span>
            <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto max-w-sm">
              {activeTab}:{'\n'}  {getYamlContent() || '{}'}
            </pre>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button 
              onClick={handleCreate}
              className={cn({
                'bg-note hover:bg-note/90': activeTab === 'note',
                'bg-task hover:bg-task/90': activeTab === 'task',
                'bg-event hover:bg-event/90': activeTab === 'event',
                'bg-mail hover:bg-mail/90': activeTab === 'mail',
              })}
            >
              Create {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </Button>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default ContentCreator;
