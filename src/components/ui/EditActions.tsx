import React from "react";
import { Button } from "@/components/ui/button";
import { X, CheckCircle, Check } from "lucide-react";

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
        className="text-red"
      >
        <X/>
        {cancelText}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onSave}
        className="text-one-dark-green"
      >
        <Check/>
        {saveText}
      </Button>
    </div>
  );
};

export default EditActions;
