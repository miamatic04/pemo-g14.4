package com.example.backend.dto;

import com.example.backend.model.Review;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewDTO {
    private Long id;
    private String text;
    private double rating;
    private String author;
    private String imagePath;

    public ReviewDTO(Review review) {
        this.id = review.getId();
        this.text = review.getText();
        this.rating = review.getRating();
        this.author = review.getAuthor().getName();
        this.imagePath = review.getImagePath();
    }
}
