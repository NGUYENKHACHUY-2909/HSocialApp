package com.project.hsocial.service.attachmentService;

import com.project.hsocial.entity.attachment.AttachmentBackground;
import com.project.hsocial.entity.User;
import com.project.hsocial.repository.attachmentRepository.AttachmentBackgroundRepository;
import com.project.hsocial.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AttachmentBackgroundService implements IAttachmentBackgroundService{

    @Autowired
    private IUserRepository userRepository;
    @Autowired
    private AttachmentBackgroundRepository attachmentBackgroundRepository;
    @Override
    @Transactional
    public AttachmentBackground saveAttachmentBackground(MultipartFile file, int id) throws Exception {
        User user = userRepository.findById(id).get();
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        try {
            if(fileName.contains("..")){
                throw new Exception("Filename contains invalid path sequence "+fileName);
            }
            AttachmentBackground attachmentBackground = new AttachmentBackground(fileName, file.getContentType());
            user.setAttachmentBackground(attachmentBackground);
            return attachmentBackgroundRepository.save(attachmentBackground);
        }
        catch (Exception e){
            throw new Exception("Could not save File: "+ fileName);
        }
    }
}
