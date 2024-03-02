package com.ProjectSync.backend.appuser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping(path="api/v1/users")
public class AppUserController {
    @Autowired
    private AppUserRepository appUserRepository;
    @GetMapping(path="{id}")
    public Optional<AppUser> getUserById(@PathVariable Long id){
        return appUserRepository.findById(id);
    }

}
