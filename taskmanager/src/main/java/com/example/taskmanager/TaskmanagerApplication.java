package com.example.taskmanager;

import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.Task.Priority;
import com.example.taskmanager.repository.TaskRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;

@SpringBootApplication
public class TaskmanagerApplication {

	public static void main(String[] args) {
		SpringApplication.run(TaskmanagerApplication.class, args);
	}

	@Bean
	CommandLineRunner init(TaskRepository repo) {
		return args -> {
			repo.save(new Task("Buy Cloths", "T-shirt, Jeans", LocalDate.of(2025, 9, 26), Task.Priority.LOW));
			repo.save(new Task("Buy groceries", "Milk, eggs, rice", LocalDate.of(2025, 10, 1), Task.Priority.MEDIUM));
			repo.save(new Task("Finish homework", "Math and Science", LocalDate.of(2025, 10, 2), Task.Priority.HIGH));
		};
	}
}
