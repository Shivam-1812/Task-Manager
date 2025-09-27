export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  completed?: boolean;
}