import React, { useState } from "react";
import {
  Item,
  generateYaml,
  ContentAttributeType,
  hasTaskAttributes,
  hasEventAttributes,
  hasMailAttributes,
  hasNoteAttributes,
} from "@/lib/content-utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Import the components
import AttributeTypeSelector from "../content-creation/AttributeTypeSelector";
import TaskAttributeEditor from "../content-creation/TaskAttributeEditor";
import EventAttributeEditor from "../content-creation/EventAttributeEditor";
import MailAttributeEditor from "../content-creation/MailAttributeEditor";
import TagsEditor from "../content-creation/TagsEditor";
import YamlPreview from "../content-creation/YamlPreview";
import ContentTextarea from "./ContentTextarea";

interface ContentEditorProps {
  item: Item;
  onUpdate: (item: Item) => void;
  onCancel: () => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  item,
  onUpdate,
  onCancel,
}) => {
  const [title, setTitle] = useState(item.title);
  const [content, setContent] = useState(item.content);

  // Centralized tags
  const [tags, setTags] = useState<string[]>(item.tags || []);

  // Task specific state
  const [taskDone, setTaskDone] = useState(item.done || false);

  // Event specific state
  const [eventDate, setEventDate] = useState<Date | undefined>(item.date);
  const [eventLocation, setEventLocation] = useState(item.location || "");

  // Mail specific state
  const [mailFrom, setMailFrom] = useState(item.from || "");
  const [mailTo, setMailTo] = useState<string[]>(item.to || []);

  // Calculate attribute flags
  const hasTaskAttr = hasTaskAttributes(item);
  const hasEventAttr = hasEventAttributes(item);
  const hasMailAttr = hasMailAttributes(item);
  const hasNoteAttr = hasNoteAttributes(item);

  // Toggle attribute sections
  const toggleAttribute = (type: ContentAttributeType) => {
    let updatedItem = { ...item };
    
    switch (type) {
      case "task":
        if (hasTaskAttr) {
          delete updatedItem.done;
        } else {
          updatedItem.done = false;
        }
        break;
      case "event":
        if (hasEventAttr) {
          delete updatedItem.date;
          delete updatedItem.location;
        } else {
          updatedItem.date = new Date();
          updatedItem.location = "";
        }
        break;
      case "mail":
        if (hasMailAttr) {
          delete updatedItem.from;
          delete updatedItem.to;
        } else {
          updatedItem.from = "";
          updatedItem.to = [];
        }
        break;
      case "note":
        // Note is now automatic - it's active if no other attributes are active
        break;
    }
    
    // Update state based on new item state
    if (type === 'task') setTaskDone(updatedItem.done || false);
    if (type === 'event') {
      setEventDate(updatedItem.date);
      setEventLocation(updatedItem.location || "");
    }
    if (type === 'mail') {
      setMailFrom(updatedItem.from || "");
      setMailTo(updatedItem.to || []);
    }
  };

  // Calculate if we should be showing note attributes
  const showNoteAttributes = !hasTaskAttr && !hasEventAttr && !hasMailAttr;

  const handleUpdate = () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    // Validate required fields for active attribute types
    if (hasEventAttr && !eventDate) {
      toast.error("Date is required for events");
      return;
    }

    if (hasMailAttr && (!mailFrom || mailTo.length === 0)) {
      toast.error("From and To fields are required for emails");
      return;
    }

    const updatedItem: Item = {
      ...item,
      title,
      content,
      updatedAt: new Date(),
      tags,
    };

    // Add task attributes if needed
    if (hasTaskAttr) {
      updatedItem.done = taskDone;
    } else {
      delete updatedItem.done;
    }

    // Add event attributes if needed
    if (hasEventAttr) {
      updatedItem.date = eventDate;
      updatedItem.location = eventLocation || undefined;
    } else {
      delete updatedItem.date;
      delete updatedItem.location;
    }

    // Add mail attributes if needed
    if (hasMailAttr) {
      updatedItem.from = mailFrom;
      updatedItem.to = mailTo;
    } else {
      delete updatedItem.from;
      delete updatedItem.to;
    }

    // Removed the yaml property assignment
    
    // Update and close editor
    onUpdate(updatedItem);
  };

  return (
    <div className="rounded-xl p-2 shadow-sm animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Edit Content</h2>
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
        <AttributeTypeSelector
          hasTaskAttributes={hasTaskAttr}
          hasEventAttributes={hasEventAttr}
          hasMailAttributes={hasMailAttr}
          hasNoteAttributes={showNoteAttributes}
          toggleAttribute={toggleAttribute}
        />

        {/* Task specific fields */}
        {hasTaskAttr && (
          <TaskAttributeEditor taskDone={taskDone} setTaskDone={setTaskDone} />
        )}

        {/* Event specific fields */}
        {hasEventAttr && (
          <EventAttributeEditor
            eventDate={eventDate}
            setEventDate={setEventDate}
            eventLocation={eventLocation}
            setEventLocation={setEventLocation}
          />
        )}

        {/* Mail specific fields */}
        {hasMailAttr && (
          <MailAttributeEditor
            mailFrom={mailFrom}
            setMailFrom={setMailFrom}
            mailTo={mailTo}
            setMailTo={setMailTo}
          />
        )}

        {/* Centralized tags editor */}
        <TagsEditor tags={tags} setTags={setTags} />

        {/* Content with link suggestion */}
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <ContentTextarea
            value={content}
            onChange={(value) => setContent(value)}
          />
        </div>

        {/* YAML Preview */}
        <YamlPreview
          content={{
            done: taskDone,
            date: eventDate,
            location: eventLocation,
            from: mailFrom,
            to: mailTo,
            tags
          }}
        />

        {/* Action buttons */}
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            className="bg-primary hover:bg-primary/90"
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;
