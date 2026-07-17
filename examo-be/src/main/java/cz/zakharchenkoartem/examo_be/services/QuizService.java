package cz.zakharchenkoartem.examo_be.services;

import cz.zakharchenkoartem.examo_be.models.documents.QuizDocument;
import cz.zakharchenkoartem.examo_be.repostiories.mongo.QuizDocumentRepostiory;
import cz.zakharchenkoartem.examo_be.repostiories.postgres.QuizEntityRepository;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizService {

    private final MongoTemplate mongoTemplate;
    private final QuizDocumentRepostiory quizDocumentRepostiory;
    private final QuizEntityRepository quizEntityRepository;

    public QuizService(MongoTemplate mongoTemplate, QuizDocumentRepostiory quizDocumentRepostiory,
            QuizEntityRepository quizEntityRepository) {
        this.mongoTemplate = mongoTemplate;
        this.quizDocumentRepostiory = quizDocumentRepostiory;
        this.quizEntityRepository = quizEntityRepository;
    }

    public List<String> getUserQuizzes(Integer userId) {
        return quizEntityRepository.findByUserId(userId);
    }

    public List<QuizDocument> search(String keyword) {
        Query query = new Query();

        if (keyword != null) {
            query.addCriteria(Criteria.where("title").regex(keyword, "i"));
        }

        return mongoTemplate.find(query, QuizDocument.class);
    }

    // TODO: Fix author filtering (include author by default)
    public List<QuizDocument> getMyQuizzes(Integer userId, String keyword, Boolean favorite, String accessLevel,
            Boolean isAuthor) {
        List<String> allowedQuizIds = quizEntityRepository.findFilteredIdsByUserId(userId, accessLevel, favorite);

        if (allowedQuizIds == null || allowedQuizIds.isEmpty()) {
            return List.of();
        }

        Query query = new Query();

        query.addCriteria(Criteria.where("id").in(allowedQuizIds));

        if (keyword != null && !keyword.trim().isEmpty()) {
            query.addCriteria(Criteria.where("title").regex(keyword, "i"));
        }

        if (isAuthor != null && isAuthor) {
            query.addCriteria(Criteria.where("authorId").eq(userId));
        }

        List<QuizDocument> quizzes = mongoTemplate.find(query, QuizDocument.class);

        return quizzes;
    }

    public List<QuizDocument> getQuizzesByIds(List<String> ids) {
        return quizDocumentRepostiory.findByIdIn(ids);
    }
}