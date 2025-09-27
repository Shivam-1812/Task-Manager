import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, CalendarIcon } from 'lucide-react';
import { Task, CreateTaskRequest, TaskPriority } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: CreateTaskRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TaskForm({ task, onSubmit, onCancel, isLoading }: TaskFormProps) {
  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: '',
    description: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    priority: 'MEDIUM',
  });
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
      });
      setDate(new Date(task.dueDate));
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setFormData(prev => ({
        ...prev,
        dueDate: format(selectedDate, 'yyyy-MM-dd')
      }));
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-lg scale-in">
      <h2 className="text-xl font-semibold mb-6 text-foreground">
        {task ? 'Edit Task' : 'Create New Task'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">
            Task Title
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter task title..."
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your task..."
            rows={3}
            className="resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-11",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: TaskPriority) => 
                setFormData(prev => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-info"></div>
                    Low Priority
                  </div>
                </SelectItem>
                <SelectItem value="MEDIUM">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-warning"></div>
                    Medium Priority
                  </div>
                </SelectItem>
                <SelectItem value="HIGH">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-destructive"></div>
                    High Priority
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isLoading || !formData.title.trim()}
            className="flex-1 h-11 font-medium hover:scale-[1.02] transition-transform"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
            ) : null}
            {task ? 'Update Task' : 'Create Task'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 h-11"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}