import { Item } from "@/lib/content-utils";
import ContentItem from "@/components/content-item";

interface ContentListProps {
  items: Item[];
  onUpdate: (updatedItem: Item) => void;
  allItems: Item[];
}

const ContentList = ({ items, onUpdate, allItems }: ContentListProps) => {
  return (
    <div>
      {items.map((item) => (
        <ContentItem
          key={item.id}
          item={item}
          onUpdate={onUpdate}
          allItems={allItems}
        />
      ))}
    </div>
  );
};

export default ContentList;
