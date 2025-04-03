import React from "react";

interface IdeaCraftChipProps {
  prefixIcon?: React.ReactNode;
  label: string;
  suffixIcon?: React.ReactNode;
  className: string;
  onClick: () => void;
}

const BaseIdeaCraftChip: React.FC<IdeaCraftChipProps> = ({
  prefixIcon,
  label,
  suffixIcon,
  className,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-2 py-0.5 rounded ${className} transition-colors`}
    >
      {prefixIcon}
      <span className="text-xs">{label}</span>
      {suffixIcon}
    </button>
  );
};

export default BaseIdeaCraftChip;
