import ColoredIdeaCraftChip from "../ColoredIdeaCraftChip";

interface TypeFilterProps {
  activeFilter: string;
  toggleTypeTag: (type: string) => void;
}

const TypeFilter = ({ activeFilter, toggleTypeTag }: TypeFilterProps) => {
  const types = ["note", "task", "event", "mail"];

  return (
    <div className="mb-4">
      <div className="text-sm text-muted-foreground mb-2">Filter by type:</div>
      <div className="flex flex-wrap gap-1">
        {types.map((type) => (
          <ColoredIdeaCraftChip
            key={type}
            type={type}
            toggled={activeFilter === type}
            onClick={() => toggleTypeTag(type)}
          />
        ))}
      </div>
    </div>
  );
};

export default TypeFilter;
