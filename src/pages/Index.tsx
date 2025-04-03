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
import Navbar from "@/components/Navbar";
import GitHubSync from "@/components/GitHubSync";
import { Button } from "@/components/ui/button";
import { Plus, Github } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import TagsFilter from "@/components/filters/TagsFilter";
import TypeFilter from "@/components/filters/TypeFilter";
import EmptyState from "@/components/content/EmptyState";
import ContentList from "@/components/content/ContentList";
import SelectedItemView from "@/components/content/SelectedItemView";
import WelcomeNote from "@/components/UI/WelcomeNote";
import ActionStyles from "@/components/UI/ActionStyles";
import { useNavigate, useParams } from "react-router-dom";

const Index = () => {
  const { itemId } = useParams();
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [showCreator, setShowCreator] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showWelcomeNote, setShowWelcomeNote] = useState(true);
  const [showGitHubSync, setShowGitHubSync] = useState(false);

  const isMobile = useIsMobile();

  useEffect(() => {
    const data = getMockItems();
    setItems(data);
    setFilteredItems(data);

    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  // Sync URL parameter with selected item
  useEffect(() => {
    if (itemId) {
      const item = items.find((i) => i.id === itemId);
      document.body.style.overflow = "hidden";
      setSelectedItem(item || null);
    } else {
      document.body.style.overflow = "auto";
      setSelectedItem(null);
    }
  }, [itemId, items]);

  const getAllTags = () => {
    const tags = new Set<string>();
    items.forEach((item) => {
      if (item.tags && item.tags.length > 0) {
        item.tags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const toggleTypeTag = (type: string) => {
    if (type === filter) {
      setFilter("all");
    } else {
      setFilter(type);
    }
  };

  useEffect(() => {
    let result = items;

    if (filter !== "all") {
      switch (filter) {
        case "task":
          result = result.filter((item) => hasTaskAttributes(item));
          break;
        case "event":
          result = result.filter((item) => hasEventAttributes(item));
          break;
        case "note":
          result = result.filter((item) => hasNoteAttributes(item));
          break;
        case "mail":
          result = result.filter((item) => hasMailAttributes(item));
          break;
      }
    }

    if (selectedTags.length > 0) {
      result = result.filter(
        (item) =>
          item.tags && selectedTags.every((tag) => item.tags.includes(tag))
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.content.toLowerCase().includes(searchLower)
      );
    }

    setFilteredItems(result);
  }, [items, filter, search, selectedTags]);

  const handleUpdateItem = (updatedItem: Item) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );

    if (selectedItem && selectedItem.id === updatedItem.id) {
      setSelectedItem(updatedItem);
    }
  };

  const handleDeleteItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));

    if (selectedItem && selectedItem.id === id) {
      setSelectedItem(null);
    }

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

    // Add line breaks after wikilinks in task content
    const processWikilinks = (content: string) => {
      return content.replace(/\[\[(.*?)\]\]/g, (match, content) => {
        const [title, id] = content.split("|");
        const linkId = id || content.replace(/\s+/g, "-").toLowerCase();
        return `[[${title || content}]]  \n`; // Add line break after wikilink
      });
    };

    const taskContents: Item[] = tasks.map((task, index) => {
      const title = task.content.substring(0, 50);
      const content = task.content;

      return {
        id: generateUniqueId(`${baseId}-task-${index + 1}`, existingIds),
        title: title,
        content: title === content ? "" : processWikilinks(content),
        createdAt: new Date(),
        updatedAt: new Date(),
        done: task.isDone,
        tags: [],
      };
    });

    // Replace placeholders with actual task IDs
    const finalContent = updatedContent.replace(
      /\[\[task-placeholder-(\d+)\]\]/g,
      (_, index) => {
        return `[[${taskContents[parseInt(index)].id}]]`;
      }
    );

    // Process wikilinks for main content
    const processedFinalContent = processWikilinks(finalContent);

    const mainContent: Item = {
      id: generateUniqueId(baseId, existingIds),
      title: baseTitle,
      content: processedFinalContent, // Processed main content
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
    };

    return { mainContent, taskContents };
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.webkitdirectory = true; // Allow directory selection
    input.accept = ".md,.txt";
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        const importedContents = await Promise.all(
          Array.from(files)
            .filter((file) => {
              const relativePath = file.webkitRelativePath;
              const pathParts = relativePath.split("/");
              return !pathParts.some((part) => part.startsWith("."));
            })
            .map(async (file) => {
              try {
                const content = await file.text();
                const { yamlData, content: textContent } = parseYaml(content);

                const { mainContent, taskContents } = createNewContent(
                  file,
                  textContent,
                  items
                );

                const parsedMainContent = parseYamlToItem(
                  yamlData,
                  mainContent
                );

                // Apply YAML parsing to task contents if needed
                const parsedTaskContents = taskContents.map((taskContent) =>
                  parseYamlToItem(yamlData, taskContent)
                );

                return [parsedMainContent, ...parsedTaskContents];
              } catch (error) {
                console.error("Import error:", error);
                toast.error("Failed to import content");
              }
            })
        );
        const allNewContents = importedContents.flat();
        setItems((prevItems) => [...allNewContents, ...prevItems]);
        toast.success("Content imported successfully");
      }
    };
    input.click();
  };

  const getEmptyStateMessage = () => {
    if (search) {
      return `No ${
        filter !== "all" ? filter : "items"
      } found matching "${search}"`;
    }

    if (selectedTags.length > 0) {
      return `No items with selected tags found`;
    }

    if (filter !== "all") {
      return `No items with ${filter} attributes yet`;
    }

    return "No items yet";
  };

  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar onSearch={setSearch} onCreateNew={() => setShowCreator(true)} />

      <main className="container flex-1 px-4 py-4 mx-auto max-w-7xl">
        {!isLoaded ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse-subtle">Loading your content...</div>
          </div>
        ) : showCreator ? (
          <ContentCreator
            onCreate={handleCreateItem}
            onCancel={() => setShowCreator(false)}
          />
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
          </div>
        ) : (
          <div className="flex flex-col gap-6 md:flex-row">
            <div className={`flex-1`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">
                  {filter === "all"
                    ? "All Items"
                    : `${filter.charAt(0).toUpperCase() + filter.slice(1)}s`}
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({filteredItems.length})
                  </span>
                </h2>
                <div className="flex gap-2 items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowGitHubSync(true)}
                    className="text-xs"
                  >
                    <Github className="mr-1 size-3" />
                    Sync
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleImport}
                    className="text-xs"
                  >
                    Import
                  </Button>
                </div>
              </div>

              <TypeFilter activeFilter={filter} toggleTypeTag={toggleTypeTag} />

              <TagsFilter
                selectedTags={selectedTags}
                toggleTag={toggleTag}
                getAllTags={getAllTags}
              />

              {filteredItems.length > 0 ? (
                <ContentList
                  items={filteredItems.map(itemToContent)}
                  onUpdate={handleUpdateItem}
                  allItems={items.map(itemToContent)}
                />
              ) : (
                <EmptyState
                  message={getEmptyStateMessage()}
                  onCreateNew={() => setShowCreator(true)}
                />
              )}
            </div>

            {selectedItem && (
              <div className="fixed inset-0 z-10">
                {/* Left side blur */}
                <div className="fixed inset-0 right-[720px] bg-background/50 backdrop-blur-sm" />

                {/* Selected item view */}
                <div className="absolute right-0 top-0 w-full bg-background max-w-[720px] h-full border-l border-border shadow-lg">
                  <div className="overflow-y-auto h-full">
                    <SelectedItemView
                      item={selectedItem}
                      onUpdate={handleUpdateItem}
                      onDelete={handleDeleteItem}
                      onClose={() => navigate("/")}
                      allItems={items}
                      isMobile={isMobile}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {showWelcomeNote && (
        <WelcomeNote onDismiss={() => setShowWelcomeNote(false)} />
      )}

      <ActionStyles />
    </div>
  );
};

export default Index;
