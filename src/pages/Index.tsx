
import React, { useState, useEffect } from 'react';
import { getMockData, Content } from '@/lib/content-utils';
import { toast } from 'sonner';
import ContentItem from '@/components/ContentItem';
import ContentCreator from '@/components/ContentCreator';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Plus, Check, ArrowRight } from 'lucide-react';

const Index = () => {
  const [items, setItems] = useState<Content[]>([]);
  const [filteredItems, setFilteredItems] = useState<Content[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showCreator, setShowCreator] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Initialize with mock data
  useEffect(() => {
    const data = getMockData();
    setItems(data);
    setFilteredItems(data);
    
    // Simulate loading for animation
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);
  
  // Apply filters when filter or search changes
  useEffect(() => {
    let result = items;
    
    // Apply type filter
    if (filter !== 'all') {
      result = result.filter(item => item.type === filter);
    }
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        item => 
          item.title.toLowerCase().includes(searchLower) || 
          item.content.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredItems(result);
  }, [items, filter, search]);
  
  // Handle item update
  const handleUpdateItem = (updatedItem: Content) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };
  
  // Handle item deletion
  const handleDeleteItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    toast.success('Item deleted successfully');
  };
  
  // Handle create new item
  const handleCreateItem = (newItem: Content) => {
    setItems(prevItems => [newItem, ...prevItems]);
    setShowCreator(false);
    toast.success('Item created successfully');
  };
  
  // Get appropriate empty state message based on filters
  const getEmptyStateMessage = () => {
    if (search) {
      return `No ${filter !== 'all' ? filter : 'items'} found matching "${search}"`;
    }
    
    if (filter !== 'all') {
      return `No ${filter}s yet`;
    }
    
    return 'No items yet';
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar 
        activeFilter={filter}
        onFilterChange={setFilter}
        onSearch={setSearch}
        onCreateNew={() => setShowCreator(true)}
      />
      
      <main className="flex-1 container px-4 py-8 max-w-7xl mx-auto">
        {!isLoaded ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse-subtle">Loading your content...</div>
          </div>
        ) : showCreator ? (
          <ContentCreator 
            onCreate={handleCreateItem}
            onCancel={() => setShowCreator(false)}
          />
        ) : filteredItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-fade-in">
              {filteredItems.map((item, index) => (
                <ContentItem 
                  key={item.id} 
                  item={item} 
                  onUpdate={handleUpdateItem}
                  onDelete={handleDeleteItem}
                />
              ))}
            </div>
            
            {/* Floating action button for mobile */}
            <div className="md:hidden fixed bottom-6 right-6">
              <Button
                onClick={() => setShowCreator(true)}
                size="lg"
                className="rounded-full size-14 shadow-lg bg-gradient-to-r from-event to-task hover:opacity-90"
              >
                <Plus className="size-6" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 animate-fade-in">
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
      </main>
      
      {/* First-time user welcome */}
      {isLoaded && items.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 max-w-md w-full px-4">
          <div className="glass-panel p-4 animate-float">
            <h3 className="text-lg font-medium flex items-center">
              <Check className="size-5 text-green-500 mr-2" />
              Welcome to Transform!
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Try converting content between different types using the menu on each card.
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
      )}
    </div>
  );
};

export default Index;
