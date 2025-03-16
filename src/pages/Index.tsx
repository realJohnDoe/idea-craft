
import React, { useState, useEffect } from 'react';
import { getMockData, Content, parseYamlToContent, parseYaml } from '@/lib/content-utils';
import { toast } from 'sonner';
import ContentItem from '@/components/content-item';
import ContentCreator from '@/components/ContentCreator';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { 
  Plus, Check, ArrowRight, FileText, Calendar, 
  Mail, CheckCircle, X, Tag
} from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-mobile';

const Index = () => {
  const [items, setItems] = useState<Content[]>([]);
  const [filteredItems, setFilteredItems] = useState<Content[]>([]);
  const [filter, setFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [showCreator, setShowCreator] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Content | null>(null);
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  useEffect(() => {
    const data = getMockData();
    setItems(data);
    setFilteredItems(data);
    
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);
  
  // Get all unique tags from items
  const getAllTags = () => {
    const tags = new Set<string>();
    items.forEach(item => {
      if (item.tags && item.tags.length > 0) {
        item.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  };
  
  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prevTags => 
      prevTags.includes(tag) 
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
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
    
    // Filter by selected tags
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
    
    // Update selected item if it was updated
    if (selectedItem && selectedItem.id === updatedItem.id) {
      setSelectedItem(updatedItem);
    }
  };
  
  const handleDeleteItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    
    // Clear selected item if it was deleted
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
  
  const handleSelectItem = (item: Content) => {
    setSelectedItem(item);
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
  
  const getFilterIcon = () => {
    switch (filter) {
      case 'task':
        return <CheckCircle className="size-5 text-task mr-1.5" />;
      case 'event':
        return <Calendar className="size-5 text-event mr-1.5" />;
      case 'note':
        return <FileText className="size-5 text-note mr-1.5" />;
      case 'mail':
        return <Mail className="size-5 text-mail mr-1.5" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar 
        activeFilter={filter}
        onFilterChange={setFilter}
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
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* List view panel */}
            <div className={`flex-1 ${selectedItem && !isMobile ? 'md:w-1/2 lg:w-2/5' : 'w-full'}`}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  {getFilterIcon()}
                  <h2 className="text-lg font-medium">
                    {filter === 'all' ? 'All Items' : `${filter.charAt(0).toUpperCase() + filter.slice(1)}s`}
                    <span className="text-muted-foreground ml-2 text-sm">({filteredItems.length})</span>
                  </h2>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleImport}
                  className="text-xs"
                >
                  Import
                </Button>
              </div>
              
              {/* Tags filter */}
              {getAllTags().length > 0 && (
                <div className="mb-4">
                  <div className="text-sm text-muted-foreground mb-2 flex items-center">
                    <Tag className="size-3 mr-1" />
                    Tags filter:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {getAllTags().map(tag => (
                      <button
                        key={tag}
                        className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                          selectedTags.includes(tag)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                        {selectedTags.includes(tag) && <X className="size-3" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {filteredItems.length > 0 ? (
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  {filteredItems.map((item) => (
                    <ContentItem 
                      key={item.id} 
                      item={item} 
                      onUpdate={handleUpdateItem}
                      onDelete={handleDeleteItem}
                      allItems={items}
                      isListView={true}
                      onSelect={handleSelectItem}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 animate-fade-in border rounded-lg p-8">
                  <p className="text-lg text-muted-foreground mb-4">{getEmptyStateMessage()}</p>
                  <Button 
                    onClick={() => setShowCreator(true)}
                    size="lg"
                    className="rounded-full px-6 bg-gradient-to-r from-event to-task hover:opacity-90"
                  >
                    <Plus className="mr-2 size-4" />
                    Create your first item
                  </Button>
                </div>
              )}
            </div>
            
            {/* Detail view panel */}
            {selectedItem && !isMobile && (
              <div className="md:w-1/2 lg:w-3/5 sticky top-4 self-start">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Selected Item</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedItem(null)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4 shadow-sm">
                  <ContentItem 
                    item={selectedItem} 
                    onUpdate={handleUpdateItem}
                    onDelete={handleDeleteItem}
                    allItems={items}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="md:hidden fixed bottom-6 right-6">
          <Button
            onClick={() => setShowCreator(true)}
            size="lg"
            className="rounded-full size-14 shadow-lg bg-gradient-to-r from-event to-task hover:opacity-90"
          >
            <Plus className="size-6" />
          </Button>
        </div>
      </main>
      
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 max-w-md w-full px-4">
        <div className="glass-panel p-4 animate-float">
          <h3 className="text-lg font-medium flex items-center">
            <Check className="size-5 text-green-500 mr-2" />
            Welcome to Transform!
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Content can now have multiple attributes and you can link between items using [[title]] syntax!
          </p>
          <div className="mt-3 flex justify-end">
            <Button 
              variant="link" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => document.querySelector('.glass-panel')?.classList.add('animate-fade-out')}
            >
              Got it <ArrowRight className="ml-1 size-3" />
            </Button>
          </div>
        </div>
      </div>
      
      <style>
        {`
        .content-link {
          color: #3b82f6;
          text-decoration: underline;
          cursor: pointer;
        }
        
        .highlight-pulse {
          animation: pulse 1.5s ease-in-out;
        }
        
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
          50% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.2); }
        }
        
        .list-content-item:not(:last-child) {
          border-bottom: 1px solid var(--border);
        }
        
        .list-content-item:hover {
          background-color: var(--muted);
        }
        
        .content-item-tag {
          padding: 0.125rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
        }
        `}
      </style>
    </div>
  );
};

export default Index;
