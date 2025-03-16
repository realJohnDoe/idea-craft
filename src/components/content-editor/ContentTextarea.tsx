
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useQuery } from '@tanstack/react-query';
import { Content } from '@/lib/content-utils';
import { Loader2 } from 'lucide-react';

interface ContentTextareaProps {
  value: string;
  onChange: (value: string) => void;
}

const ContentTextarea: React.FC<ContentTextareaProps> = ({ 
  value, 
  onChange 
}) => {
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [triggerPosition, setTriggerPosition] = useState({ top: 0, left: 0 });

  // Get all content items for suggestions
  const { data: allItems = [], isLoading } = useQuery({
    queryKey: ['content-items'],
    queryFn: async () => {
      // In a real app, this would be a fetch to your API
      // For now, use the mock data function
      const { getMockData } = await import('@/lib/content-utils');
      return getMockData();
    }
  });

  // Check if we should show suggestions
  useEffect(() => {
    if (!cursorPosition || !value) return;

    const textBeforeCursor = value.substring(0, cursorPosition);
    const match = textBeforeCursor.match(/\[\[([^\]]*?)$/);

    if (match) {
      const searchText = match[1];
      setSearchTerm(searchText);
      setShowSuggestions(true);
      
      // Calculate position for the suggestion popover
      if (textareaRef.current) {
        const textarea = textareaRef.current;
        const textBeforeCursor = value.substring(0, cursorPosition);
        const dummyDiv = document.createElement('div');
        dummyDiv.style.position = 'absolute';
        dummyDiv.style.width = `${textarea.clientWidth}px`;
        dummyDiv.style.fontSize = getComputedStyle(textarea).fontSize;
        dummyDiv.style.fontFamily = getComputedStyle(textarea).fontFamily;
        dummyDiv.style.lineHeight = getComputedStyle(textarea).lineHeight;
        dummyDiv.style.whiteSpace = 'pre-wrap';
        dummyDiv.style.wordBreak = 'break-word';
        dummyDiv.style.visibility = 'hidden';
        dummyDiv.textContent = textBeforeCursor;
        
        document.body.appendChild(dummyDiv);
        const rect = textarea.getBoundingClientRect();
        const textRect = dummyDiv.getBoundingClientRect();
        document.body.removeChild(dummyDiv);
        
        // Get the line height and compute the approximate position
        let lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
        if (isNaN(lineHeight)) lineHeight = parseInt(getComputedStyle(textarea).fontSize) * 1.2;
        
        const lines = textBeforeCursor.split('\n').length;
        const top = rect.top + lines * lineHeight;
        const left = rect.left + 20; // Adjust as needed

        setTriggerPosition({ top, left });
      }
    } else {
      setShowSuggestions(false);
    }
  }, [value, cursorPosition]);

  // Handle cursor position change
  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
      setCursorPosition(e.currentTarget.selectionStart);
    }
  };

  // Handle textarea change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  // Handle selection of a suggestion
  const handleSelectSuggestion = (item: Content) => {
    if (!cursorPosition) return;

    const textBeforeCursor = value.substring(0, cursorPosition);
    const textAfterCursor = value.substring(cursorPosition);
    
    // Find the start of the '[[' sequence
    const lastOpenBracketIndex = textBeforeCursor.lastIndexOf('[[');
    
    if (lastOpenBracketIndex !== -1) {
      // Replace everything from '[[' to cursor with the suggestion
      const newText = 
        textBeforeCursor.substring(0, lastOpenBracketIndex) + 
        `[[${item.title}]]` + 
        textAfterCursor;
      
      onChange(newText);
      setShowSuggestions(false);
      
      toast.success(`Linked to "${item.title}"`);
      
      // Set focus back to textarea
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPos = lastOpenBracketIndex + item.title.length + 4; // +4 for [[ and ]]
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 10);
    }
  };

  // Filter suggestions based on search term
  const filteredSuggestions = allItems
    .filter(item => 
      !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 5); // Limit to 5 suggestions

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        placeholder="Enter your content. You can link to other items using [[title of item]]"
        value={value}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        onClick={() => setCursorPosition(textareaRef.current?.selectionStart || null)}
        rows={5}
        className="resize-none"
      />

      {showSuggestions && (
        <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
          <PopoverTrigger asChild>
            <button 
              ref={buttonRef} 
              style={{ 
                position: 'absolute',
                opacity: 0,
                top: 0,
                left: 0
              }}
            />
          </PopoverTrigger>
          <PopoverContent 
            className="w-64 p-0" 
            align="start"
            sideOffset={5}
          >
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="size-4 animate-spin mr-2" />
                <span>Loading suggestions...</span>
              </div>
            ) : filteredSuggestions.length > 0 ? (
              <div className="py-1">
                {filteredSuggestions.map(item => (
                  <button
                    key={item.id}
                    className="w-full text-left px-3 py-2 hover:bg-muted/50 focus:bg-muted/50 outline-none"
                    onClick={() => handleSelectSuggestion(item)}
                  >
                    <div className="font-medium truncate">{item.title}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {item.content.substring(0, 40)}
                      {item.content.length > 40 ? '...' : ''}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-3 text-sm text-muted-foreground">
                No matches found for "{searchTerm}"
              </div>
            )}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default ContentTextarea;
