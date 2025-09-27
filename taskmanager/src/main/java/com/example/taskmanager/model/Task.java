package com.example.taskmanager.model;

import jakarta.persistence.*;
import jakarta.persistence.GenerationType;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Entity
@Table(name = "tasks")
public class Task {
    public enum Priority { LOW, MEDIUM, HIGH }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.MEDIUM;

    private boolean completed = false;

    // constructors
    public Task() {}
    public Task(String title, String description, LocalDate dueDate, Priority priority) {
        this.title = title; this.description = description;
        this.dueDate = dueDate; this.priority = priority;
    }

    // getters & setters
    public Long getId() {return id; }
    public void setId(Long id) {this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
}
