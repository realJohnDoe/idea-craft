
import { useCallback, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { 
  Item, 
  Content, 
  itemToContent, 
  contentToItem,
  createSafeIdFromTitle,
  processWikilinks
} from "@/lib/content-utils";
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

  // Process wikilinks in all content when content changes
  const processContentWikilinks = useCallback(() => {
    if (content.length === 0) return;

    const updatedContent = content.map(item => {
      // Process wikilinks in the content to ensure they have proper IDs
      const processedContent = processWikilinks(item.content, content);
      
      // Only update if the content changed
      if (processedContent !== item.content) {
        return { ...item, content: processedContent };
      }
      
      return item;
    });

    // Update content if any changes were made
    const hasChanges = updatedContent.some((item, index) => item.content !== content[index].content);
    if (hasChanges) {
      setContent(updatedContent);
    }
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

  // Process wikilinks after content is loaded or changed
  useEffect(() => {
    processContentWikilinks();
  }, [processContentWikilinks]);

  // Save content to localStorage when it changes
  useEffect(() => {
    if (content.length > 0) {
      localStorage.setItem("ideaCraft_content", JSON.stringify(content));
    }
  }, [content]);

  // Handle URL-based item selection
  useEffect(() => {
    if (itemId) {
      setSelectedItemId(itemId);
    } else {
      setSelectedItemId(null);
    }
  }, [itemId]);

  const handleCreateContent = (newContent: Content) => {
    // Process any wikilinks in the new content before adding
    const processedContent = { 
      ...newContent,
      content: processWikilinks(newContent.content, content)
    };
    
    setContent([...content, processedContent]);
    setIsCreatingContent(false);
    toast.success("Content created successfully!");
  };

  const handleUpdateContent = (updatedContent: Content | Item) => {
    // Convert Item to Content if needed
    let contentToUpdate = 'hasNoteAttributes' in updatedContent 
      ? updatedContent as Content
      : itemToContent(updatedContent as Item);
    
    // Process any wikilinks in the updated content
    contentToUpdate = {
      ...contentToUpdate,
      content: processWikilinks(contentToUpdate.content, content)
    };
    
    setContent(content.map(item => 
      item.id === contentToUpdate.id ? contentToUpdate : item
    ));
    
    // If we're updating the currently selected item, update the URL with the ID
    if (selectedItemId === contentToUpdate.id) {
      navigate(`/item/${contentToUpdate.id}`);
    }
    
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

  // Get a className for the list container based on whether an item is selected
  const listContainerClass = selectedItem 
    ? "relative filter blur-[0px] md:blur-[1px] transition-all" 
    : "";

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
        <div className={listContainerClass}>
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
      </main>

      {/* Welcome message */}
      {showWelcome && (
        <WelcomeNote onDismiss={() => setShowWelcome(false)} />
      )}
      
      {/* Selected item view */}
      {selectedItem && (
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
      )}
    </div>
  );
};

export default Index;
