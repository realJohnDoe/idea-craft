import React, { useState } from "react";
import {
  Content,
  generateYaml,
  ContentAttributeType,
} from "@/lib/content-utils";
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
  onCreate: (content: Content) => void;
  onCancel: () => void;
}

const ContentCreator: React.FC<ContentCreatorProps> = ({
  onCreate,
  onCancel,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Attribute toggles - note is now automatic based on other attributes
  const [hasTaskAttributes, setHasTaskAttributes] = useState(false);
  const [hasEventAttributes, setHasEventAttributes] = useState(false);
  const [hasMailAttributes, setHasMailAttributes] = useState(false);

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
        setHasTaskAttributes(!hasTaskAttributes);
        break;
      case "event":
        setHasEventAttributes(!hasEventAttributes);
        break;
      case "mail":
        setHasMailAttributes(!hasMailAttributes);
        break;
      case "note":
        // Note is now automatic - it's active if no other attributes are active
        break;
    }
  };

  // Get active attributes count
  const getActiveAttributesCount = () => {
    let count = 0;
    if (hasTaskAttributes) count++;
    if (hasEventAttributes) count++;
    if (hasMailAttributes) count++;
    return count;
  };

  // Calculate if notes should be the default
  const calculateHasNoteAttributes = () => {
    return getActiveAttributesCount() === 0;
  };

  const handleCreate = () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    // Validate required fields for active attribute types
    if (hasEventAttributes && !eventDate) {
      toast.error("Date is required for events");
      return;
    }

    if (hasMailAttributes && (!mailFrom || mailTo.length === 0)) {
      toast.error("From and To fields are required for emails");
      return;
    }

    // Create content object
    const id = Math.random().toString(36).substring(2, 9);
    const now = new Date();

    // Calculate if we should be a note - always true if no other attributes
    const isNote = calculateHasNoteAttributes();

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
      hasNoteAttributes: isNote, // Automatic based on other attributes

      // Centralized tags
      tags,

      // Task attributes
      taskDone: hasTaskAttributes ? taskDone : undefined,

      // Event attributes
      eventDate: hasEventAttributes ? eventDate : undefined,
      eventLocation: hasEventAttributes
        ? eventLocation || undefined
        : undefined,

      // Mail attributes
      mailFrom: hasMailAttributes ? mailFrom : undefined,
      mailTo: hasMailAttributes ? mailTo : undefined,

      // Generate YAML
      yaml: "",
    };

    // Generate YAML and update
    newContent.yaml = generateYaml(newContent);

    // Create and reset form
    onCreate(newContent);

    // Reset form
    setTitle("");
    setContent("");
    setHasTaskAttributes(false);
    setHasEventAttributes(false);
    setHasMailAttributes(false);
    setTags([]);
    setTaskDone(false);
    setEventDate(new Date());
    setEventLocation("");
    setMailFrom("");
    setMailTo([]);
  };

  // Calculate if we should be showing note attributes
  const showNoteAttributes = calculateHasNoteAttributes();

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
          hasTaskAttributes={hasTaskAttributes}
          hasEventAttributes={hasEventAttributes}
          hasMailAttributes={hasMailAttributes}
          hasNoteAttributes={showNoteAttributes}
          toggleAttribute={toggleAttribute}
        />

        {/* Task specific fields */}
        {hasTaskAttributes && (
          <TaskAttributeEditor taskDone={taskDone} setTaskDone={setTaskDone} />
        )}

        {/* Event specific fields */}
        {hasEventAttributes && (
          <EventAttributeEditor
            eventDate={eventDate}
            setEventDate={setEventDate}
            eventLocation={eventLocation}
            setEventLocation={setEventLocation}
          />
        )}

        {/* Mail specific fields */}
        {hasMailAttributes && (
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
            hasTaskAttributes,
            hasEventAttributes,
            hasMailAttributes,
            hasNoteAttributes: showNoteAttributes,
            tags,
            taskDone,
            eventDate,
            eventLocation,
            mailFrom,
            mailTo,
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
