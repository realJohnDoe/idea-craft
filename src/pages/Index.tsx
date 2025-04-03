
import { useCallback, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Item } from "@/lib/content-utils";
import { useNavigate, useParams } from "react-router-dom";
import TypeFilter from "@/components/filters/TypeFilter";
import TagsFilter from "@/components/filters/TagsFilter";
import ContentCreator from "@/components/ContentCreator";
import WelcomeNote from "@/components/UI/WelcomeNote";
import EmptyState from "@/components/content/EmptyState";
import ContentList from "@/components/content/ContentList";
import { useIsMobile } from "@/hooks/use-mobile";
import SelectedItemView from "@/components/content/SelectedItemView";
import ExportMarkdown from "@/components/ExportMarkdown";
import { toast } from "sonner";
import { createSafeFilename, generateUniqueId } from "@/lib/id-utils";

// Convert example content to Items
const processedExampleItems: Item[] = [
  {
    id: "note-welcome-guide",
    title: "Welcome to IdeaCraft",
    content: "Welcome to your personal knowledge and task management system! IdeaCraft helps you organize your thoughts, tasks, events, and communications in one place.\n\n## Getting Started\n\n- Create your first item using the '+' button\n- Choose from different types: notes, tasks, events, or email drafts\n- Link between items using [[double brackets]]\n\n## Tips\n\n- Use tags to organize content\n- Filter by type or tags\n- Export your content as markdown files\n\nEnjoy organizing your digital life!",
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ["guide", "help"]
  },
  {
    id: "task-demo-task",
    title: "Try out the task feature",
    content: "- [x] Create my first task\n- [ ] Add a due date\n- [ ] Link to a note\n- [ ] Complete this task",
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ["demo"],
    done: false
  },
  {
    id: "event-sample-event",
    title: "Team meeting",
    content: "Discuss project progress and next steps.\n\nAgenda:\n1. Project updates\n2. Timeline review\n3. Task assignments\n4. Open discussion",
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ["work", "meeting"],
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    location: "Conference Room B"
  }
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingContent, setIsCreatingContent] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [items, setItems] = useState<Item[]>([]);
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
    const allTags = items.reduce((acc, item) => {
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
  }, [items]);

  // Initialize with example items if no content exists
  useEffect(() => {
    const storedContent = localStorage.getItem("ideaCraft_content");
    
    if (storedContent) {
      try {
        const parsedItems = JSON.parse(storedContent).map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
          date: item.date ? new Date(item.date) : undefined,
        }));
        setItems(parsedItems);
      } catch (e) {
        console.error("Error parsing stored content:", e);
        setItems(processedExampleItems);
      }
    } else {
      // Use example items when no content exists
      setItems(processedExampleItems);
      setShowWelcome(true);
    }
  }, []);

  // Save content to localStorage when it changes
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("ideaCraft_content", JSON.stringify(items));
    }
  }, [items]);

  // Handle URL-based item selection
  useEffect(() => {
    if (itemId) {
      setSelectedItemId(itemId);
    } else {
      setSelectedItemId(null);
    }
  }, [itemId]);

  const handleCreateContent = (newItem: Item) => {
    setItems([...items, newItem]);
    setIsCreatingContent(false);
    toast.success("Content created successfully!");
  };

  const handleUpdateContent = (updatedItem: Item) => {
    setItems(items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    toast.success("Content updated successfully!");
  };

  const handleDeleteContent = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    setSelectedItemId(null);
    navigate("/");
    toast.success("Content deleted successfully!");
  };

  const filteredContent = items.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply content type filter
    let matchesType = true;
    if (activeFilter !== "") {
      if (activeFilter === "task") matchesType = item.done !== undefined;
      else if (activeFilter === "event") matchesType = item.date !== undefined || item.location !== undefined;
      else if (activeFilter === "mail") matchesType = item.from !== undefined || item.to !== undefined;
      else if (activeFilter === "note") {
        // Note if no other attributes are present
        matchesType = item.done === undefined && 
                      item.date === undefined && 
                      item.location === undefined && 
                      item.from === undefined && 
                      item.to === undefined;
      }
    }
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => item.tags?.includes(tag));
    
    return matchesSearch && matchesType && matchesTags;
  });

  // Get the selected item (if any)
  const selectedItem = selectedItemId 
    ? items.find(item => item.id === selectedItemId) 
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
              <ExportMarkdown items={items} />
            </div>
          </div>
          
          <TypeFilter 
            activeFilter={activeFilter}
            toggleTypeTag={toggleTypeTag}
          />
          
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
          </div>
        )}
        
        {/* Main content area */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Content list column */}
          <div className={`${selectedItem && !isMobile ? "lg:col-span-2" : "lg:col-span-3"}`}>
            {filteredContent.length === 0 && (
              <EmptyState 
                message={
                  items.length === 0 
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
                allItems={items}
              />
            )}
          </div>
          
          {/* Selected item view */}
          {selectedItem && (
            <div className={`${isMobile ? "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-y-auto" : "lg:col-span-1"}`}>
              <SelectedItemView 
                item={selectedItem}
                onUpdate={handleUpdateContent}
                onDelete={handleDeleteContent}
                onClose={() => {
                  setSelectedItemId(null);
                  navigate("/");
                }}
                allItems={items}
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
