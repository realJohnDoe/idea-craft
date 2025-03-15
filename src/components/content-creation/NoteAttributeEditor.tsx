
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface NoteAttributeEditorProps {
  noteTags: string[];
  setNoteTags: (tags: string[]) => void;
}

const NoteAttributeEditor: React.FC<NoteAttributeEditorProps> = ({
  noteTags,
  setNoteTags
}) => {
  // Convert array to comma-separated string for display in input
  const tagsString = noteTags.join(', ');
  
  // Handle tags input change
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsInput = e.target.value;
    // Convert comma-separated string to array
    const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    setNoteTags(tagsArray);
  };

  return (
    <div className="p-3 border border-note/30 rounded-md bg-note-light/10">
      <div className="space-y-2">
        <Label htmlFor="tags" className="text-sm">Tags (comma separated)</Label>
        <Input
          id="tags"
          placeholder="productivity, ideas, research"
          value={tagsString}
          onChange={handleTagsChange}
        />
      </div>
    </div>
  );
};

export default NoteAttributeEditor;
