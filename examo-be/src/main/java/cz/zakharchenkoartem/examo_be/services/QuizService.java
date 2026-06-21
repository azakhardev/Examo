package cz.zakharchenkoartem.examo_be.services;

import cz.zakharchenkoartem.examo_be.models.documents.Quiz;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizService {

    private final MongoTemplate mongoTemplate;

    public QuizService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public List<Quiz> searchQuizzes(String keyword, Integer authorId, String questionType) {
        Query query = new Query();

        // 1. Dynamically add criteria only if the user provided them
        if (keyword != null && !keyword.isEmpty()) {
            // Regex for case-insensitive partial match
            query.addCriteria(Criteria.where("title").regex(keyword, "i"));
        }

        if (authorId != null) {
            query.addCriteria(Criteria.where("authorId").is(authorId));
        }

        if (questionType != null && !questionType.isEmpty()) {
            // Searching inside the nested array
            query.addCriteria(Criteria.where("questions.type").is(questionType));
        }

        // 2. Execute the dynamically built query
        return mongoTemplate.find(query, Quiz.class);
    }
}