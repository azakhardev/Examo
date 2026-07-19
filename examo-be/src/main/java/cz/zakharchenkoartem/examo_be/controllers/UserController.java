package cz.zakharchenkoartem.examo_be.controllers;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import cz.zakharchenkoartem.examo_be.models.dtos.UpdateProfileBody;
import cz.zakharchenkoartem.examo_be.models.entities.User;
import cz.zakharchenkoartem.examo_be.services.UserService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@Controller
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getProfileInfo(Principal principal) {
        Integer userId = Integer.valueOf(principal.getName());

        User user = userService.getUser(userId);

        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile/update")
    public ResponseEntity<User> updateProfileInfo(Principal principal, @RequestBody UpdateProfileBody udpatedProfile) {
        Integer userId = Integer.valueOf(principal.getName());

        User user = userService.updateProfile(userId, udpatedProfile);

        return ResponseEntity.ok(user);
    }

    // @GetMapping("/{id}")
    // public ResponseEntity<User> getUser(@PathVariable Integer id) {
    // User user = userService.getUser(id);

    // return ResponseEntity.ok(user);
    // }

}
