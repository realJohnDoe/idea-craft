import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileDown, FileUp, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Item } from "@/lib/content-utils";
import ImportMarkdown from "./ImportMarkdown";
import ExportMarkdown from "./ExportMarkdown";

interface NavbarProps {
  onSearch: (query: string) => void;
  onCreateNew: () => void;
  items: Item[];
  onImport: (importedItems: Item[]) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onSearch,
  onCreateNew,
  items,
  onImport,
}) => {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-4 flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-note to-mail">
              IdeaCraft
            </span>
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative w-40 md:w-64">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-full bg-muted pl-9 focus-visible:ring-offset-0"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          <ExportMarkdown items={items} id="export-button" />
          <ImportMarkdown onImport={onImport} id="import-button" />

          <Button
            onClick={onCreateNew}
            size="sm"
            className="w-10 h-10 md:w-auto rounded-full bg-gradient-to-r from-note to-mail hover:opacity-90"
          >
            <Plus />
            <span className="ms-1 hidden md:inline">Create</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
