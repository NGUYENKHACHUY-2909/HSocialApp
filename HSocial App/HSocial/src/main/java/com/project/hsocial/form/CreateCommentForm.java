package com.project.hsocial.form;
import lombok.Data;

@Data
public class CreateCommentForm {
    private String contentComment;
    private User user;
    private Post post;

    @Data
    public static class User{
        private int userId;
    }

    @Data
    public static class Post{
        private int postId;
    }
}
