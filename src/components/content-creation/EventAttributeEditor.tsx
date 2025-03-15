
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

interface EventAttributeEditorProps {
  eventDate: Date | undefined;
  setEventDate: (date: Date | undefined) => void;
  eventLocation: string;
  setEventLocation: (location: string) => void;
  eventTags: string[];
  setEventTags: (tags: string[]) => void;
}

const EventAttributeEditor: React.FC<EventAttributeEditorProps> = ({
  eventDate,
  setEventDate,
  eventLocation,
  setEventLocation,
  eventTags,
  setEventTags
}) => {
  // Convert array to comma-separated string for display in input
  const tagsString = eventTags.join(', ');
  
  // Handle tags input change
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsInput = e.target.value;
    // Convert comma-separated string to array
    const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    setEventTags(tagsArray);
  };

  return (
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
              {eventDate ? formatDate(eventDate) : <span>Select a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
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

      <div className="space-y-2">
        <Label htmlFor="event-tags" className="text-sm">Tags (comma separated)</Label>
        <Input
          id="event-tags"
          placeholder="meeting, important, recurring"
          value={tagsString}
          onChange={handleTagsChange}
        />
      </div>
    </div>
  );
};

// Format date function
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export default EventAttributeEditor;
