package com.project.hsocial.dto;

import com.project.hsocial.entity.attachment.AttachmentAvatar;
import lombok.Data;

@Data
public class FriendShipDTO {
    private int friendshipsId;
    private String status;
    private User user;
    private User friend;
    @Data
    public static class User{
        private int userId;
        private String userName;
        private AttachmentAvatar attachment;
    }
}
