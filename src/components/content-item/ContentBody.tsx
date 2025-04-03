
import React, { useEffect, useState } from "react";
import {
  Content,
  contentToItem,
  formatContentWithYaml,
  hasEventAttributes,
  hasMailAttributes,
  hasTaskAttributes,
  Item,
} from "@/lib/content-utils";
import { format } from "date-fns";
import ContentRenderer from "./ContentRenderer";
import IdeaCraftCheckbox from "../IdeaCraftCheckbox";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { Card } from "../ui/card";
import { Calendar, Mail, MapPin, Pencil, Tag, X } from "lucide-react";
import { Button } from "../ui/button";
import { Calendar as CalendarComponent } from "../ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import BaseIdeaCraftChip from "../BaseIdeaCraftChip";
import ContentTextarea from "../content-editor/ContentTextarea";

interface ContentBodyProps {
  item: Content;
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
  const [location, setLocation] = useState(item.eventLocation || "");
  const [mailFrom, setMailFrom] = useState(item.mailFrom || "");
  const [mailTo, setMailTo] = useState<string>(
    item.mailTo ? item.mailTo.join(", ") : ""
  );
  const [tagInput, setTagInput] = useState(item.tags ? item.tags.join(", ") : "");

  const handleTitleChanged = (title: string) => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    const updatedContent: Item = {
      ...contentToItem(item),
      title,
      updatedAt: new Date(),
    };
    onUpdate(updatedContent);
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
      ...contentToItem(item),
      date,
      updatedAt: new Date(),
    };
    onUpdate(updatedItem);
    setIsEditingDate(false);
  };

  const handleLocationChange = () => {
    const updatedItem = {
      ...contentToItem(item),
      location,
      updatedAt: new Date(),
    };
    onUpdate(updatedItem);
    setIsEditingLocation(false);
  };

  const handleMailFromChange = () => {
    const updatedItem = {
      ...contentToItem(item),
      from: mailFrom,
      updatedAt: new Date(),
    };
    onUpdate(updatedItem);
    setIsEditingMailFrom(false);
  };

  const handleMailToChange = () => {
    const updatedItem = {
      ...contentToItem(item),
      to: mailTo.split(",").map((email) => email.trim()),
      updatedAt: new Date(),
    };
    onUpdate(updatedItem);
    setIsEditingMailTo(false);
  };

  const handleContentChange = () => {
    const updatedItem = {
      ...contentToItem(item),
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
      ...contentToItem(item),
      tags,
      updatedAt: new Date(),
    };
    onUpdate(updatedItem);
    setIsEditingTags(false);
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = item.tags.filter(tag => tag !== tagToRemove);
    const updatedItem = {
      ...contentToItem(item),
      tags: updatedTags,
      updatedAt: new Date(),
    };
    onUpdate(updatedItem);
  };

  useEffect(() => {
    setTitle(item.title);
    setContent(item.content);
    setLocation(item.eventLocation || "");
    setMailFrom(item.mailFrom || "");
    setMailTo(item.mailTo ? item.mailTo.join(", ") : "");
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

  return (
    <div>
      <Card className="rounded-t-lg border-b">
        <div className="p-1">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur}
            className="text-lg font-medium"
          />
        </div>
        
        {/* Task attributes */}
        {hasTaskAttributes(contentToItem(item)) && (
          <div className="flex items-center px-3 py-1">
            <IdeaCraftCheckbox
              checked={item.taskDone}
              onToggle={(checked) =>
                handleTaskToggle(contentToItem(item), checked)
              }
            />
            <label
              htmlFor={`task-${item.id}`}
              className={`text-sm ${
                item.taskDone ? "line-through text-muted-foreground" : ""
              }`}
            >
              Mark as done
            </label>
          </div>
        )}

        {/* Event attributes */}
        {hasEventAttributes(contentToItem(item)) && (
          <div className="px-3 py-1 space-y-1">
            {/* Date editor */}
            <div className="flex items-center text-sm text-event">
              <Calendar className="mr-1 w-4 h-4" />
              {!isEditingDate ? (
                <div 
                  className="flex items-center group cursor-pointer"
                  onClick={() => setIsEditingDate(true)}
                >
                  <span>{format(new Date(item.eventDate), "PPP")}</span>
                  <Pencil className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-70 transition-opacity" />
                </div>
              ) : (
                <Popover open={isEditingDate} onOpenChange={setIsEditingDate}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="h-8 pl-3 text-left font-normal w-[200px]"
                    >
                      {item.eventDate ? format(new Date(item.eventDate), "PPP") : "Select date"}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={new Date(item.eventDate)}
                      onSelect={handleDateChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>

            {/* Location editor */}
            {(item.eventLocation || isEditingLocation) && (
              <div className="flex items-center text-sm text-event">
                <MapPin className="mr-1 w-4 h-4" />
                {!isEditingLocation ? (
                  <div 
                    className="flex items-center group cursor-pointer"
                    onClick={() => setIsEditingLocation(true)}
                  >
                    <span>{item.eventLocation}</span>
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
        {hasMailAttributes(contentToItem(item)) && (
          <div className="px-3 py-1 space-y-1 text-sm text-mail">
            {/* From editor */}
            <div className="flex items-center">
              <span className="font-medium mr-1">From:</span>
              {!isEditingMailFrom ? (
                <div 
                  className="flex items-center group cursor-pointer"
                  onClick={() => setIsEditingMailFrom(true)}
                >
                  <span>{item.mailFrom}</span>
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
            {(item.mailTo && item.mailTo.length > 0) && (
              <div className="flex items-center">
                <span className="font-medium mr-1">To:</span>
                {!isEditingMailTo ? (
                  <div 
                    className="flex items-center group cursor-pointer"
                    onClick={() => setIsEditingMailTo(true)}
                  >
                    <span>{item.mailTo.join(", ")}</span>
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
        
        {/* Tags section */}
        {(item.tags.length > 0 || isEditingTags) && (
          <div className="px-3 py-2">
            <div className="flex items-center mb-1 text-xs text-muted-foreground">
              <Tag className="h-3 w-3 mr-1" />
              <span>Tags</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 ml-1"
                onClick={() => setIsEditingTags(!isEditingTags)}
              >
                <Pencil className="h-3 w-3" />
              </Button>
            </div>
            
            {isEditingTags ? (
              <div className="flex items-center space-x-2">
                <Input 
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="h-7 py-1 text-xs"
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
            ) : (
              <div className="flex flex-wrap gap-1">
                {item.tags.map((tag) => (
                  <BaseIdeaCraftChip
                    key={tag}
                    label={tag}
                    className="bg-muted text-muted-foreground"
                    suffixIcon={
                      <X 
                        className="size-3" 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTag(tag);
                        }}
                      />
                    }
                    onClick={() => {}}
                  />
                ))}
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
              <div className="max-w-none prose prose-sm dark:prose-invert">
                <ContentRenderer
                  content={processedContent}
                  allItems={allItems}
                  handleWikiLinkClick={handleUpdateSelectedItem}
                  onTaskToggle={handleTaskToggle}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="p-3">
            <div className="mb-2">
              <ContentTextarea value={content} onChange={setContent} />
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
              <Button 
                variant="default"
                size="sm"
                onClick={handleContentChange}
              >
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
