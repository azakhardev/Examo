package cz.zakharchenkoartem.examo_be.services;

import java.util.UUID;

import org.springframework.stereotype.Service;

import cz.zakharchenkoartem.examo_be.exceptions.ForbiddenException;
import cz.zakharchenkoartem.examo_be.exceptions.NotFoundException;
import cz.zakharchenkoartem.examo_be.models.entities.QuizEntity;
import cz.zakharchenkoartem.examo_be.models.entities.QuizShare;
import cz.zakharchenkoartem.examo_be.repostiories.postgres.QuizEntityRepository;
import cz.zakharchenkoartem.examo_be.repostiories.postgres.QuizShareRepository;
import cz.zakharchenkoartem.examo_be.repostiories.postgres.UserRepository;

@Service
public class QuizSharesService {

    private final QuizShareRepository quizShareRepository;
    private final QuizEntityRepository quizEntityRepository;
    private final QuizBlockService quizBlocksService;
    private final UserRepository userRepository;

    public QuizSharesService(QuizShareRepository quizShareRepository, UserRepository userRepository,
            QuizEntityRepository quizEntityRepository, QuizBlockService quizBlocksService) {
        this.quizShareRepository = quizShareRepository;
        this.quizEntityRepository = quizEntityRepository;
        this.quizBlocksService = quizBlocksService;
        this.userRepository = userRepository;
    }

    public QuizShare getShare(Integer userId, String id) {
        QuizShare share = quizShareRepository.findByUser_IdAndQuiz_Id(userId, UUID.fromString(id));

        if (share == null) {
            throw new NotFoundException("You don't have acces to this quiz");
        }

        return share;
    }

    public QuizShare ensureAccess(Integer userId, String quizUuid, QuizEntity.Visibility accessLevel) {
        QuizShare existingShare = quizShareRepository.findByUser_IdAndQuiz_Id(userId, UUID.fromString(quizUuid));
        if (existingShare != null) {
            return existingShare;
        }

        QuizEntity quiz = quizEntityRepository.findById(UUID.fromString(quizUuid))
                .orElseThrow(() -> new NotFoundException("Quiz not found"));

        boolean isAuthor = quiz.getAuthor().getId().equals(userId);
        // Check if the quiz's visibility rank is high enough to satisfy the requested
        // access level
        boolean isAccessible = quiz.getVisibility().ordinal() >= accessLevel.ordinal();
        boolean isBlocked = quizBlocksService.isUserBlocked(userId, UUID.fromString(quizUuid));

        if (!isAuthor && !isAccessible) {
            throw new ForbiddenException(
                    "This quiz is visible only to the author. Please, check the visibility of the quiz.");
        }

        if (isBlocked) {
            throw new ForbiddenException("You do not have access to this quiz.");
        }

        QuizShare newShare = new QuizShare();
        newShare.setQuiz(quiz);
        newShare.setUser(userRepository.getReferenceById(userId));
        newShare.setAccessLevel(isAuthor ? QuizShare.AccessLevel.EDIT : QuizShare.AccessLevel.READ);
        newShare.setFavorite(false);

        return quizShareRepository.save(newShare);
    }

    public Boolean toggleFavorite(Integer userId, String id) {
        QuizShare share = this.getShare(userId, id);

        if (share.getFavorite() == null || share.getFavorite() == false) {
            share.setFavorite(true);
        } else {
            share.setFavorite(false);
        }

        return quizShareRepository.save(share).getFavorite();
    }
}
