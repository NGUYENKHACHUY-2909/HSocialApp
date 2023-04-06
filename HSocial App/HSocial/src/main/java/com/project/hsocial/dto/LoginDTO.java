package com.project.hsocial.dto;

import com.project.hsocial.entity.attachment.AttachmentAvatar;
import lombok.Data;

@Data
public class LoginDTO {
    private int userId;
    private String userName;
    private AttachmentAvatar attachment;
}
