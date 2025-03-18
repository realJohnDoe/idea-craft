
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  message: string;
  onCreateNew: () => void;
}

const EmptyState = ({ message, onCreateNew }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 animate-fade-in border rounded-lg p-8">
      <p className="text-lg text-muted-foreground mb-4">{message}</p>
      <Button 
        onClick={onCreateNew}
        size="lg"
        className="rounded-full px-6 bg-gradient-to-r from-event to-task hover:opacity-90"
      >
        <Plus className="mr-2 size-4" />
        Create your first item
      </Button>
    </div>
  );
};

export default EmptyState;
