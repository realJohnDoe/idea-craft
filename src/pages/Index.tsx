
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { ThemeSelectorContainer } from "@/components/ThemeSelectorContainer";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Additional search logic can be implemented here
  };
  
  const handleCreateNew = () => {
    // Handle create new functionality
    console.log("Create new item clicked");
  };

  return (
    <div className="min-h-screen">
      <Navbar 
        activeFilter={activeFilter} 
        onSearch={handleSearch} 
        onCreateNew={handleCreateNew} 
      />
      <ThemeSelectorContainer />
      <div className="container mx-auto py-8">
        {/* Page content */}
      </div>
    </div>
  );
}
