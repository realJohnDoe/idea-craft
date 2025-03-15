
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Content, parseYaml, generateYaml, ContentAttributeType } from '@/lib/content-utils';
import { CheckCircle, Calendar, FileText, Mail, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { toast } from 'sonner';

interface ContentCreatorProps {
  onCreate: (content: Content) => void;
  onCancel: () => void;
}

const ContentCreator: React.FC<ContentCreatorProps> = ({ onCreate, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  // Attribute toggles
  const [hasTaskAttributes, setHasTaskAttributes] = useState(false);
  const [hasEventAttributes, setHasEventAttributes] = useState(false);
  const [hasMailAttributes, setHasMailAttributes] = useState(false);
  const [hasNoteAttributes, setHasNoteAttributes] = useState(true);
  
  // Task specific state
  const [taskDone, setTaskDone] = useState(false);
  
  // Event specific state
  const [eventDate, setEventDate] = useState<Date | undefined>(new Date());
  const [eventLocation, setEventLocation] = useState('');
  
  // Mail specific state
  const [mailFrom, setMailFrom] = useState('');
  const [mailTo, setMailTo] = useState('');
  
  // Note specific state
  const [noteTags, setNoteTags] = useState('');
  
  // Toggle attribute sections
  const toggleAttribute = (type: ContentAttributeType) => {
    switch (type) {
      case 'task':
        setHasTaskAttributes(!hasTaskAttributes);
        break;
      case 'event':
        setHasEventAttributes(!hasEventAttributes);
        break;
      case 'mail':
        setHasMailAttributes(!hasMailAttributes);
        break;
      case 'note':
        setHasNoteAttributes(!hasNoteAttributes);
        break;
    }
  };
  
  // Get active attributes count
  const getActiveAttributesCount = () => {
    let count = 0;
    if (hasTaskAttributes) count++;
    if (hasEventAttributes) count++;
    if (hasMailAttributes) count++;
    if (hasNoteAttributes) count++;
    return count;
  };
  
  const handleCreate = () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    // Validate required fields for active attribute types
    if (hasEventAttributes && !eventDate) {
      toast.error('Date is required for events');
      return;
    }
    
    if (hasMailAttributes && (!mailFrom || !mailTo)) {
      toast.error('From and To fields are required for emails');
      return;
    }
    
    // Create content object
    const id = Math.random().toString(36).substring(2, 9);
    const now = new Date();
    
    const newContent: Content = {
      id,
      title,
      content,
      createdAt: now,
      updatedAt: now,
      
      // Attribute flags
      hasTaskAttributes,
      hasEventAttributes,
      hasMailAttributes,
      hasNoteAttributes: hasNoteAttributes || getActiveAttributesCount() === 0, // Default to note if nothing else
      
      // Task attributes
      taskDone: hasTaskAttributes ? taskDone : undefined,
      
      // Event attributes
      eventDate: hasEventAttributes ? eventDate : undefined,
      eventLocation: hasEventAttributes ? eventLocation || undefined : undefined,
      
      // Mail attributes
      mailFrom: hasMailAttributes ? mailFrom : undefined,
      mailTo: hasMailAttributes ? [mailTo] : undefined,
      
      // Note attributes
      noteTags: hasNoteAttributes && noteTags ? noteTags.split(',').map(tag => tag.trim()) : undefined,
      
      // Generate YAML
      yaml: ''
    };
    
    // Generate YAML and update
    newContent.yaml = generateYaml(newContent);
    
    // Create and reset form
    onCreate(newContent);
    
    // Reset form
    setTitle('');
    setContent('');
    setHasTaskAttributes(false);
    setHasEventAttributes(false);
    setHasMailAttributes(false);
    setHasNoteAttributes(true);
    setTaskDone(false);
    setEventDate(new Date());
    setEventLocation('');
    setMailFrom('');
    setMailTo('');
    setNoteTags('');
  };
  
  // Get YAML preview
  const getYamlPreview = () => {
    const previewContent: Content = {
      id: 'preview',
      title: '',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      
      // Attribute flags
      hasTaskAttributes,
      hasEventAttributes,
      hasMailAttributes,
      hasNoteAttributes,
      
      // Task attributes
      taskDone: hasTaskAttributes ? taskDone : undefined,
      
      // Event attributes
      eventDate: hasEventAttributes ? eventDate : undefined,
      eventLocation: hasEventAttributes ? eventLocation || undefined : undefined,
      
      // Mail attributes
      mailFrom: hasMailAttributes ? mailFrom : undefined,
      mailTo: hasMailAttributes ? [mailTo] : undefined,
      
      // Note attributes
      noteTags: hasNoteAttributes && noteTags ? noteTags.split(',').map(tag => tag.trim()) : undefined,
      
      yaml: ''
    };
    
    return generateYaml(previewContent);
  };
  
  return (
    <div className="border rounded-xl p-6 shadow-sm bg-card animate-fade-in space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Create New Content</h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="size-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {/* Common fields */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter a title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        {/* Content attributes selection */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={hasTaskAttributes ? "default" : "outline"}
            size="sm"
            onClick={() => toggleAttribute('task')}
            className={cn(
              "gap-1.5",
              hasTaskAttributes && "bg-task hover:bg-task/90"
            )}
          >
            <CheckCircle className="size-4" />
            <span>Task</span>
            {hasTaskAttributes && (
              <X className="size-3 ml-1 opacity-70" onClick={(e) => {
                e.stopPropagation();
                toggleAttribute('task');
              }} />
            )}
          </Button>
          
          <Button
            variant={hasEventAttributes ? "default" : "outline"}
            size="sm"
            onClick={() => toggleAttribute('event')}
            className={cn(
              "gap-1.5",
              hasEventAttributes && "bg-event hover:bg-event/90"
            )}
          >
            <Calendar className="size-4" />
            <span>Event</span>
            {hasEventAttributes && (
              <X className="size-3 ml-1 opacity-70" onClick={(e) => {
                e.stopPropagation();
                toggleAttribute('event');
              }} />
            )}
          </Button>
          
          <Button
            variant={hasMailAttributes ? "default" : "outline"}
            size="sm"
            onClick={() => toggleAttribute('mail')}
            className={cn(
              "gap-1.5",
              hasMailAttributes && "bg-mail hover:bg-mail/90"
            )}
          >
            <Mail className="size-4" />
            <span>Mail</span>
            {hasMailAttributes && (
              <X className="size-3 ml-1 opacity-70" onClick={(e) => {
                e.stopPropagation();
                toggleAttribute('mail');
              }} />
            )}
          </Button>
          
          <Button
            variant={hasNoteAttributes ? "default" : "outline"}
            size="sm"
            onClick={() => toggleAttribute('note')}
            className={cn(
              "gap-1.5",
              hasNoteAttributes && "bg-note hover:bg-note/90"
            )}
          >
            <FileText className="size-4" />
            <span>Note</span>
            {hasNoteAttributes && (
              <X className="size-3 ml-1 opacity-70" onClick={(e) => {
                e.stopPropagation();
                toggleAttribute('note');
              }} />
            )}
          </Button>
        </div>
        
        {/* Task specific fields */}
        {hasTaskAttributes && (
          <div className="p-3 border border-task/30 rounded-md bg-task-light/10">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="task-done"
                checked={taskDone}
                onCheckedChange={(checked) => setTaskDone(checked === true)}
                className="text-task data-[state=checked]:bg-task data-[state=checked]:text-white border-task"
              />
              <Label htmlFor="task-done" className="text-sm">Mark as completed</Label>
            </div>
          </div>
        )}
        
        {/* Event specific fields */}
        {hasEventAttributes && (
          <div className="p-3 border border-event/30 rounded-md bg-event-light/10 space-y-3">
            <div className="space-y-2">
              <Label htmlFor="event-date" className="text-sm">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="event-date"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    {eventDate ? format(eventDate, 'PPP') : <span>Select a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={eventDate}
                    onSelect={setEventDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm">Location (optional)</Label>
              <Input
                id="location"
                placeholder="Enter a location"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
              />
            </div>
          </div>
        )}
        
        {/* Mail specific fields */}
        {hasMailAttributes && (
          <div className="p-3 border border-mail/30 rounded-md bg-mail-light/10 space-y-3">
            <div className="space-y-2">
              <Label htmlFor="from" className="text-sm">From</Label>
              <Input
                id="from"
                type="email"
                placeholder="your.email@example.com"
                value={mailFrom}
                onChange={(e) => setMailFrom(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="to" className="text-sm">To</Label>
              <Input
                id="to"
                type="email"
                placeholder="recipient@example.com"
                value={mailTo}
                onChange={(e) => setMailTo(e.target.value)}
              />
            </div>
          </div>
        )}
        
        {/* Note specific fields */}
        {hasNoteAttributes && (
          <div className="p-3 border border-note/30 rounded-md bg-note-light/10">
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm">Tags (comma separated)</Label>
              <Input
                id="tags"
                placeholder="productivity, ideas, research"
                value={noteTags}
                onChange={(e) => setNoteTags(e.target.value)}
              />
            </div>
          </div>
        )}
        
        {/* Content */}
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
        
        {/* YAML Preview */}
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">YAML Preview:</span>
          <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto max-w-sm">
            {getYamlPreview() || '{}'}
          </pre>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button 
            onClick={handleCreate}
            className="bg-primary hover:bg-primary/90"
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentCreator;

// Helper function to format dates
function format(date: Date, formatString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}
