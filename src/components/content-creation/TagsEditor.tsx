import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tag } from 'lucide-react';

interface TagsEditorProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

const TagsEditor: React.FC<TagsEditorProps> = ({ tags, setTags }) => {
  // Local state for raw input value
  const [inputValue, setInputValue] = useState(tags.join(', '));

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); // Update local input value
  };

  // Commit changes to tags on blur or Enter key press
  const commitTags = () => {
    const tagsArray = inputValue.split(',').map(tag => tag.trim()).filter(tag => tag);
    setTags(tagsArray); // Update parent state
    setInputValue(tagsArray.join(', ')); // Sync local state with cleaned-up tags
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="tags" className="text-sm flex items-center gap-2">
        <Tag className="h-4 w-4" />
        Tags (comma separated)
      </Label>
      <Input
        id="tags"
        placeholder="important, work, personal"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={commitTags} // Commit tags when input loses focus
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commitTags(); // Commit tags when Enter is pressed
          }
        }}
      />
    </div>
  );
};

export default TagsEditor;
