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
import { generateUniqueId, createSafeFilename } from "@/lib/id-utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Import the components
import AttributeTypeSelector from "./content-creation/AttributeTypeSelector";
import TaskAttributeEditor from "./content-creation/TaskAttributeEditor";
import EventAttributeEditor from "./content-creation/EventAttributeEditor";
import MailAttributeEditor from "./content-creation/MailAttributeEditor";
import TagsEditor from "./content-creation/TagsEditor";
import YamlPreview from "./content-creation/YamlPreview";

interface ContentCreatorProps {
  onCreate: (item: Item) => void;
  onCancel: () => void;
}

const ContentCreator: React.FC<ContentCreatorProps> = ({
  onCreate,
  onCancel,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Attribute toggles
  const [hasTaskAttr, setHasTaskAttr] = useState(false);
  const [hasEventAttr, setHasEventAttr] = useState(false);
  const [hasMailAttr, setHasMailAttr] = useState(false);

  // Centralized tags
  const [tags, setTags] = useState<string[]>([]);

  // Task specific state
  const [taskDone, setTaskDone] = useState(false);

  // Event specific state
  const [eventDate, setEventDate] = useState<Date | undefined>(new Date());
  const [eventLocation, setEventLocation] = useState("");

  // Mail specific state
  const [mailFrom, setMailFrom] = useState("");
  const [mailTo, setMailTo] = useState<string[]>([]);

  // Toggle attribute sections
  const toggleAttribute = (type: ContentAttributeType) => {
    switch (type) {
      case "task":
        setHasTaskAttr(!hasTaskAttr);
        break;
      case "event":
        setHasEventAttr(!hasEventAttr);
        break;
      case "mail":
        setHasMailAttr(!hasMailAttr);
        break;
      case "note":
        // Note is now automatic - it's active if no other attributes are active
        break;
    }
  };

  // Calculate if notes should be the default
  const showNoteAttributes = !hasTaskAttr && !hasEventAttr && !hasMailAttr;

  const handleCreate = () => {
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

    // Create item with a unique ID based on the title
    const safeTitle = createSafeFilename(title);
    const id = `${getPrimaryType()}-${safeTitle}-${generateUniqueId().substring(0, 8)}`;
    const now = new Date();

    const newItem: Item = {
      id,
      title,
      content,
      createdAt: now,
      updatedAt: now,
      tags,
    };

    // Add attributes based on the selected types
    if (hasTaskAttr) {
      newItem.done = taskDone;
    }

    if (hasEventAttr) {
      newItem.date = eventDate;
      newItem.location = eventLocation || undefined;
    }

    if (hasMailAttr) {
      newItem.from = mailFrom;
      newItem.to = mailTo;
    }

    // Generate YAML and create the item
    onCreate(newItem);

    // Reset form
    setTitle("");
    setContent("");
    setHasTaskAttr(false);
    setHasEventAttr(false);
    setHasMailAttr(false);
    setTags([]);
    setTaskDone(false);
    setEventDate(new Date());
    setEventLocation("");
    setMailFrom("");
    setMailTo([]);
  };

  // Get the primary type for the ID
  const getPrimaryType = (): string => {
    if (hasTaskAttr) return 'task';
    if (hasEventAttr) return 'event';
    if (hasMailAttr) return 'mail';
    return 'note';
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

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            placeholder="Enter your content. You can link to other items using [[title of item]]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="resize-none"
          />
        </div>

        {/* YAML Preview */}
        <YamlPreview
          content={{
            done: hasTaskAttr ? taskDone : undefined,
            date: hasEventAttr ? eventDate : undefined,
            location: hasEventAttr ? eventLocation : undefined,
            from: hasMailAttr ? mailFrom : undefined,
            to: hasMailAttr ? mailTo : undefined,
            tags
          }}
        />

        {/* Action buttons */}
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
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
