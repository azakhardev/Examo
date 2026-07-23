package cz.zakharchenkoartem.examo_be.services;

import cz.zakharchenkoartem.examo_be.exceptions.InvalidCredentialsException;
import cz.zakharchenkoartem.examo_be.exceptions.ResourceAlreadyExistsException;
import cz.zakharchenkoartem.examo_be.models.dtos.auth.AuthResponse;
import cz.zakharchenkoartem.examo_be.models.dtos.auth.AuthUser;
import cz.zakharchenkoartem.examo_be.models.entities.User;
import cz.zakharchenkoartem.examo_be.repostiories.postgres.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserService userService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService,
            UserService userService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userService = userService;
    }

    public AuthResponse login(String email, String rawPassword) {
        User user = userService.getUser(email);

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(token, new AuthUser(user.getId(), user.getUsername(), user.getEmail()));
    }

    public String register(User request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            throw new ResourceAlreadyExistsException("User with this email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setName(request.getName());
        user.setSurname(request.getSurname());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        return jwtService.generateToken(user);
    }

    public AuthResponse me(String token) {
        Integer userId;

        try {
            userId = jwtService.extractUserId(token);
        } catch (Exception e) {
            throw new InvalidCredentialsException("Invalid or expired token");
        }

        User user = userService.getUser(userId);

        if (!jwtService.isTokenValid(token, user.getEmail())) {
            throw new InvalidCredentialsException("Invalid or expired token");
        }

        return new AuthResponse(token, new AuthUser(user.getId(), user.getUsername(), user.getEmail()));
    }
}