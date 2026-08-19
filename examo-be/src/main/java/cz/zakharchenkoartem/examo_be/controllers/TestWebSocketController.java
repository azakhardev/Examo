package cz.zakharchenkoartem.examo_be.controllers;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import cz.zakharchenkoartem.examo_be.models.dtos.tests.ParticipantProgress;
import cz.zakharchenkoartem.examo_be.models.dtos.tests.ProgressPayload;
import cz.zakharchenkoartem.examo_be.models.dtos.tests.ProgressUserDto;
import cz.zakharchenkoartem.examo_be.models.entities.User;
import cz.zakharchenkoartem.examo_be.services.UserService;

@Controller
public class TestWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;

    public TestWebSocketController(
            SimpMessagingTemplate messagingTemplate,
            UserService userService) {
        this.messagingTemplate = messagingTemplate;
        this.userService = userService;
    }

    // Student sends progress here: /app/tests/{testId}/progress
    @MessageMapping("/tests/{testId}/progress")
    public void handleStudentProgress(
            Principal principal,
            @DestinationVariable Long testId,
            @Payload ProgressPayload incomingPayload) {

        Integer userId = Integer.valueOf(principal.getName());

        User user = userService.getUser(userId);

        ProgressUserDto safeUserDto = new ProgressUserDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getName(),
                user.getSurname());

        // Construct the final payload for the teacher
        ParticipantProgress teacherPayload = new ParticipantProgress();
        teacherPayload.setUser(safeUserDto);
        teacherPayload.setAnswers(incomingPayload.answers());
        teacherPayload.setTotalQuestions(incomingPayload.totalQuestions());

        // Broadcast to the teacher's topic
        String destination = "/topic/tests/" + testId + "/progress";
        messagingTemplate.convertAndSend(destination, teacherPayload);
    }

    // Alternative:
    // @MessageMapping("/tests/{testId}/progress")
    // @SendTo("/topic/tests/{testId}/progress")
    // public ParticipantProgress handleStudentProgress(@Payload ParticipantProgress
    // payload) {
    // Logic
    // return payload;
    // }
}
