package cz.zakharchenkoartem.examo_be.repostiories.postgres;

import org.springframework.data.jpa.repository.JpaRepository;

import cz.zakharchenkoartem.examo_be.models.entities.Submission;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {

}
