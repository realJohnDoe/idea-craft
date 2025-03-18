
import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeNoteProps {
  onDismiss: () => void;
}

const WelcomeNote = ({ onDismiss }: WelcomeNoteProps) => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 max-w-md w-full px-4">
      <div className="glass-panel p-4 animate-float">
        <h3 className="text-lg font-medium flex items-center">
          <Check className="size-5 text-green-500 mr-2" />
          Welcome to IdeaCraft!
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Content can now have multiple attributes and you can link between items using [[title]] syntax!
        </p>
        <div className="mt-3 flex justify-end">
          <Button 
            variant="link" 
            className="text-muted-foreground hover:text-foreground"
            onClick={onDismiss}
          >
            Got it <ArrowRight className="ml-1 size-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeNote;
