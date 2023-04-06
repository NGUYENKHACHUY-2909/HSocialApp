package com.project.hsocial.service.attachmentService;

import com.project.hsocial.entity.attachment.AttachmentAvatar;
import org.springframework.web.multipart.MultipartFile;

public interface IAttachmentAvatarService {
    AttachmentAvatar saveAttachment(MultipartFile file, int id) throws Exception;

}
