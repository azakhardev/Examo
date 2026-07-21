package cz.zakharchenkoartem.examo_be.repostiories.postgres;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import cz.zakharchenkoartem.examo_be.models.dtos.QuizFavoriteProjection;
import cz.zakharchenkoartem.examo_be.models.entities.QuizEntity;

public interface QuizEntityRepository extends JpaRepository<QuizEntity, UUID> {
      @Query("SELECT q.id FROM QuizEntity q LEFT JOIN q.shares s WHERE q.authorId = :userId OR s.userId = :userId")
      List<String> findIdsByUserId(Integer userId);

      @Query(value = """
                  SELECT q.id as quizId, qs.favorite as favorite
                  FROM quizzes q
                  LEFT JOIN quiz_shares qs ON q.id = qs.quiz_id
                  WHERE (qs.user_id = :userId
                        AND (:author IS NULL OR q.author_id = :userId)
                        AND (:visibility IS NULL OR q.visibility = :visibility)
                        AND (:favorite IS NULL OR qs.favorite = :favorite))
                  """, nativeQuery = true)
      List<QuizFavoriteProjection> findFilteredIdsByUserId(@Param("userId") Integer userId,
                  @Param("visibility") String visibility,
                  @Param("favorite") Boolean favorite, @Param("author") Boolean author);

      List<QuizEntity> findByNameContainingIgnoreCase(String name);
}
