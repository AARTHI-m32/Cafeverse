package com.cafeverse.service;

import com.cafeverse.dto.request.LoginRequest;
import com.cafeverse.dto.request.SignupRequest;
import com.cafeverse.dto.response.JwtResponse;
import com.cafeverse.dto.response.MessageResponse;
import com.cafeverse.model.Role;
import com.cafeverse.model.User;
import com.cafeverse.repository.UserRepository;
import com.cafeverse.security.CustomUserDetails;
import com.cafeverse.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final EmailService emailService;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        log.info("User authenticated successfully: {}", loginRequest.getEmail());

        return JwtResponse.builder()
                .token(jwt)
                .id(userDetails.getId())
                .name(userDetails.getName())
                .email(userDetails.getEmail())
                .role(userDetails.getAuthorities().iterator().next().getAuthority())
                .build();
    }

    public MessageResponse registerUser(SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        Role userRole = signUpRequest.getRole() != null ? signUpRequest.getRole() : Role.ROLE_CUSTOMER;

        User user = User.builder()
                .name(signUpRequest.getName())
                .email(signUpRequest.getEmail())
                .password(passwordEncoder.encode(signUpRequest.getPassword()))
                .phone(signUpRequest.getPhone())
                .role(userRole)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        log.info("User registered successfully: {}", signUpRequest.getEmail());

        // Send Welcome Email
        String subject = "Welcome to CafeVerse!";
        String body = "Dear " + user.getName() + ",\n\nThank you for registering at CafeVerse! We are excited to have you.";
        emailService.sendEmail(user.getEmail(), subject, body);

        return new MessageResponse("User registered successfully!");
    }
}
