import React, { useState } from "react";
import {
  Content,
  ContentAttributeType,
  toggleContentAttribute,
} from "@/lib/content-utils";
import { cn } from "@/lib/utils";
import { Tag, Plus, CheckCircle, Calendar, Mail, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import IdeaCraftChip from "../IdeaCraftChip";

interface ContentTypeTagsProps {
  item: Content;
  onUpdate: (updatedItem: Content) => void;
}

const ContentTypeTags: React.FC<ContentTypeTagsProps> = ({
  item,
  onUpdate,
}) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [customTag, setCustomTag] = useState("");

  // Add attribute to content
  const handleAddAttribute = (type: ContentAttributeType) => {
    onUpdate(toggleContentAttribute(item, type));
    setIsAddingTag(false);
    toast.success(`Added ${type} attributes`);
  };

  // Add custom tag
  const handleAddCustomTag = () => {
    if (customTag.trim() === "") return;

    // Don't add duplicate tags
    if (item.tags && item.tags.includes(customTag.trim())) {
      toast.error("Tag already exists");
      return;
    }

    // Create new item with the tag added
    const updatedItem = {
      ...item,
      tags: [...(item.tags || []), customTag.trim()],
    };
    onUpdate(updatedItem);
    setCustomTag("");
    toast.success("Tag added");
  };

  // Remove a tag
  const handleRemoveTag = (tag: string) => {
    const updatedItem = {
      ...item,
      tags: item.tags?.filter((t) => t !== tag) || [],
    };
    onUpdate(updatedItem);
    toast.success("Tag removed");
  };

  // Get content type tag elements
  const getTypeTags = () => {
    const tags = [];

    if (item.hasTaskAttributes) {
      tags.push(
        <IdeaCraftChip type={"task"} toggled={false} onClick={() => {}} />
      );
    }

    if (item.hasEventAttributes) {
      tags.push(
        <IdeaCraftChip type={"event"} toggled={false} onClick={() => {}} />
      );
    }

    if (item.hasMailAttributes) {
      tags.push(
        <IdeaCraftChip type={"mail"} toggled={false} onClick={() => {}} />
      );
    }

    if (
      item.hasNoteAttributes &&
      !item.hasTaskAttributes &&
      !item.hasEventAttributes &&
      !item.hasMailAttributes
    ) {
      tags.push(
        <IdeaCraftChip type={"note"} toggled={false} onClick={() => {}} />
      );
    }

    // Add user tags if present
    if (item.tags && item.tags.length > 0) {
      item.tags.forEach((tag, idx) => {
        tags.push(
          <span
            key={`tag-${idx}`}
            className="content-item-tag bg-muted text-muted-foreground flex items-center gap-1 group"
          >
            {tag}
          </span>
        );
      });
    }

    return tags;
  };

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {getTypeTags()}

      <Popover open={isAddingTag} onOpenChange={setIsAddingTag}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="size-6 rounded-full">
            <Plus className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground mb-1">
              Add attributes or tags:
            </p>

            {/* Type attributes */}
            <div className="space-y-1 mb-2">
              {!item.hasTaskAttributes && (
                <Button
                  size="sm"
                  variant="outline"
                  className="justify-start gap-2 w-full"
                  onClick={() => handleAddAttribute("task")}
                >
                  <CheckCircle className="size-4 text-task" />
                  Task
                </Button>
              )}
              {!item.hasEventAttributes && (
                <Button
                  size="sm"
                  variant="outline"
                  className="justify-start gap-2 w-full"
                  onClick={() => handleAddAttribute("event")}
                >
                  <Calendar className="size-4 text-event" />
                  Event
                </Button>
              )}
              {!item.hasMailAttributes && (
                <Button
                  size="sm"
                  variant="outline"
                  className="justify-start gap-2 w-full"
                  onClick={() => handleAddAttribute("mail")}
                >
                  <Mail className="size-4 text-mail" />
                  Mail
                </Button>
              )}
            </div>

            {/* Custom tag input */}
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground mb-1">
                Add custom tag:
              </p>
              <div className="flex gap-1">
                <Input
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  placeholder="Tag name"
                  className="h-8 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddCustomTag();
                    }
                  }}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAddCustomTag}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ContentTypeTags;
