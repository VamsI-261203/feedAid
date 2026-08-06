package com.shareandcare.backend.service;

import com.shareandcare.backend.model.Review;
import com.shareandcare.backend.model.User;
import com.shareandcare.backend.repository.ReviewRepository;
import com.shareandcare.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<Review> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Review saveReview(String email, String role, int rating, String title, String description) throws Exception {
        // Validate user existence and verification status (CORS / Custom Authentication validation)
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (!userOpt.isPresent()) {
            throw new Exception("Unauthorized: User account not found.");
        }
        User user = userOpt.get();
        if (!user.isEmailVerified()) {
            throw new Exception("Access Denied: Please verify your email before posting reviews.");
        }

        // Validate values
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5 stars.");
        }
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Review title is mandatory.");
        }
        if (description == null || description.trim().isEmpty()) {
            throw new IllegalArgumentException("Review description is mandatory.");
        }
        if (role == null || (!role.equalsIgnoreCase("Donor") && !role.equalsIgnoreCase("Receiver"))) {
            throw new IllegalArgumentException("Reviewer role must be either Donor or Receiver.");
        }

        Review review = new Review(
                user.getName(),
                user.getEmail(),
                role,
                rating,
                title.trim(),
                description.trim()
        );

        return reviewRepository.save(review);
    }
}
