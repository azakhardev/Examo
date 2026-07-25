package cz.zakharchenkoartem.examo_be.repostiories.mongo;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import cz.zakharchenkoartem.examo_be.models.documents.TestSession;

public interface TestSessionRepository extends MongoRepository<TestSession, String> {
    Optional<TestSession> findByTestIdAndUserId(Long testId, Integer userId);
}
