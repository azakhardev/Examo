package cz.zakharchenkoartem.examo_be.repostiories.postgres;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import cz.zakharchenkoartem.examo_be.models.dtos.tests.TestProjection;
import cz.zakharchenkoartem.examo_be.models.entities.Test;

public interface TestRepository extends JpaRepository<Test, Long> {

    @Query("""
                SELECT t.id as id, t.title as title, u.name as authorName,
                       t.startAt as startAt, t.endAt as endAt, t.timeLimitMinutes as timeLimitMinutes,
                       t.maxPoints as maxPoints, sub.totalGainedPoints as totalGainedPoints,
                       sub.submittedAt as submittedAt
                FROM Test t
                JOIN QuizEntity q ON t.quizId = q.id
                JOIN User u ON q.authorId = u.id
                LEFT JOIN Submission sub ON t.id = sub.test.id AND sub.userId = :userId
                WHERE (q.authorId = :userId OR q.id IN (SELECT qs.quiz.id FROM QuizShare qs WHERE qs.userId = :userId))
                AND (:isAuthor = false AND q.authorId <> :userId OR :isAuthor = true)
                AND (:isHistory = true AND t.endAt < CURRENT_TIMESTAMP OR :isHistory = false AND t.endAt >= CURRENT_TIMESTAMP)
            """)
    List<TestProjection> findForeignTests(
            @Param("userId") Integer userId,
            @Param("isHistory") Boolean isHistory,
            @Param("isAuthor") Boolean isAuthor);
}
