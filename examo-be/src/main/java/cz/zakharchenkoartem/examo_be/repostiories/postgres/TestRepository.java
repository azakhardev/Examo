package cz.zakharchenkoartem.examo_be.repostiories.postgres;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import cz.zakharchenkoartem.examo_be.models.dtos.tests.TestProjection;
import cz.zakharchenkoartem.examo_be.models.entities.Test;

public interface TestRepository extends JpaRepository<Test, Long> {

    @Query("""
            SELECT t.id as id, t.title as title, u.name as authorName,
                   t.startAt as startAt, t.endAt as endAt, t.timeLimitMinutes as timeLimitMinutes,
                   t.maxPoints as maxPoints, p.totalGainedPoints as totalGainedPoints,
                   p.submittedAt as submittedAt
            FROM Test t
            JOIN QuizEntity q ON t.quizId = q.id
            JOIN q.author u
            LEFT JOIN Participant p ON t.id = p.test.id AND p.user.id = :userId
            WHERE (q.author.id = :userId OR q.id IN (SELECT qs.quiz.id FROM QuizShare qs WHERE qs.user.id = :userId))
            AND (:isAuthor = false AND q.author.id <> :userId OR :isAuthor = true)
            AND (
                (:isHistory = true AND (t.endAt < CURRENT_TIMESTAMP OR p.submittedAt IS NOT NULL))
                OR
                (:isHistory = false AND (t.endAt >= CURRENT_TIMESTAMP AND p.submittedAt IS NULL))
            )
            """)
    List<TestProjection> findForeignTests(
            @Param("userId") Integer userId,
            @Param("isHistory") Boolean isHistory,
            @Param("isAuthor") Boolean isAuthor);

    @Query("""
                SELECT t FROM Test t
                WHERE t.quizId = :uuid
                AND (
                    (:isLive = true AND t.endAt > CURRENT_TIMESTAMP) OR
                    (:isLive = false AND t.endAt <= CURRENT_TIMESTAMP)
                )
            """)
    List<Test> findQuizTests(@Param("uuid") UUID uuid, @Param("isLive") Boolean isLive);
}
