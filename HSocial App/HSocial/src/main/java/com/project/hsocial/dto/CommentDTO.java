package com.project.hsocial.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

@Data
public class CommentDTO {
    private int commentId;
    private String contentComment;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createDate;
    private User user;

    @Data
    public static class User{
        private String userName;
        private AttachmentAvatar attachment;

        @Data
        public static class AttachmentAvatar{
            private String fileName;
        }
    }
}
