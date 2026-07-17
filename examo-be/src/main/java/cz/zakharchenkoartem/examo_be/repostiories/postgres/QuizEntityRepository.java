package cz.zakharchenkoartem.examo_be.repostiories.postgres;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import cz.zakharchenkoartem.examo_be.models.entities.QuizEntity;

public interface QuizEntityRepository extends JpaRepository<QuizEntity, UUID> {
    @Query("SELECT q.id FROM QuizEntity q LEFT JOIN q.shares s WHERE q.authorId = :userId OR s.userId = :userId")
    List<String> findByUserId(Integer userId);

    @Query(value = """
            SELECT q.id
            FROM quizzes q
            LEFT JOIN quiz_shares qs ON q.id = qs.quiz_id
            WHERE (q.author_id = :userId OR (qs.user_id = :userId
                  AND (:accessLevel IS NULL OR qs.access_level = :accessLevel)
                  AND (:favorite IS NULL OR qs.favorite = :favorite)))
            """, nativeQuery = true)
    List<String> findFilteredIdsByUserId(@Param("userId") Integer userId, @Param("accessLevel") String accessLevel,
            @Param("favorite") Boolean favorite);
}
