package com.project.hsocial.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.project.hsocial.entity.attachment.AttachmentAvatar;
import lombok.Data;

import java.util.Date;

@Data
public class NotificationDTO {
    private int notificationsId;
    private String notificationText;
    private Boolean isRead;
    private User user;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createdAt;
    private int createUserId;
    private User friend;

    @Data
    public static class User{
        private int userId;
        private String userName;
        private AttachmentAvatar attachment;
    }
}
