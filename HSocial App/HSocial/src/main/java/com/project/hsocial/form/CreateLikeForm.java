package com.project.hsocial.form;

import lombok.Data;

@Data
public class CreateLikeForm {
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
