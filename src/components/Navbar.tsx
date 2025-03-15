
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, FileText, Mail, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface NavbarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onSearch: (query: string) => void;
  onCreateNew: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  activeFilter, 
  onFilterChange, 
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
              Transform
            </span>
          </Link>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <nav className="hidden md:flex items-center space-x-1">
            <Button
              variant={activeFilter === 'all' ? 'default' : 'ghost'}
              className={cn(
                'px-3',
                activeFilter === 'all' ? 'bg-background text-foreground shadow-sm' : ''
              )}
              onClick={() => onFilterChange('all')}
            >
              All
            </Button>
            <Button
              variant={activeFilter === 'note' ? 'default' : 'ghost'}
              className={cn(
                'px-3',
                activeFilter === 'note' ? 'bg-note-light text-note shadow-sm' : ''
              )}
              onClick={() => onFilterChange('note')}
            >
              <FileText className="mr-2 size-4" />
              Notes
            </Button>
            <Button
              variant={activeFilter === 'task' ? 'default' : 'ghost'}
              className={cn(
                'px-3',
                activeFilter === 'task' ? 'bg-task-light text-task shadow-sm' : ''
              )}
              onClick={() => onFilterChange('task')}
            >
              <CheckCircle className="mr-2 size-4" />
              Tasks
            </Button>
            <Button
              variant={activeFilter === 'event' ? 'default' : 'ghost'}
              className={cn(
                'px-3',
                activeFilter === 'event' ? 'bg-event-light text-event shadow-sm' : ''
              )}
              onClick={() => onFilterChange('event')}
            >
              <Calendar className="mr-2 size-4" />
              Events
            </Button>
            <Button
              variant={activeFilter === 'mail' ? 'default' : 'ghost'}
              className={cn(
                'px-3',
                activeFilter === 'mail' ? 'bg-mail-light text-mail shadow-sm' : ''
              )}
              onClick={() => onFilterChange('mail')}
            >
              <Mail className="mr-2 size-4" />
              Emails
            </Button>
          </nav>
          
          {isMobile && (
            <div className="flex items-center space-x-1">
              <Button
                variant={activeFilter === 'all' ? 'default' : 'ghost'}
                className="px-3"
                onClick={() => onFilterChange('all')}
              >
                All
              </Button>
              <Button
                variant={activeFilter === 'note' ? 'default' : 'ghost'}
                className="px-3"
                onClick={() => onFilterChange('note')}
              >
                <FileText className="size-4" />
              </Button>
              <Button
                variant={activeFilter === 'task' ? 'default' : 'ghost'}
                className="px-3"
                onClick={() => onFilterChange('task')}
              >
                <CheckCircle className="size-4" />
              </Button>
              <Button
                variant={activeFilter === 'event' ? 'default' : 'ghost'}
                className="px-3"
                onClick={() => onFilterChange('event')}
              >
                <Calendar className="size-4" />
              </Button>
              <Button
                variant={activeFilter === 'mail' ? 'default' : 'ghost'}
                className="px-3"
                onClick={() => onFilterChange('mail')}
              >
                <Mail className="size-4" />
              </Button>
            </div>
          )}
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
