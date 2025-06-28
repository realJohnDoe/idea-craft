import React from "react";
// Temporarily commented out to test if lucide-react is causing the issue
// import { Pencil } from "lucide-react";
import { Button } from "./button";

interface AttributeEditorProps {
  label: string;
  value: string;
  isEditing: boolean;
  onEdit: () => void;
  children?: React.ReactNode;
}

const AttributeEditor: React.FC<AttributeEditorProps> = ({
  label,
  value,
  isEditing,
  onEdit,
  children,
}) => {
  return (
    <div className="flex items-center text-sm">
      {!isEditing ? (
        <div
          className="flex items-center group cursor-pointer"
          onClick={onEdit}
        >
          <span>{value}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 ml-1 opacity-50 transition-opacity hover:opacity-70"
          >
            {/* Temporarily commented out Pencil icon */}
            <span>Edit</span>
            <span className="sr-only">Edit</span>
          </Button>
        </div>
      ) : (
        <>{children}</>
      )}
    </div>
  );
};

export default AttributeEditor;
