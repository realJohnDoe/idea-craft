
import React, { useState, useEffect } from 'react';
import { getMockData, Content, parseYamlToContent, parseYaml } from '@/lib/content-utils';
import { toast } from 'sonner';
import ContentItem from '@/components/content-item';
import ContentCreator from '@/components/ContentCreator';
import Navbar from '@/components/Navbar';
import GitHubSync from '@/components/GitHubSync';
import { Button } from '@/components/ui/button';
import { Plus, Check, Github } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import TagsFilter from '@/components/filters/TagsFilter';
import TypeFilter from '@/components/filters/TypeFilter';
import EmptyState from '@/components/content/EmptyState';
import ContentList from '@/components/content/ContentList';
import SelectedItemView from '@/components/content/SelectedItemView';
import WelcomeNote from '@/components/UI/WelcomeNote';
import ActionStyles from '@/components/UI/ActionStyles';

const Index = () => {
  const [items, setItems] = useState<Content[]>([]);
  const [filteredItems, setFilteredItems] = useState<Content[]>([]);
  const [filter, setFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [showCreator, setShowCreator] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Content | null>(null);
  const [showWelcomeNote, setShowWelcomeNote] = useState(true);
  const [showGitHubSync, setShowGitHubSync] = useState(false);
  
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const data = getMockData();
    setItems(data);
    setFilteredItems(data);
    
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);
  
  const getAllTags = () => {
    const tags = new Set<string>();
    items.forEach(item => {
      if (item.tags && item.tags.length > 0) {
        item.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  };
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prevTags => 
      prevTags.includes(tag) 
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  };

  const toggleTypeTag = (type: string) => {
    if (type === filter) {
      setFilter('all');
    } else {
      setFilter(type);
    }
  };
  
  useEffect(() => {
    let result = items;
    
    if (filter !== 'all') {
      switch (filter) {
        case 'task':
          result = result.filter(item => item.hasTaskAttributes);
          break;
        case 'event':
          result = result.filter(item => item.hasEventAttributes);
          break;
        case 'note':
          result = result.filter(item => item.hasNoteAttributes);
          break;
        case 'mail':
          result = result.filter(item => item.hasMailAttributes);
          break;
      }
    }
    
    if (selectedTags.length > 0) {
      result = result.filter(item => 
        item.tags && 
        selectedTags.every(tag => item.tags.includes(tag))
      );
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        item => 
          item.title.toLowerCase().includes(searchLower) || 
          item.content.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredItems(result);
  }, [items, filter, search, selectedTags]);
  
  const handleUpdateItem = (updatedItem: Content) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    
    if (selectedItem && selectedItem.id === updatedItem.id) {
      setSelectedItem(updatedItem);
    }
  };
  
  const handleDeleteItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem(null);
    }
    
    toast.success('Item deleted successfully');
  };
  
  const handleCreateItem = (newItem: Content) => {
    setItems(prevItems => [newItem, ...prevItems]);
    setShowCreator(false);
    toast.success('Item created successfully');
  };
  
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.txt';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const content = await file.text();
          const { yamlData, content: textContent } = parseYaml(content);
          
          const newContent: Content = {
            id: Math.random().toString(36).substring(2, 9),
            title: file.name.replace(/\.(md|txt)$/, ''),
            content: textContent,
            createdAt: new Date(),
            updatedAt: new Date(),
            hasTaskAttributes: false,
            hasEventAttributes: false,
            hasMailAttributes: false,
            hasNoteAttributes: true,
            tags: [],
            yaml: ''
          };
          
          const parsedContent = parseYamlToContent(yamlData, newContent);
          
          setItems(prevItems => [parsedContent, ...prevItems]);
          toast.success('Content imported successfully');
        } catch (error) {
          console.error('Import error:', error);
          toast.error('Failed to import content');
        }
      }
    };
    input.click();
  };
  
  const getEmptyStateMessage = () => {
    if (search) {
      return `No ${filter !== 'all' ? filter : 'items'} found matching "${search}"`;
    }
    
    if (selectedTags.length > 0) {
      return `No items with selected tags found`;
    }
    
    if (filter !== 'all') {
      return `No items with ${filter} attributes yet`;
    }
    
    return 'No items yet';
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar 
        activeFilter={filter}
        onSearch={setSearch}
        onCreateNew={() => setShowCreator(true)}
      />
      
      <main className="flex-1 container px-4 py-4 max-w-7xl mx-auto">
        {!isLoaded ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse-subtle">Loading your content...</div>
          </div>
        ) : showCreator ? (
          <ContentCreator 
            onCreate={handleCreateItem}
            onCancel={() => setShowCreator(false)}
          />
        ) : showGitHubSync ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">GitHub Sync</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGitHubSync(false)}
              >
                Back to items
              </Button>
            </div>
            <GitHubSync items={items} />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            <div className={`flex-1 ${selectedItem && !isMobile ? 'md:w-1/2 lg:w-2/5' : 'w-full'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">
                  {filter === 'all' ? 'All Items' : `${filter.charAt(0).toUpperCase() + filter.slice(1)}s`}
                  <span className="text-muted-foreground ml-2 text-sm">({filteredItems.length})</span>
                </h2>
                <div className="flex items-center gap-2">
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
              
              <TypeFilter 
                activeFilter={filter} 
                toggleTypeTag={toggleTypeTag} 
              />

              <TagsFilter 
                selectedTags={selectedTags}
                toggleTag={toggleTag}
                getAllTags={getAllTags}
              />
              
              {filteredItems.length > 0 ? (
                <ContentList 
                  items={filteredItems}
                  onUpdate={handleUpdateItem}
                  onDelete={handleDeleteItem}
                  allItems={items}
                  onSelect={setSelectedItem}
                />
              ) : (
                <EmptyState 
                  message={getEmptyStateMessage()}
                  onCreateNew={() => setShowCreator(true)}
                />
              )}
            </div>
            
            {selectedItem && (
              <SelectedItemView
                item={selectedItem}
                onUpdate={handleUpdateItem}
                onDelete={handleDeleteItem}
                onClose={() => setSelectedItem(null)}
                allItems={items}
                isMobile={isMobile}
              />
            )}
          </div>
        )}
        
        <div className="md:hidden fixed bottom-6 right-6">
          <Button
            onClick={() => setShowCreator(true)}
            size="lg"
            className="rounded-full size-14 shadow-lg bg-gradient-to-r from-note to-task hover:opacity-90"
          >
            <Plus className="size-6" />
          </Button>
        </div>
      </main>
      
      {showWelcomeNote && (
        <WelcomeNote onDismiss={() => setShowWelcomeNote(false)} />
      )}
      
      <ActionStyles />
    </div>
  );
};

export default Index;
