import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, Edit, Trash2, Check, X } from 'lucide-react';
import { Task, TaskPriority } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  LOW: { label: 'Low', className: 'priority-low' },
  MEDIUM: { label: 'Medium', className: 'priority-medium' },
  HIGH: { label: 'High', className: 'priority-high' },
};

export function TaskCard({ task, onEdit, onDelete, onToggleComplete }: TaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  
  const priority = priorityConfig[task.priority];
  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
  const dueDate = format(new Date(task.dueDate), 'MMM d, yyyy');

  const handleToggleComplete = async () => {
    setIsCompleting(true);
    try {
      await onToggleComplete(task.id, !task.completed);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div
      className={cn(
        'task-card fade-in',
        task.completed && 'task-card-completed'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              'text-lg font-semibold mb-2 transition-all',
              task.completed && 'line-through text-muted-foreground'
            )}
          >
            {task.title}
          </h3>
          <p
            className={cn(
              'text-muted-foreground text-sm leading-relaxed',
              task.completed && 'line-through'
            )}
          >
            {task.description}
          </p>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(task)}
            className="h-8 w-8 p-0 hover:bg-primary/10"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(task.id)}
            className="h-8 w-8 p-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge
            variant="secondary"
            className={cn('text-xs font-medium border', priority.className)}
          >
            {priority.label}
          </Badge>
          
          <div
            className={cn(
              'flex items-center gap-1 text-xs',
              isOverdue 
                ? 'text-destructive font-medium' 
                : 'text-muted-foreground'
            )}
          >
            <Calendar className="h-3 w-3" />
            <span>{dueDate}</span>
            {isOverdue && <Clock className="h-3 w-3 ml-1" />}
          </div>
        </div>

        <Button
          size="sm"
          variant={task.completed ? "secondary" : "default"}
          onClick={handleToggleComplete}
          disabled={isCompleting}
          className={cn(
            'h-8 px-3 transition-all',
            task.completed
              ? 'bg-success text-success-foreground hover:bg-success/90'
              : 'hover:scale-105'
          )}
        >
          {isCompleting ? (
            <div className="animate-spin rounded-full h-3 w-3 border-2 border-current border-t-transparent" />
          ) : task.completed ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              Done
            </>
          ) : (
            <>
              <Check className="h-3 w-3 mr-1" />
              Complete
            </>
          )}
        </Button>
      </div>
    </div>
  );
}