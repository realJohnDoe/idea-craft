import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface ContentHeaderProps {
  title_in: string;
  onUpdate: (new_title: string) => void;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({
  title_in,
  onUpdate,
}) => {
  const [title, setTitle] = useState(title_in);

  useEffect(() => {
    setTitle(title_in);
  }, [title_in]);

  const handleBlur = () => {
    if (title !== title_in) {
      onUpdate(title);
    }
  };

  return (
    <div className="pb-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleBlur}
        className=""
      />
    </div>
  );
};

export default ContentHeader;
