package cz.zakharchenkoartem.examo_be.services;

import cz.zakharchenkoartem.examo_be.models.documents.QuizDocument;
import cz.zakharchenkoartem.examo_be.models.dtos.QuizFavoriteProjection;
import cz.zakharchenkoartem.examo_be.repostiories.mongo.QuizDocumentRepostiory;
import cz.zakharchenkoartem.examo_be.repostiories.postgres.QuizEntityRepository;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
        return quizEntityRepository.findIdsByUserId(userId);
    }

    public List<QuizDocument> search(String keyword) {
        Query query = new Query();

        if (keyword != null) {
            query.addCriteria(Criteria.where("title").regex(keyword, "i"));
        }

        return mongoTemplate.find(query, QuizDocument.class);
    }

    public List<QuizDocument> getMyQuizzes(Integer userId, String keyword, Boolean favorite, String visibility,
            Boolean isAuthor) {
        List<QuizFavoriteProjection> allowedShares = quizEntityRepository.findFilteredIdsByUserId(userId, visibility,
                favorite, isAuthor);

        if (allowedShares == null || allowedShares.isEmpty()) {
            return List.of();
        }

        Map<String, Boolean> favoriteMap = allowedShares.stream()
                .collect(Collectors.toMap(QuizFavoriteProjection::getQuizId, QuizFavoriteProjection::getFavorite));

        List<String> quizIds = new ArrayList<>(favoriteMap.keySet());

        Query query = new Query();
        query.addCriteria(Criteria.where("id").in(quizIds));

        if (keyword != null && !keyword.trim().isEmpty()) {
            query.addCriteria(Criteria.where("title").regex(keyword, "i"));
        }

        if (isAuthor != null && isAuthor) {
            query.addCriteria(Criteria.where("authorId").eq(userId));
        }

        List<QuizDocument> quizzes = mongoTemplate.find(query, QuizDocument.class);

        quizzes.forEach(quiz -> {
            Boolean isFav = favoriteMap.getOrDefault(quiz.getId(), false);
            quiz.setFavorite(isFav);
        });

        return quizzes;
    }

    public List<QuizDocument> getQuizzesByIds(List<String> ids) {
        return quizDocumentRepostiory.findByIdIn(ids);
    }
}