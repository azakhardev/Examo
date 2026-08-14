package cz.zakharchenkoartem.examo_be.repostiories.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;

import cz.zakharchenkoartem.examo_be.models.documents.TestSubmissionDocument;

public interface TestSubmissionDocumentRepository extends MongoRepository<TestSubmissionDocument, String> {

}
