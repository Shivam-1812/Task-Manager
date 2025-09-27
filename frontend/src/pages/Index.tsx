import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, CheckCircle2, Circle, Filter, Search } from 'lucide-react';
import { Task, CreateTaskRequest, TaskPriority } from '@/types/task';
import { taskApi } from '@/lib/api';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'pending' | 'completed';
type SortType = 'dueDate' | 'priority' | 'created';

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('dueDate');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tasks
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskApi.getTasks,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: taskApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setShowForm(false);
      toast({
        title: 'Task created',
        description: 'Your new task has been added successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create task. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateTaskRequest }) =>
      taskApi.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setEditingTask(null);
      toast({
        title: 'Task updated',
        description: 'Your changes have been saved.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update task. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Toggle task completion
  const toggleTaskMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      taskApi.toggleTask(id, completed),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: updatedTask.completed ? 'Task completed' : 'Task reopened',
        description: updatedTask.completed 
          ? 'Great job finishing this task!' 
          : 'Task moved back to pending.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update task status.',
        variant: 'destructive',
      });
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: taskApi.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setDeleteTask(null);
      toast({
        title: 'Task deleted',
        description: 'The task has been removed from your list.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete task. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Filter and sort tasks
  const filteredAndSortedTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === 'all' || 
                           (filter === 'completed' && task.completed) ||
                           (filter === 'pending' && !task.completed);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const handleCreateTask = (data: CreateTaskRequest) => {
    createTaskMutation.mutate(data);
  };

  const handleUpdateTask = (data: CreateTaskRequest) => {
    if (editingTask) {
      updateTaskMutation.mutate({ id: editingTask.id, data });
    }
  };

  const handleDeleteTask = () => {
    if (deleteTask) {
      deleteTaskMutation.mutate(deleteTask.id);
    }
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    toggleTaskMutation.mutate({ id, completed });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-4 p-4 bg-destructive-light rounded-lg">
            <h2 className="text-lg font-semibold text-destructive mb-2">Connection Error</h2>
            <p className="text-destructive-foreground">
              Unable to connect to the task API. Please ensure the backend server is running on localhost:8080.
            </p>
          </div>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['tasks'] })}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Task Manager
              </h1>
              <p className="text-muted-foreground mt-1">
                Stay organized and get things done
              </p>
            </div>
            <Button 
              onClick={() => setShowForm(true)}
              size="lg"
              className="h-11 px-6 font-medium hover:scale-105 transition-transform"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Circle className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Tasks</p>
                <p className="text-2xl font-bold">{pendingTasks.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedTasks.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Filter className="h-8 w-8 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{tasks.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={filter} onValueChange={(value: FilterType) => setFilter(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(value: SortType) => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Task Form */}
        {(showForm || editingTask) && (
          <div className="mb-8">
            <TaskForm
              task={editingTask || undefined}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
              isLoading={createTaskMutation.isPending || updateTaskMutation.isPending}
            />
          </div>
        )}

        {/* Tasks Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-muted rounded mb-3"></div>
                <div className="h-3 bg-muted rounded mb-4 w-3/4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-muted rounded w-16"></div>
                  <div className="h-8 bg-muted rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Circle className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || filter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first task to get started'}
            </p>
            {!searchQuery && filter === 'all' && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={setEditingTask}
                onDelete={(id) => setDeleteTask(tasks.find(t => t.id === id) || null)}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deleteTask}
        onOpenChange={(open) => !open && setDeleteTask(null)}
        onConfirm={handleDeleteTask}
        taskTitle={deleteTask?.title || ''}
        isLoading={deleteTaskMutation.isPending}
      />
    </div>
  );
};

export default Index;
