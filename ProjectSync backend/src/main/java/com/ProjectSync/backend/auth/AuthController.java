package com.ProjectSync.backend.auth;

import com.ProjectSync.backend.appuser.AppUser;
import com.ProjectSync.backend.appuser.AppUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AppUserService appUserService;

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetails userDetails = appUserService.loadUserByUsername(loginRequest.getEmail());

            // Fetch the user by email to get the correct email address
            AppUser appUser = (AppUser) appUserService.loadUserByUsername(loginRequest.getEmail());

            // Generate token with additional claims (firstName and lastName)
            String jwt = jwtUtil.generateToken(appUser);


            return ResponseEntity.ok(new LoginResponse(jwt));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Authentication failed");
        }
    }
}
