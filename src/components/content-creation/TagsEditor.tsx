
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tag } from 'lucide-react';

interface TagsEditorProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

const TagsEditor: React.FC<TagsEditorProps> = ({
  tags,
  setTags
}) => {
  // Convert array to comma-separated string for display in input
  const tagsString = tags.join(', ');
  
  // Handle tags input change
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsInput = e.target.value;
    // Convert comma-separated string to array
    const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    setTags(tagsArray);
  };

  return (
    <div className="p-3 border border-gray-300 rounded-md bg-gray-50/50 space-y-2">
      <Label htmlFor="tags" className="text-sm flex items-center gap-2">
        <Tag className="h-4 w-4" />
        Tags (comma separated)
      </Label>
      <Input
        id="tags"
        placeholder="important, work, personal"
        value={tagsString}
        onChange={handleTagsChange}
      />
    </div>
  );
};

export default TagsEditor;
