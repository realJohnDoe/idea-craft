
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface NavbarProps {
  activeFilter: string;
  onSearch: (query: string) => void;
  onCreateNew: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  activeFilter, 
  onSearch,
  onCreateNew
}) => {
  const isMobile = useIsMobile();
  
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-4 flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-event to-task">
              IdeaCraft
            </span>
          </Link>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <div className="relative w-40 md:w-64">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-full bg-muted pl-9 focus-visible:ring-offset-0"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          
          <Button onClick={onCreateNew} size="sm" className="rounded-full bg-gradient-to-r from-event to-task hover:opacity-90">
            <Plus className="mr-2 size-4" />
            <span className="hidden md:inline">Create</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
