<<<<<<< HEAD
import { useState, useEffect } from "react";
import {
  getMockItems,
  Item,
  parseYamlToItem,
  parseYaml,
  hasTaskAttributes,
  hasEventAttributes,
  hasNoteAttributes,
  hasMailAttributes,
  itemToContent,
  generateUniqueId,
} from "@/lib/content-utils";
import { toast } from "sonner";
import ContentCreator from "@/components/ContentCreator";
=======

import { useCallback, useEffect, useState } from "react";
>>>>>>> 8f7a484d72965af80c69ae67c1163c821ca33ad0
import Navbar from "@/components/Navbar";
import { Item, Content, itemToContent, contentToItem } from "@/lib/content-utils";
import { useNavigate, useParams } from "react-router-dom";
import TypeFilter from "@/components/filters/TypeFilter";
import TagsFilter from "@/components/filters/TagsFilter";
import ContentCreator from "@/components/ContentCreator";
import WelcomeNote from "@/components/UI/WelcomeNote";
import EmptyState from "@/components/content/EmptyState";
import ContentList from "@/components/content/ContentList";
import { useIsMobile } from "@/hooks/use-mobile";
import SelectedItemView from "@/components/content/SelectedItemView";
import { processedExampleItems } from "@/lib/example-content";
import ExportMarkdown from "@/components/ExportMarkdown";
import { toast } from "sonner";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingContent, setIsCreatingContent] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const { itemId } = useParams();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const toggleTypeTag = (tag: string) => {
    if (activeFilter === tag) {
      setActiveFilter("");
    } else {
      setActiveFilter(tag);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const getAllTags = useCallback(() => {
    const allTags = content.reduce((acc, item) => {
      if (item.tags && item.tags.length > 0) {
        item.tags.forEach((tag) => {
          if (!acc.includes(tag)) {
            acc.push(tag);
          }
        });
      }
      return acc;
    }, [] as string[]);
    
    return allTags.sort();
  }, [content]);

  // Initialize with example items if no content exists
  useEffect(() => {
    const storedContent = localStorage.getItem("ideaCraft_content");
    
    if (storedContent) {
      try {
        const parsedContent = JSON.parse(storedContent).map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
          eventDate: item.eventDate ? new Date(item.eventDate) : undefined,
          eventEndDate: item.eventEndDate ? new Date(item.eventEndDate) : undefined,
        }));
        setContent(parsedContent);
      } catch (e) {
        console.error("Error parsing stored content:", e);
        setContent(processedExampleItems);
      }
    } else {
      // Use example items when no content exists
      setContent(processedExampleItems);
      setShowWelcome(true);
    }
  }, []);

  // Save content to localStorage when it changes
  useEffect(() => {
    if (content.length > 0) {
      localStorage.setItem("ideaCraft_content", JSON.stringify(content));
    }
  }, [content]);

