package com.ProjectSync.backend.appuser;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor // Lombok annotation to generate a constructor for final fields (for dependency injection)
@RequestMapping(path = "api/v1/users")
public class AppUserController {
    private final AppUserRepository appUserRepository; // Using final for @RequiredArgsConstructor

    @GetMapping(path = "{id}")
    public ResponseEntity<AppUser> getUserById(@PathVariable Long id) {
        return appUserRepository.findById(id)
                .map(user -> ResponseEntity.ok(user)) // If user is found, return 200 OK with the user
                .orElseGet(() -> ResponseEntity.notFound().build()); // If not found, return 404 Not Found
    }
}
