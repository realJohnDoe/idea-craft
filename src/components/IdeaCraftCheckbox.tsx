import React from "react";

import { Checkbox } from "@/components/ui/checkbox";

interface IdeaCraftCheckboxProps {
  checked: boolean;
  onToggle: (arg0: boolean) => void;
}

const IdeaCraftCheckbox: React.FC<IdeaCraftCheckboxProps> = ({
  checked,
  onToggle,
}) => (
  <Checkbox
    checked={checked}
    onCheckedChange={onToggle}
    className="mr-2 data-[state=checked]:bg-task data-[state=checked]:text-white border-task"
  />
);

export default IdeaCraftCheckbox;
