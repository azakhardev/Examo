package cz.zakharchenkoartem.examo_be.services;

import org.springframework.stereotype.Service;

import cz.zakharchenkoartem.examo_be.exceptions.NotFoundException;
import cz.zakharchenkoartem.examo_be.models.entities.Participant;
import cz.zakharchenkoartem.examo_be.repostiories.postgres.ParticipantRepository;
import cz.zakharchenkoartem.examo_be.repostiories.postgres.TestRepository;
import cz.zakharchenkoartem.examo_be.repostiories.postgres.UserRepository;

@Service
public class ParticipantService {

    private final ParticipantRepository participantRepository;
    private final UserRepository userRepository;
    private final TestRepository testRepository;

    public ParticipantService(ParticipantRepository participantRepository, UserRepository userRepository,
            TestRepository testRepository) {
        this.participantRepository = participantRepository;
        this.userRepository = userRepository;
        this.testRepository = testRepository;
    }

    public Participant getParticipation(Long participationId) {
        return participantRepository.findById(participationId)
                .orElseThrow(() -> new NotFoundException("You are not participating in this test"));
    }

    public Participant getParticipation(Integer userId, Long testId) {
        return participantRepository.findByUser_IdAndTest_Id(userId, testId)
                .orElseThrow(() -> new NotFoundException("You are not participating in this test"));
    }

    public Participant createParticipation(Integer userId, Long testId) {
        return participantRepository.findByUser_IdAndTest_Id(userId, testId)
                .orElseGet(() -> {
                    Participant participant = new Participant();

                    participant.setUser(userRepository.getReferenceById(userId));
                    participant.setTest(testRepository.getReferenceById(testId));

                    return participantRepository.save(participant);
                });

    }
}
