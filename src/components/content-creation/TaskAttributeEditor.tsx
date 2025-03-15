
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface TaskAttributeEditorProps {
  taskDone: boolean;
  setTaskDone: (value: boolean) => void;
}

const TaskAttributeEditor: React.FC<TaskAttributeEditorProps> = ({ 
  taskDone, 
  setTaskDone 
}) => {
  return (
    <div className="p-3 border border-task/30 rounded-md bg-task-light/10">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="task-done"
          checked={taskDone}
          onCheckedChange={(checked) => setTaskDone(checked === true)}
          className="text-task data-[state=checked]:bg-task data-[state=checked]:text-white border-task"
        />
        <Label htmlFor="task-done" className="text-sm">Mark as completed</Label>
      </div>
    </div>
  );
};

export default TaskAttributeEditor;
