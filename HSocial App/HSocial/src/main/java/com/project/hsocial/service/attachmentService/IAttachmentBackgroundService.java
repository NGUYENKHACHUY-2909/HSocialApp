package com.project.hsocial.service.attachmentService;

import com.project.hsocial.entity.attachment.AttachmentBackground;
import org.springframework.web.multipart.MultipartFile;

public interface IAttachmentBackgroundService {
    AttachmentBackground saveAttachmentBackground(MultipartFile file, int id) throws Exception;
}
