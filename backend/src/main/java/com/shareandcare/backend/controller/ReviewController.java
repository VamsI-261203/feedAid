package com.shareandcare.backend.controller;

import com.shareandcare.backend.model.Review;
import com.shareandcare.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    /**
     * Get all reviews ordered by newest first.
     * GET /api/reviews
     */
    @GetMapping
    public ResponseEntity<List<Review>> getReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    /**
     * Submit a new review.
     * POST /api/reviews
     */
    @PostMapping
    public ResponseEntity<?> submitReview(@RequestBody ReviewRequest reviewRequest) {
        try {
            Review review = reviewService.saveReview(
                    reviewRequest.getEmail(),
                    reviewRequest.getRole(),
                    reviewRequest.getRating(),
                    reviewRequest.getTitle(),
                    reviewRequest.getDescription()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(review);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            String errorMsg = e.getMessage();
            if (errorMsg != null && errorMsg.startsWith("Unauthorized")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", errorMsg));
            } else if (errorMsg != null && errorMsg.contains("Access Denied")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", errorMsg));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", errorMsg));
        }
    }

    public static class ReviewRequest {
        private String email;
        private String role;
        private int rating;
        private String title;
        private String description;

        public ReviewRequest() {}

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public int getRating() { return rating; }
        public void setRating(int rating) { this.rating = rating; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }
}
