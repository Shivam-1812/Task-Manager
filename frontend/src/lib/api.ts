import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types/task';

const API_BASE_URL = 'http://localhost:8080/api/tasks';

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new ApiError(`API Error: ${response.statusText}`, response.status);
  }
  return response.json();
}

export const taskApi = {
  // Get all tasks
  getTasks: async (): Promise<Task[]> => {
    const response = await fetch(API_BASE_URL);
    return handleResponse<Task[]>(response);
  },

  // Get task by ID
  getTask: async (id: string): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    return handleResponse<Task>(response);
  },

  // Create new task
  createTask: async (task: CreateTaskRequest): Promise<Task> => {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    return handleResponse<Task>(response);
  },

  // Update task
  updateTask: async (id: string, updates: UpdateTaskRequest): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    return handleResponse<Task>(response);
  },

  // Toggle task completion
  toggleTask: async (id: string, completed: boolean): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/${id}/complete?value=${completed}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    });
    return handleResponse<Task>(response);
  },

  // Delete task
  deleteTask: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new ApiError(`Delete failed: ${response.statusText}`, response.status);
    }
  },
};