import { useCallback, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Item } from "@/lib/content-utils";
import { useNavigate, useParams } from "react-router-dom";
import TypeFilter from "@/components/filters/TypeFilter";
import TagsFilter from "@/components/filters/TagsFilter";
import EmptyState from "@/components/content/EmptyState";
import ContentList from "@/components/content/ContentList";
import { useIsMobile } from "@/hooks/use-mobile";
import SelectedItemView from "@/components/content/SelectedItemView";
import { toast } from "sonner";
import { simplifiedExampleContentItems } from "@/lib/example-content";
import { nanoid } from "@/lib/id-utils";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingContent, setIsCreatingContent] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const { itemId } = useParams();
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
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
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
        setItems(simplifiedExampleContentItems);
      }
    } else {
      // Use example items when no content exists
      setItems(simplifiedExampleContentItems);
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

  const handleCreateContent = () => {
    const newItem: Item = {
      id: nanoid(),
      title: "New Item",
      tags: [],
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setItems([...items, newItem]);
    setIsCreatingContent(false);
    navigate(`/item/${newItem.id}`);
    toast.success("New item created!");
  };

  const handleUpdateContent = (updatedItem: Item) => {
    setItems(
      items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    toast.success("Content updated successfully!");
  };

  const handleDeleteContent = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    setSelectedItemId(null);
    navigate("/");
    toast.success("Content deleted successfully!");
  };

  const handleImportItems = (importedItems: Item[]) => {
    setItems((prevItems) => [...prevItems, ...importedItems]);
    toast.success(`Imported ${importedItems.length} items successfully!`);
  };

  const filteredContent = items.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());

    // Apply content type filter
    let matchesType = true;
    if (activeFilter !== "") {
      if (activeFilter === "task") matchesType = item.done !== undefined;
      else if (activeFilter === "event")
        matchesType = item.date !== undefined || item.location !== undefined;
      else if (activeFilter === "mail")
        matchesType = item.from !== undefined || item.to !== undefined;
      else if (activeFilter === "note") {
        // Note if no other attributes are present
        matchesType =
          item.done === undefined &&
          item.date === undefined &&
          item.location === undefined &&
          item.from === undefined &&
          item.to === undefined;
      }
    }

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => item.tags?.includes(tag));

    return matchesSearch && matchesType && matchesTags;
  });

  // Get the selected item (if any)
  const selectedItem = selectedItemId
    ? items.find((item) => item.id === selectedItemId)
    : null;

  const showSelectedItem = selectedItem;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        onSearch={setSearchQuery}
        onCreateNew={handleCreateContent}
        items={items}
        onImport={handleImportItems}
      />

      <div className="flex flex-col lg:flex-row">
        {/* Left column: Filters and content list */}
        <div className="hidden lg:block lg:w-1/3 ">
          <div className="flex flex-col">
            <div className="px-4 my-2">
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

              {filteredContent.length === 0 ? (
                <EmptyState
                  message={
                    items.length === 0
                      ? "You don't have any content yet. Create your first item!"
                      : "No items match your search criteria."
                  }
                  onCreateNew={handleCreateContent}
                />
              ) : (
                <ContentList
                  items={filteredContent}
                  onUpdate={handleUpdateContent}
                  allItems={items}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right column: Selected item */}
        {showSelectedItem && (
          <div className="block bg-background lg:w-2/3">
            <SelectedItemView
              item={selectedItem}
              onUpdate={handleUpdateContent}
              onDelete={handleDeleteContent}
              onClose={() => navigate("/")}
              allItems={items}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
