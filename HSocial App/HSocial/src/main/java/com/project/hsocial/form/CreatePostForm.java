package com.project.hsocial.form;

import lombok.Data;

@Data
public class CreatePostForm {
    private String content;
    private String AttachmentFile;
    private User user;

    public CreatePostForm(String content, String fileName, User user1) {
        this.content = content;
        this.AttachmentFile = fileName;
        this.user = user1;
    }

    @Data
    public static class User{
        private int userId;
    }

}
