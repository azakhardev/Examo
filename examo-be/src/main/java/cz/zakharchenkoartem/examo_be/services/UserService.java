package cz.zakharchenkoartem.examo_be.services;

import org.springframework.stereotype.Service;

import cz.zakharchenkoartem.examo_be.exceptions.InvalidCredentialsException;
import cz.zakharchenkoartem.examo_be.models.entities.User;
import cz.zakharchenkoartem.examo_be.repostiories.postgres.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUser(Integer userId) {
        return userRepository.findById(userId).orElseThrow(() -> new InvalidCredentialsException("User not found"));
    }

    public User getUser(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new InvalidCredentialsException("User not found"));
    }

}
