package cz.zakharchenkoartem.examo_be.services;

import cz.zakharchenkoartem.examo_be.exceptions.AccessDeniedException;
import cz.zakharchenkoartem.examo_be.exceptions.NotFoundException;
import cz.zakharchenkoartem.examo_be.models.documents.QuizDocument;
import cz.zakharchenkoartem.examo_be.models.documents.QuizSnapshot;
import cz.zakharchenkoartem.examo_be.models.dtos.QuizFavoriteProjection;
import cz.zakharchenkoartem.examo_be.models.entities.QuizEntity;
import cz.zakharchenkoartem.examo_be.models.entities.QuizShare;
import cz.zakharchenkoartem.examo_be.models.entities.QuizEntity.Visibility;
import cz.zakharchenkoartem.examo_be.repostiories.mongo.QuizDocumentRepostiory;
import cz.zakharchenkoartem.examo_be.repostiories.mongo.QuizSnapshotRepository;
import cz.zakharchenkoartem.examo_be.repostiories.postgres.QuizEntityRepository;
import cz.zakharchenkoartem.examo_be.repostiories.postgres.QuizShareRepository;
import jakarta.transaction.Transactional;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class QuizService {

    private final MongoTemplate mongoTemplate;
    private final QuizDocumentRepostiory quizDocumentRepostiory;
    private final QuizEntityRepository quizEntityRepository;
    private final QuizSnapshotRepository quizSnapshotRepository;
    private final QuizSharesService quizSharesService;

    public QuizService(MongoTemplate mongoTemplate, QuizDocumentRepostiory quizDocumentRepostiory,
            QuizEntityRepository quizEntityRepository,
            QuizSnapshotRepository quizSnapshotRepository, QuizSharesService quizSharesService) {
        this.mongoTemplate = mongoTemplate;
        this.quizDocumentRepostiory = quizDocumentRepostiory;
        this.quizEntityRepository = quizEntityRepository;
        this.quizSnapshotRepository = quizSnapshotRepository;
        this.quizSharesService = quizSharesService;
    }

    public List<String> getUserQuizzes(Integer userId) {
        return quizEntityRepository.findIdsByUserId(userId);
    }

    public List<QuizDocument> search(String keyword) {
        List<QuizEntity> matchingQuizzes = quizEntityRepository.findByNameContainingIgnoreCase(keyword);

        if (matchingQuizzes.isEmpty()) {
            return List.of();
        }

        List<String> allowedUuids = matchingQuizzes.stream()
                .filter(quiz -> quiz.getVisibility() == QuizEntity.Visibility.PUBLIC)
                .map(quiz -> quiz.getId().toString())
                .toList();

        if (allowedUuids.isEmpty()) {
            return List.of();
        }

        return this.getQuizzesByIds(allowedUuids);
    }

    public List<QuizDocument> getMyQuizzes(Integer userId, String keyword, Boolean favorite, String visibility,
            Boolean isAuthor) {
        List<QuizFavoriteProjection> allowedShares = quizEntityRepository.findFilteredIdsByUserId(userId, visibility,
                favorite, isAuthor);

        if (allowedShares == null || allowedShares.isEmpty()) {
            return List.of();
        }

        // Maps the QuizFavoriteProjection to map
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

    public QuizDocument getQuizDocumentById(String id) {
        Optional<QuizDocument> quiz = quizDocumentRepostiory.findById(id);

        if (!quiz.isPresent()) {
            throw new NotFoundException("Quiz with id " + id + " was not found");
        }

        return quiz.get();
    }

    public QuizEntity getQuizEntityById(String uuid) {
        return quizEntityRepository.findById(UUID.fromString(uuid))
                .orElseThrow(() -> new NotFoundException("Quiz with this UUID does not exist"));
    }

    public Visibility getQuizVisibility(String id) {

        Optional<QuizEntity> quiz = quizEntityRepository.findById(UUID.fromString(id));

        if (!quiz.isPresent()) {
            throw new NotFoundException("Quiz with this ID does not exist");
        }

        return quiz.get().getVisibility();
    }

    public QuizSnapshot getSnapshot(String id) {
        return quizSnapshotRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("SNapshot with this ID does not exist"));
    }

    public QuizSnapshot saveSnapshot(QuizDocument quiz) {
        QuizSnapshot snapshot = new QuizSnapshot();

        snapshot.setOriginalQuizId(quiz.getId());
        snapshot.setSnapshotDate(Instant.now());
        snapshot.setQuestions(quiz.getQuestions());

        return quizSnapshotRepository.save(snapshot);
    }

    public void deleteSnapshot(String snapshotId) {
        quizSnapshotRepository.deleteById(snapshotId);
    }

    public QuizDocument saveQuizDocument(QuizDocument quiz) {
        return quizDocumentRepostiory.save(quiz);
    }

    public void deleteQuizDocument(String quizId) {
        quizDocumentRepostiory.deleteById(quizId);
    }

    @Transactional
    public QuizDocument updateQuiz(String uuid, QuizDocument quizPayload, Integer userId) {

        QuizEntity pgQuiz = this.getQuizEntityById(uuid);
        QuizDocument mongoQUiz = this.getQuizDocumentById(uuid);
        QuizShare share = quizSharesService.getShare(userId, uuid);

        if (share == null || share.getAccessLevel() != QuizShare.AccessLevel.EDIT) {
            throw new AccessDeniedException("You do not have permission to edit this quiz.");
        }

        pgQuiz.setName(quizPayload.getTitle());
        quizEntityRepository.save(pgQuiz);

        quizPayload.setId(uuid);
        quizPayload.setAuthorId(userId);
        quizPayload.setAuthor(pgQuiz.getAuthor().getUsername());
        quizPayload.setUpdatedAt(LocalDateTime.now());
        quizPayload.setShareHash(mongoQUiz.getShareHash());

        return quizDocumentRepostiory.save(quizPayload);
    }
}