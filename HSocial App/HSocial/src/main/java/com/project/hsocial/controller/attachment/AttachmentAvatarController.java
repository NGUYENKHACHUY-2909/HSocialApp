package com.project.hsocial.controller.attachment;

import com.project.hsocial.dto.AttachmentAvatarDTO;
import com.project.hsocial.entity.attachment.AttachmentAvatar;
import com.project.hsocial.service.attachmentService.IAttachmentAvatarService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@CrossOrigin(origins = "*")
public class AttachmentAvatarController {

    private IAttachmentAvatarService IAttachmentAvatarService;

    public AttachmentAvatarController(IAttachmentAvatarService IAttachmentAvatarService) {
        this.IAttachmentAvatarService = IAttachmentAvatarService;
    }

    @PostMapping("/upload/{id}")
    public AttachmentAvatarDTO uploadFile(@RequestParam("file")MultipartFile file, @PathVariable int id) throws Exception {
        Path path = Paths.get("src/main/resources/static/images/" + file.getOriginalFilename());
        try {
            file.transferTo(path);
        } catch (IOException e) {
            e.printStackTrace();
        }
        AttachmentAvatar attachment = null;
        String downloadURl = "";
        attachment = IAttachmentAvatarService.saveAttachment(file,id);
        downloadURl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/download/")
                .path(attachment.getId())
                .toUriString();

        return new AttachmentAvatarDTO(attachment.getFileName(),
                downloadURl,
                file.getContentType());
    }
}
