package com.example.backend;

import com.example.backend.exception.UnimplementedMethodException;
import com.example.backend.service.ForumService;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class ForumServiceTest {

    private final ForumService forumService = new ForumService();

    @Test
    void deleteDiscussions_unimplementedMethod_shouldThrowUnimplementedMethodException() {
        String token = "neki-token";
        assertThrows(UnimplementedMethodException.class, () -> forumService.deleteAllDiscussions(token));
    }
}
