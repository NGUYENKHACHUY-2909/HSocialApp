package com.project.hsocial.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.hsocial.entity.attachment.AttachmentAvatar;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class PostDTO {
    private int postId;
    private String content;
    @JsonFormat(pattern = "yyyy-MM-dd hh:mm:ss")
    private Date createDate;
    private User user;
    private String AttachmentFile;
    private List<Comment> comments;
    private List<Like> likes;

    @Data
    public static class Like{
        private int likeId;
        private User user;
    }

    @Data
    public static class Comment{
        private String contentComment;
        private User user;
    }

    @Data
    public static class User{
        private int userId;
        private String userName;
        private AttachmentAvatar attachment;
    }

}
