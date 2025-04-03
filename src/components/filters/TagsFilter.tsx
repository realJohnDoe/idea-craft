import { Tag, X } from "lucide-react";
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
  return (
    <div className="mb-4">
      <div className="text-sm text-muted-foreground mb-2 flex items-center">
        <Tag className="size-3 mr-1" />
        Tags filter:
      </div>
      <div className="flex flex-wrap gap-1">
        {getAllTags().map((tag) => (
          <BaseIdeaCraftChip
            key={tag}
            label={tag}
            className={
              selectedTags.includes(tag)
                ? "bg-red text-red-foreground hover:bg-red/80"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }
            onClick={() => toggleTag(tag)}
          />
        ))}
      </div>
    </div>
  );
};

export default TagsFilter;
