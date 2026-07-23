package cz.zakharchenkoartem.examo_be.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import cz.zakharchenkoartem.examo_be.models.dtos.tests.TestDTO;
import cz.zakharchenkoartem.examo_be.models.entities.Test;
import cz.zakharchenkoartem.examo_be.services.TestService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/tests")
public class TestController {
    private final TestService testService;

    public TestController(TestService testService) {
        this.testService = testService;
    }

    @GetMapping("/student")
    public ResponseEntity<List<TestDTO>> getForeignTests(Principal principal,
            @RequestParam(required = false) String type) {
        // returns upcoming or historical
        Integer userId = Integer.valueOf(principal.getName());

        List<TestDTO> tests = testService.getForeignTests(userId, type);

        return ResponseEntity.ok(tests);
    }

    @GetMapping("/student/{id}")
    public ResponseEntity<TestDTO> getForeignTestDetail(Principal principal,
            @PathVariable Long id) {
        Integer userId = Integer.valueOf(principal.getName());

        TestDTO test = testService.getForeignTestDetail(userId, id);

        return ResponseEntity.ok(test);
    }

    // @GetMapping("/{id}/submitted")
    // public ResponseEntity<Test> getSubmittedTestDetail(Principal principal,
    // @PathVariable Integer id) {
    // Integer userId = Integer.valueOf(principal.getName());

    // // Check if user is accessing its own result, if not, reject

    // // Return test submission document
    // return ResponseEntity.ok(null);
    // }
}
