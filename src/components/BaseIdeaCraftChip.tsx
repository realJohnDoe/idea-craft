
import React from "react";
import { cn } from "@/lib/utils";

interface BaseIdeaCraftChipProps {
  label: string;
  className?: string;
  suffixIcon?: React.ReactNode;
  type?: "task" | "event" | "mail" | "note" | "tag";
  onClick: () => void;
}

const BaseIdeaCraftChip: React.FC<BaseIdeaCraftChipProps> = ({
  label,
  className,
  suffixIcon,
  type,
  onClick,
}) => {
  // Determine border styles based on type
  const getBorderStyle = () => {
    // If it's a tag or non-specific type, add a border
    if (!type || type === "tag") {
      return "border border-muted-foreground/20";
    }
    return "";
  };

  return (
    <div
      className={cn(
        "flex items-center h-5 px-2 rounded-full text-xs font-medium hover:bg-opacity-90 cursor-pointer",
        getBorderStyle(),
        className
      )}
      onClick={onClick}
    >
      <span>{label}</span>
      {suffixIcon && <span className="ml-1">{suffixIcon}</span>}
    </div>
  );
};

export default BaseIdeaCraftChip;
