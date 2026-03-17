package com.example.websecurity.service;

import com.example.websecurity.exception.WebSecMissingDataException;
import org.springframework.security.core.context.SecurityContextHolder;
import com.example.websecurity.persistence.Review;
import com.example.websecurity.persistence.User;
import com.example.websecurity.persistence.ReviewRepository;
import com.example.websecurity.persistence.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

import static lombok.AccessLevel.PACKAGE;

@Service
@AllArgsConstructor(access = PACKAGE)
@Slf4j
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    public Review getReviewById(Long id) {
    	String email = SecurityContextHolder
    		.getContext()
    		.getAuthentication()
    		.getName();
    	User user = userRepository.findByEmail(email).orElseThrow(() -> new
	WebSecMissingDataException("User with email " + email + "not found"));
        return reviewRepository.findByIdAndUserId(id, user.getId()).orElseThrow(() -> new WebSecMissingDataException("Review with id " + id + " not found"));
    }

    public Review updateReview(Review review) {
        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByUser(Long userId) {
        return reviewRepository.findByUserId(userId);
    }
}
