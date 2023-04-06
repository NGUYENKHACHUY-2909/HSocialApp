package com.project.hsocial.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@Data
public class UserDTO {
    private int userId;
    private String userName;
    private String email;
    private String address;
    private String phoneNumber;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private String dateOfBirth;
    private String description;
    private String education;
    private AttachmentAvatar attachmentAvatar;
    private AttachmentBackground attachmentBackground;
    private List<Post> posts;


    @Data
    public static class Post{
        private int postId;
        private String content;
        private String AttachmentFile;
        @JsonFormat(pattern = "yyyy-MM-dd hh:mm:ss")
        private Date createDate;
        private List<Like> likes;
        private List<Comment> comments;

        @Data
        public static class Like{
            private int likeId;
        }
        @Data
        public static class Comment{
            private int commentId;
            private String contentComment;
        }
    }
    @Data
    public static class User{
        private int userId;
        private AttachmentAvatar attachmentAvatar;
        private String userName;
    }

    @Data
    public static class AttachmentAvatar{
        private String id;
        private String fileName;
        private String fileType;
    }

    @Data
    public static class AttachmentBackground{
        private String id;
        private String fileName;
        private String fileType;
    }
}
