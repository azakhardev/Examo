package cz.zakharchenkoartem.examo_be.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/login")
    public Map<String, String> sayHello() {        
        return Map.of(
            "status", "OK",
            "message", "Backend works"
        );
    }
}