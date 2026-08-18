package cz.zakharchenkoartem.examo_be.services;

import cz.zakharchenkoartem.examo_be.exceptions.InvalidCredentialsException;
import cz.zakharchenkoartem.examo_be.exceptions.ResourceAlreadyExistsException;
import cz.zakharchenkoartem.examo_be.models.dtos.auth.AuthResponse;
import cz.zakharchenkoartem.examo_be.models.dtos.auth.AuthUser;
import cz.zakharchenkoartem.examo_be.models.entities.User;
import cz.zakharchenkoartem.examo_be.repostiories.postgres.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import java.util.Collections;
import java.util.Optional;

@Service
public class AuthService {

    // TODO: Add to env
    private static final String GOOGLE_CLIENT_ID = "XXXXXXX.apps.googleusercontent.com";

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

    public AuthResponse verifyGoogleTokenAndLogin(String idTokenString) {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
                .build();

        // Verify the token signature with Google
        GoogleIdToken idToken;
        try {
            idToken = verifier.verify(idTokenString);
        } catch (Exception e) {
            throw new InvalidCredentialsException("Failed to verify Google ID token: " + e.getMessage());
        }

        if (idToken == null) {
            throw new InvalidCredentialsException("Invalid or expired Google ID token.");
        }

        // Extract user data from the verified token
        GoogleIdToken.Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        String googleUserId = payload.getSubject();
        String name = (String) payload.get("given_name");
        String surname = (String) payload.get("family_name");

        // Check if the user exists in db, if not save it
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setSurname(surname);
            newUser.setAuthProvider("GOOGLE");
            newUser.setGoogleId(googleUserId);
            newUser.setUsername(email.split("@")[0]);

            return userRepository.save(newUser);
        });

        String jwtToken = jwtService.generateToken(user);

        return new AuthResponse(jwtToken, new AuthUser(user.getId(), user.getUsername(), user.getEmail()));
    }
}