package com.project.hsocial.controller.attachment;

import com.project.hsocial.dto.AttachmentBackgrounDTO;
import com.project.hsocial.entity.attachment.AttachmentBackground;
import com.project.hsocial.service.attachmentService.IAttachmentBackgroundService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping(value = "background")
@CrossOrigin(origins = "*")
public class AttachmentBackgroundController {
    @Autowired
    private IAttachmentBackgroundService attachmentBackgroundService;

    @PostMapping(value = "/{id}")
    public AttachmentBackgrounDTO updateBackground(@RequestParam("file")MultipartFile file, @PathVariable(value = "id") int id) throws Exception{
        Path path = Paths.get("src/main/resources/static/images/" + file.getOriginalFilename());
        try {
            file.transferTo(path);
        }
        catch (IOException e){
            e.printStackTrace();
        }
        AttachmentBackground attachmentBackground = attachmentBackgroundService.saveAttachmentBackground(file, id);
        String downloadURl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/download/")
                .path(attachmentBackground.getId())
                .toUriString();
        return new AttachmentBackgrounDTO(attachmentBackground.getFileName(), downloadURl, file.getContentType());
    }
}
