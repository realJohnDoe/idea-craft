import React from "react";
import { Button } from "@/components/ui/button";
import { X, CheckCircle } from "lucide-react";

interface EditActionsProps {
  onCancel: () => void;
  onSave: () => void;
  cancelText?: string;
  saveText?: string;
  className?: string;
}

const EditActions: React.FC<EditActionsProps> = ({
  onCancel,
  onSave,
  cancelText = "Cancel",
  saveText = "Save",
  className = "flex justify-end space-x-2",
}) => {
  return (
    <div className={className}>
      <Button
        variant="outline"
        size="sm"
        onClick={onCancel}
        className="text-red-600"
      >
        <X className="h-4 w-4 mr-1" />
        {cancelText}
      </Button>
      <Button variant="default" size="sm" onClick={onSave}>
        <CheckCircle className="h-4 w-4 mr-1" />
        {saveText}
      </Button>
    </div>
  );
};

export default EditActions;
