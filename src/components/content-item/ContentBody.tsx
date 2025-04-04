
import React, { useEffect, useState } from "react";
import {
  Item,
  hasEventAttributes,
  hasMailAttributes,
  hasTaskAttributes,
  toggleItemAttribute,
  ContentAttributeType,
} from "@/lib/content-utils";
import { format } from "date-fns";
import ContentRenderer from "./ContentRenderer";
import IdeaCraftCheckbox from "../IdeaCraftCheckbox";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { Card } from "../ui/card";
import {
  Calendar,
  Mail,
  MapPin,
  Pencil,
  Tag,
  X,
  CheckCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Calendar as CalendarComponent } from "../ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import BaseIdeaCraftChip from "../BaseIdeaCraftChip";
import ContentTypeTags from "./ContentTypeTags";

interface ContentBodyProps {
  item: Item;
  onUpdate: (updatedItem: Item) => void;
  processedContent: string;
  handleWikiLinkClick?: (wikilinkId: string) => void;
  allItems?: Item[];
}

const ContentBody: React.FC<ContentBodyProps> = ({
  item,
  onUpdate,
  processedContent,
  handleWikiLinkClick: handleUpdateSelectedItem,
  allItems = [],
}) => {
  const [title, setTitle] = useState(item.title);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [isEditingMailFrom, setIsEditingMailFrom] = useState(false);
  const [isEditingMailTo, setIsEditingMailTo] = useState(false);
  const [content, setContent] = useState(item.content);
  const [location, setLocation] = useState(item.location || "");
  const [mailFrom, setMailFrom] = useState(item.from || "");
  const [mailTo, setMailTo] = useState<string>(
    item.to ? item.to.join(", ") : ""
  );
  const [tagInput, setTagInput] = useState(
    item.tags ? item.tags.join(", ") : ""
  );

  const handleTitleChanged = (title: string) => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    const updatedItem: Item = {
      ...item,
      title,
      updatedAt: new Date(),
    };
    onUpdate(updatedItem);
  };

  const handleTaskToggle = (itemToUpdate: Item, checked: boolean) => {
    const updatedItem = {
      ...itemToUpdate,
      done: checked,
    };
    onUpdate(updatedItem);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;

    const updatedItem = {
      ...item,
      date,
      updatedAt: new Date(),
    };
    onUpdate(updatedItem);
    setIsEditingDate(false);
  };

  const handleLocationChange = () => {
    const updatedItem = {
      ...item,
      location,
      updatedAt: new Date(),
    };
    onUpdate(updatedItem);
    setIsEditingLocation(false);
  };

  const handleMailFromChange = () => {
    const updatedItem = {
      ...item,
      from: mailFrom,
      updatedAt: new Date(),
    };
    onUpdate(updatedItem);
    setIsEditingMailFrom(false);
  };

  const handleMailToChange = () => {
    const updatedItem = {
      ...item,
      to: mailTo.split(",").map((email) => email.trim()),
      updatedAt: new Date(),
    };
    onUpdate(updatedItem);
    setIsEditingMailTo(false);
  };

  const handleContentChange = () => {
    const updatedItem = {
      ...item,
      content,
      updatedAt: new Date(),
    };
    onUpdate(updatedItem);
    setIsEditingContent(false);
  };

  const handleTagsChange = () => {
    const tags = tagInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    const updatedItem = {
      ...item,
      tags,
      updatedAt: new Date(),
    };
    onUpdate(updatedItem);
    setIsEditingTags(false);
  };

  const handleToggleAttribute = (type: ContentAttributeType) => {
    const updatedItem = toggleItemAttribute(item, type);
    onUpdate({
      ...updatedItem,
      updatedAt: new Date(),
    });
  };

  useEffect(() => {
    setTitle(item.title);
    setContent(item.content);
    setLocation(item.location || "");
    setMailFrom(item.from || "");
    setMailTo(item.to ? item.to.join(", ") : "");
    setTagInput(item.tags ? item.tags.join(", ") : "");

    // Reset all editing states when item changes
    setIsEditingDate(false);
    setIsEditingLocation(false);
    setIsEditingContent(false);
    setIsEditingTags(false);
    setIsEditingMailFrom(false);
    setIsEditingMailTo(false);
  }, [item]);

  const handleBlur = () => {
    if (title !== item.title) {
      handleTitleChanged(title);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedItem = {
      ...item,
      tags: item.tags?.filter((tag) => tag !== tagToRemove) || [],
    };
    onUpdate(updatedItem);
  };

  return (
    <div>
      <Card className="rounded-t-lg border-b pb-1">
        <div className="p-1">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur}
            className="text-lg font-medium"
          />
        </div>

        {/* Content type and tag selection */}
        <div className="px-3 py-1 flex flex-wrap items-center gap-1">
          <ContentTypeTags 
            item={item} 
            editable={true}
            onRemoveTag={handleRemoveTag}
            onToggleType={handleToggleAttribute}
            onEditTags={() => setIsEditingTags(true)}
          />
        </div>

        {/* Tag editor */}
        {isEditingTags && (
          <div className="px-3 py-1 space-y-1">
            <div className="flex items-center text-sm">
              <Tag className="mr-1 w-4 h-4" />
              <div className="flex items-center space-x-2 w-full">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="h-7 py-1"
                  placeholder="Enter tags (comma-separated)"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setIsEditingTags(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-green-600"
                  onClick={handleTagsChange}
                >
                  <span className="sr-only">Save</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Task attributes */}
        {hasTaskAttributes(item) && (
          <div className="flex items-center px-3 py-1">
            <IdeaCraftCheckbox
              checked={item.done}
              onToggle={(checked) => handleTaskToggle(item, checked)}
            />
            <label
              htmlFor={`task-${item.id}`}
              className={`text-sm ${
                item.done ? "line-through text-muted-foreground" : ""
              }`}
            >
              Mark as done
            </label>
          </div>
        )}

        {/* Event attributes */}
        {hasEventAttributes(item) && (
          <div className="px-3 py-1 space-y-1">
            {/* Date editor */}
            <div className="flex items-center text-sm text-event">
              <Calendar className="mr-1 w-4 h-4" />
              {!isEditingDate ? (
                <div
                  className="flex items-center group cursor-pointer"
                  onClick={() => setIsEditingDate(true)}
                >
                  <span>
                    {item.date && format(new Date(item.date), "PPPP")}
                  </span>
                  <Pencil className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-70 transition-opacity" />
                </div>
              ) : (
                <Popover open={isEditingDate} onOpenChange={setIsEditingDate}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-8 pl-3 text-left font-normal w-[200px]"
                    >
                      {item.date
                        ? format(new Date(item.date), "PPPP")
                        : "Select date"}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={item.date ? new Date(item.date) : undefined}
                      onSelect={handleDateChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>

            {/* Location editor */}
            {(item.location || isEditingLocation) && (
              <div className="flex items-center text-sm text-event">
                <MapPin className="mr-1 w-4 h-4" />
                {!isEditingLocation ? (
                  <div
                    className="flex items-center group cursor-pointer"
                    onClick={() => setIsEditingLocation(true)}
                  >
                    <span>{item.location}</span>
                    <Pencil className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-70 transition-opacity" />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 w-full">
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="h-7 py-1"
                      placeholder="Enter location"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => setIsEditingLocation(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-green-600"
                      onClick={handleLocationChange}
                    >
                      <span className="sr-only">Save</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mail attributes */}
        {hasMailAttributes(item) && (
          <div className="px-3 py-1 space-y-1 text-sm text-mail">
            {/* From editor */}
            <div className="flex items-center">
              <span className="font-medium mr-1">From:</span>
              {!isEditingMailFrom ? (
                <div
                  className="flex items-center group cursor-pointer"
                  onClick={() => setIsEditingMailFrom(true)}
                >
                  <span>{item.from}</span>
                  <Pencil className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-70 transition-opacity" />
                </div>
              ) : (
                <div className="flex items-center space-x-2 flex-1">
                  <Input
                    value={mailFrom}
                    onChange={(e) => setMailFrom(e.target.value)}
                    className="h-7 py-1"
                    placeholder="Enter email"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => setIsEditingMailFrom(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-green-600"
                    onClick={handleMailFromChange}
                  >
                    <span className="sr-only">Save</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </Button>
                </div>
              )}
            </div>

            {/* To editor */}
            {item.to && item.to.length > 0 && (
              <div className="flex items-center">
                <span className="font-medium mr-1">To:</span>
                {!isEditingMailTo ? (
                  <div
                    className="flex items-center group cursor-pointer"
                    onClick={() => setIsEditingMailTo(true)}
                  >
                    <span>{item.to.join(", ")}</span>
                    <Pencil className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-70 transition-opacity" />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 flex-1">
                    <Input
                      value={mailTo}
                      onChange={(e) => setMailTo(e.target.value)}
                      className="h-7 py-1"
                      placeholder="Enter emails (comma-separated)"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => setIsEditingMailTo(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-green-600"
                      onClick={handleMailToChange}
                    >
                      <span className="sr-only">Save</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Content section with edit capability */}
      <div className="border-b relative group">
        {!isEditingContent ? (
          <>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setIsEditingContent(true)}
              >
                <Pencil className="h-3 w-3" />
              </Button>
            </div>

            <div className="px-3 py-1 content-item-body">
              {item.content ? (
                <div className="max-w-none prose prose-sm dark:prose-invert">
                  <ContentRenderer
                    content={processedContent}
                    allItems={allItems}
                    handleWikiLinkClick={handleUpdateSelectedItem}
                    onTaskToggle={handleTaskToggle}
                  />
                </div>
              ) : (
                <div className="flex justify-center py-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditingContent(true)}
                  >
                    Add Content
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="p-3">
            <div className="mb-2">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 min-h-[200px] bg-background border rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setContent(item.content);
                  setIsEditingContent(false);
                }}
              >
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={handleContentChange}>
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentBody;
