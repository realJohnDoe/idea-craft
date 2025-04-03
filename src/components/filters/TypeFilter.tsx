import { ContentAttributeType } from "@/lib/content-utils";
import ColoredIdeaCraftChip from "../ColoredIdeaCraftChip";

interface TypeFilterProps {
  activeFilter: string;
  toggleTypeTag: (type: string) => void;
}

const TypeFilter = ({ activeFilter, toggleTypeTag }: TypeFilterProps) => {
  const types: ContentAttributeType[] = ["note", "task", "event", "mail"];

  let toggled = {};
  if (activeFilter !== "") {
    toggled = {
      note: false,
      task: false,
      event: false,
      mail: false,
    };
    toggled[activeFilter] = true;
  } else {
    toggled = {
      note: true,
      task: true,
      event: true,
      mail: true,
    };
  }
  return (
    <div className="mb-4">
      <div className="text-sm text-muted-foreground mb-2">Filter by type:</div>
      <div className="flex flex-wrap gap-1">
        {types.map((type) => (
          <ColoredIdeaCraftChip
            key={type}
            type={type}
            toggled={toggled[type]}
            onClick={() => toggleTypeTag(type)}
          />
        ))}
      </div>
    </div>
  );
};

export default TypeFilter;
