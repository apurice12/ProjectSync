package com.ProjectSync.backend.Apply;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/user/apply")
public class ApplyController {

    @Autowired
    private ApplyService applyService;

    private static class ApplyRequest {
        public String appliant;
        public String content;
    }

    @PostMapping("/{commentId}")
    public ResponseEntity<?> createApply(@PathVariable Long commentId, @RequestBody ApplyRequest applyRequest) {
        try {
            Apply apply = applyService.createApply(commentId, applyRequest.appliant, applyRequest.content);
            return ResponseEntity.ok(apply);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{applyId}/accept")
    public ResponseEntity<?> acceptApply(@PathVariable Long applyId) {
        try {
            Apply updatedApply = applyService.acceptApply(applyId);
            return ResponseEntity.ok(updatedApply);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/by-comment/{commentId}")
    public ResponseEntity<List<Apply>> getApplicationsByCommentId(@PathVariable Long commentId) {
        try {
            List<Apply> applications = applyService.findApplicationsByCommentId(commentId);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            // Return an empty list with BAD_REQUEST status, or consider using NOT_FOUND if more appropriate
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }
    }


}


