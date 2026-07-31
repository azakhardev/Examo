package cz.zakharchenkoartem.examo_be.repostiories.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;

import cz.zakharchenkoartem.examo_be.models.documents.QuizSnapshot;

public interface QuizSnapshotRepository
        extends MongoRepository<QuizSnapshot, String> {
}
