
import React, { useState } from 'react';
import { Tag, Plus, X } from 'lucide-react';
import { Content } from '@/lib/content-utils';

interface TagsFilterProps {
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  getAllTags: () => string[];
}

const TagsFilter = ({ selectedTags, toggleTag, getAllTags }: TagsFilterProps) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const handleAddNewTag = () => {
    if (newTagName.trim()) {
      toggleTag(newTagName.trim());
      setNewTagName('');
      setIsAddingTag(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="text-sm text-muted-foreground mb-2 flex items-center">
        <Tag className="size-3 mr-1" />
        Tags filter:
      </div>
      <div className="flex flex-wrap gap-1">
        {getAllTags().map(tag => (
          <button
            key={tag}
            className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
              selectedTags.includes(tag)
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
            onClick={() => toggleTag(tag)}
          >
            {tag}
            {selectedTags.includes(tag) && <X className="size-3" />}
          </button>
        ))}
        
        {isAddingTag ? (
          <div className="flex items-center">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="New tag..."
              className="text-xs rounded-l-full py-1 px-2 bg-muted border-0 focus:ring-0"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddNewTag();
                } else if (e.key === 'Escape') {
                  setIsAddingTag(false);
                  setNewTagName('');
                }
              }}
              autoFocus
            />
            <button
              className="bg-primary text-primary-foreground rounded-r-full text-xs py-1 px-2"
              onClick={handleAddNewTag}
            >
              Add
            </button>
            <button
              className="bg-muted text-muted-foreground rounded-full ml-1 p-1"
              onClick={() => {
                setIsAddingTag(false);
                setNewTagName('');
              }}
            >
              <X className="size-3" />
            </button>
          </div>
        ) : (
          <button
            className="text-xs px-2 py-1 rounded-full flex items-center gap-1 bg-muted text-muted-foreground hover:bg-muted/80"
            onClick={() => setIsAddingTag(true)}
          >
            <Plus className="size-3" />
            Add tag
          </button>
        )}
      </div>
    </div>
  );
};

export default TagsFilter;
