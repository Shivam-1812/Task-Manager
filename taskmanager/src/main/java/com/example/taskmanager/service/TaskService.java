package com.example.taskmanager.service;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TaskService {
    private final TaskRepository repo;
    public TaskService(TaskRepository repo) { this.repo = repo; }

    public Task create(Task t) { return repo.save(t); }
    public List<Task> getAll() { return repo.findAll(); }
    public Task getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Task not found: " + id));
    }
    public Task update(Long id, Task t) {
        Task existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id " + id));

        existing.setTitle(t.getTitle());
        existing.setDescription(t.getDescription());
        existing.setDueDate(t.getDueDate());
        existing.setPriority(t.getPriority());
        existing.setCompleted(t.isCompleted());

        return repo.save(existing);
    }
    public void delete(Long id) { repo.deleteById(id); }
    public Task markComplete(Long id, boolean complete) {
        Task t = getById(id); t.setCompleted(complete); return repo.save(t);
    }
    public List<Task> getByCompleted(boolean completed) { return repo.findByCompleted(completed); }
}