package com.ProjectSync.backend.Apply;

import com.ProjectSync.backend.comment.Comment;
import com.ProjectSync.backend.comment.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;

@Service
public class ApplyService {

    private final ApplyRepository applyRepository;
    private final CommentRepository commentRepository; // Assume you have this

    @Autowired
    public ApplyService(ApplyRepository applyRepository, CommentRepository commentRepository) {
        this.applyRepository = applyRepository;
        this.commentRepository = commentRepository;
    }
    public List<Apply> findAppliesByOwner(String owner) {
        return applyRepository.findByOwner(owner);
    }
    public List<Apply> findAcceptedApplicationsByCommentId(Long commentId) {
        return applyRepository.findByCommentIdAndAcceptedTrue(commentId);
    }

    public List<Apply> findApplicationsByCommentId(Long commentId) {
        return applyRepository.findByCommentId(commentId);
    }
    public List<Apply> findApplicationsByCommentIdAndNotAccepted(Long commentId) {
        return applyRepository.findByCommentIdAndAcceptedFalse(commentId);
    }

    public Apply createApply(Long commentId, String appliant, String content) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found with id: " + commentId));

        // Check if an application from this appliant for the specified comment already exists
        Optional<Apply> existingApplication = applyRepository.findByCommentIdAndAppliant(commentId, appliant);
        if (existingApplication.isPresent()) {
            // Handle the case where the application already exists, e.g., throw an exception or return null
            throw new IllegalStateException("Application already exists from this user for the specified post.");
        }

        Apply newApply = new Apply();
        newApply.setAppliant(appliant);
        newApply.setContent(content);
        newApply.setComment(comment);
        newApply.setOwner(comment.getScreenName()); // Assuming this is how you set the owner
        return applyRepository.save(newApply);
    }

    public Apply acceptApply(Long applyId) {
        Apply apply = applyRepository.findById(applyId)
                .orElseThrow(() -> new EntityNotFoundException("Apply not found with id " + applyId));
        apply.setAccepted(true);
        return applyRepository.save(apply);
    }

}

