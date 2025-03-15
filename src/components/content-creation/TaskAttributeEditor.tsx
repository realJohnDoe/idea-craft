
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TaskAttributeEditorProps {
  taskDone: boolean;
  setTaskDone: (value: boolean) => void;
  taskTags: string[];
  setTaskTags: (tags: string[]) => void;
}

const TaskAttributeEditor: React.FC<TaskAttributeEditorProps> = ({ 
  taskDone, 
  setTaskDone,
  taskTags,
  setTaskTags
}) => {
  // Convert array to comma-separated string for display in input
  const tagsString = taskTags.join(', ');
  
  // Handle tags input change
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsInput = e.target.value;
    // Convert comma-separated string to array
    const tagsArray = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    setTaskTags(tagsArray);
  };

  return (
    <div className="p-3 border border-task/30 rounded-md bg-task-light/10 space-y-3">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="task-done"
          checked={taskDone}
          onCheckedChange={(checked) => setTaskDone(checked === true)}
          className="text-task data-[state=checked]:bg-task data-[state=checked]:text-white border-task"
        />
        <Label htmlFor="task-done" className="text-sm">Mark as completed</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="task-tags" className="text-sm">Tags (comma separated)</Label>
        <Input
          id="task-tags"
          placeholder="urgent, work, personal"
          value={tagsString}
          onChange={handleTagsChange}
        />
      </div>
    </div>
  );
};

export default TaskAttributeEditor;
