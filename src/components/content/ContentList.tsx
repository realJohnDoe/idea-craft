import { Content } from "@/lib/content-utils";
import ContentItem from "@/components/content-item";

interface ContentListProps {
  items: Content[];
  onUpdate: (updatedItem: Content) => void;
  allItems: Content[];
}

const ContentList = ({ items, onUpdate, allItems }: ContentListProps) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
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
