package com.example.taskmanager.controller;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService service;
    public TaskController(TaskService service) { this.service = service; }

    @GetMapping
    public List<Task> all(@RequestParam(value="completed", required=false) Boolean completed) {
        if (completed == null) return service.getAll();
        return service.getByCompleted(completed);
    }

    @GetMapping("/{id}")
    public Task getOne(@PathVariable Long id) { return service.getById(id); }

    @PostMapping
    public ResponseEntity<Task> create(@Valid @RequestBody Task t) {
        Task created = service.create(t);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    public Task update(@PathVariable Long id, @Valid @RequestBody Task t) {
        return service.update(id, t);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/complete")
    public Task setComplete(@PathVariable Long id, @RequestParam boolean value) {
        return service.markComplete(id, value);
    }
}