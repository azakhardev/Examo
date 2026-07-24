package cz.zakharchenkoartem.examo_be.repostiories.postgres;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import cz.zakharchenkoartem.examo_be.models.entities.Participant;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {
    Optional<Participant> findByUser_IdAndTest_Id(Integer userId, Long testId);
}