<<<<<<< HEAD
    toast.success("Item deleted successfully");
  };

  const handleCreateItem = (newItem: Item) => {
    setItems((prevItems) => [newItem, ...prevItems]);
    setShowCreator(false);
    toast.success("Item created successfully");
  };

  interface ParsedTask {
    content: string;
    isDone: boolean;
  }

  function parseTasks(content: string): {
    tasks: ParsedTask[];
    updatedContent: string;
  } {
    const taskRegex = /^- \[([ x])\] (.+)$/gm;
    const tasks: ParsedTask[] = [];
    const updatedContent = content.replace(
      taskRegex,
      (match, status, taskContent) => {
        tasks.push({
          content: taskContent.trim(),
          isDone: status === "x",
        });
        return `[[task-placeholder-${tasks.length - 1}]]`;
      }
    );
    return { tasks, updatedContent };
  }

  const createNewContent = (
    file: File,
    textContent: string,
    existingItems: Item[]
  ): { mainContent: Item; taskContents: Item[] } => {
    const baseTitle = file.name.replace(/\.(md|txt)$/, "");
    const baseId = baseTitle.toLowerCase().replace(/\s+/g, "-");

    const existingIds = new Set(existingItems.map((item) => item.id));

    const { tasks, updatedContent } = parseTasks(textContent);
=======
  // Handle URL-based item selection
  useEffect(() => {
    if (itemId) {
      setSelectedItemId(itemId);
    } else {
      setSelectedItemId(null);
    }
  }, [itemId]);
>>>>>>> 8f7a484d72965af80c69ae67c1163c821ca33ad0

  const handleCreateContent = (newContent: Content) => {
    setContent([...content, newContent]);
    setIsCreatingContent(false);
    toast.success("Content created successfully!");
  };

  const handleUpdateContent = (updatedContent: Content | Item) => {
    // Convert Item to Content if needed
    const contentToUpdate = 'hasNoteAttributes' in updatedContent 
      ? updatedContent as Content
      : itemToContent(updatedContent as Item);
    
    setContent(content.map(item => 
      item.id === contentToUpdate.id ? contentToUpdate : item
    ));
    toast.success("Content updated successfully!");
  };

  const handleDeleteContent = (id: string) => {
    setContent(content.filter(item => item.id !== id));
    setSelectedItemId(null);
    navigate("/");
    toast.success("Content deleted successfully!");
  };

  const filteredContent = content.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = activeFilter === "" || 
      (activeFilter === "note" && item.hasNoteAttributes) || 
      (activeFilter === "task" && item.hasTaskAttributes) || 
      (activeFilter === "event" && item.hasEventAttributes) || 
      (activeFilter === "mail" && item.hasMailAttributes);
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => item.tags?.includes(tag));
    
    return matchesSearch && matchesType && matchesTags;
  });

  // Get the selected item (if any)
  const selectedItem = selectedItemId 
    ? content.find(item => item.id === selectedItemId) 
    : null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onSearch={setSearchQuery} onCreateNew={() => setIsCreatingContent(true)} />
      
      <main className="flex-1 container px-4 py-6">
        {/* Top section with filters and export button */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-medium">Your Content</h1>
            <div className="flex gap-2">
              <ExportMarkdown items={content} />
            </div>
          </div>
          
          <TypeFilter 
            activeFilter={activeFilter}
            toggleTypeTag={toggleTypeTag}
          />
<<<<<<< HEAD
        ) : showGitHubSync ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">GitHub Sync</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGitHubSync(false)}
              >
                Back to items
              </Button>
            </div>
            {/* <GitHubSync items={items} setItems={setItems} /> */}
=======
          
          {getAllTags().length > 0 && (
            <TagsFilter 
              selectedTags={selectedTags}
              toggleTag={toggleTag}
              getAllTags={getAllTags}
            />
          )}
        </div>

        {/* Content creation overlay */}
        {isCreatingContent && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <ContentCreator 
              onCreate={handleCreateContent} 
              onCancel={() => setIsCreatingContent(false)}
            />
>>>>>>> 8f7a484d72965af80c69ae67c1163c821ca33ad0
          </div>
        )}
        
        {/* Main content area */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Content list column */}
          <div className={`${selectedItem && !isMobile ? "lg:col-span-2" : "lg:col-span-3"}`}>
            {filteredContent.length === 0 && (
              <EmptyState 
                message={
                  content.length === 0 
                    ? "You don't have any content yet. Create your first item!"
                    : "No items match your search criteria."
                }
                onCreateNew={() => setIsCreatingContent(true)}
              />
            )}
            
            {filteredContent.length > 0 && (
              <ContentList 
                items={filteredContent} 
                onUpdate={handleUpdateContent}
                allItems={content}
              />
            )}
          </div>
          
          {/* Selected item view */}
          {selectedItem && (
            <div className={`${isMobile ? "fixed inset-0 bg-background z-50 overflow-y-auto" : "lg:col-span-1"}`}>
              <SelectedItemView 
                item={contentToItem(selectedItem)}
                onUpdate={handleUpdateContent}
                onDelete={handleDeleteContent}
                onClose={() => {
                  setSelectedItemId(null);
                  navigate("/");
                }}
                allItems={content.map(contentToItem)}
                isMobile={isMobile}
              />
            </div>
          )}
        </div>
      </main>

      {/* Welcome message */}
      {showWelcome && (
        <WelcomeNote onDismiss={() => setShowWelcome(false)} />
      )}
    </div>
  );
};

export default Index;
