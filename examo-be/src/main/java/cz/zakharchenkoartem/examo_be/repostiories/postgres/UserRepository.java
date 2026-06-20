package cz.zakharchenkoartem.examo_be.repostiories.postgres;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import cz.zakharchenkoartem.examo_be.models.entities.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email); 
}
