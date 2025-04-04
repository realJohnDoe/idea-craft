
import React from "react";

interface BaseIdeaCraftChipProps {
  label: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const BaseIdeaCraftChip: React.FC<BaseIdeaCraftChipProps> = ({
  label,
  prefixIcon,
  suffixIcon,
  className = "",
  style = {},
  onClick,
}) => {
  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs select-none ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={onClick}
      style={style}
    >
      {prefixIcon && <span className="mr-1">{prefixIcon}</span>}
      {label}
      {suffixIcon && <span className="ml-1">{suffixIcon}</span>}
    </div>
  );
};

export default BaseIdeaCraftChip;
