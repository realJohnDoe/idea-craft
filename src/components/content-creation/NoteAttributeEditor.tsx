
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface NoteAttributeEditorProps {
  noteTags: string;
  setNoteTags: (tags: string) => void;
}

const NoteAttributeEditor: React.FC<NoteAttributeEditorProps> = ({
  noteTags,
  setNoteTags
}) => {
  return (
    <div className="p-3 border border-note/30 rounded-md bg-note-light/10">
      <div className="space-y-2">
        <Label htmlFor="tags" className="text-sm">Tags (comma separated)</Label>
        <Input
          id="tags"
          placeholder="productivity, ideas, research"
          value={noteTags}
          onChange={(e) => setNoteTags(e.target.value)}
        />
      </div>
    </div>
  );
};

export default NoteAttributeEditor;
