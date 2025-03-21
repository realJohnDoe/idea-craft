import React, { useState } from "react";
import { Tag, Plus, X } from "lucide-react";
import { Content } from "@/lib/content-utils";
import BaseIdeaCraftChip from "../BaseIdeaCraftChip";

interface TagsFilterProps {
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  getAllTags: () => string[];
}

const TagsFilter = ({
  selectedTags,
  toggleTag,
  getAllTags,
}: TagsFilterProps) => {
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const handleAddNewTag = () => {
    if (newTagName.trim()) {
      toggleTag(newTagName.trim());
      setNewTagName("");
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
        {getAllTags().map((tag) => (
          <BaseIdeaCraftChip
            label={tag}
            className={
              selectedTags.includes(tag)
                ? "bg-red text-red-foreground hover:bg-red/80"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }
            suffixIcon={
              selectedTags.includes(tag) && (
                <X className="size-3" onClick={() => toggleTag(tag)} />
              )
            }
            onClick={() => toggleTag(tag)}
          />
          // <button
          //   key={tag}
          //   className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
          //     selectedTags.includes(tag)
          //       ? "bg-red text-primary-foreground"
          //       : "bg-muted text-muted-foreground hover:bg-muted/80"
          //   }`}
          //   onClick={() => toggleTag(tag)}
          // >
          //   {tag}
          //   {selectedTags.includes(tag) && <X className="size-3" />}
          // </button>
        ))}
      </div>
    </div>
  );
};

export default TagsFilter;
