package com.example.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewDTO {

    private String text;
    private double rating;
    private String author;
    private String imagePath;

    public ReviewDTO(Review review) {
        this.text = review.getText();
        this.rating = review.getRating();
        this.author = review.getAuthor().getName();
        this.imagePath = review.getImagePath();
    }
}
