package com.project.hsocial.service.attachmentService;


import com.project.hsocial.entity.attachment.AttachmentAvatar;
import com.project.hsocial.entity.User;
import com.project.hsocial.repository.attachmentRepository.AttachmentAvatarRepository;
import com.project.hsocial.repository.IUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AttachmentAvatarServiceImpl implements IAttachmentAvatarService {

    private AttachmentAvatarRepository attachmentAvatarRepository;
    @Autowired
    private IUserRepository userRepository;

    public AttachmentAvatarServiceImpl(AttachmentAvatarRepository attachmentAvatarRepository) {
        this.attachmentAvatarRepository = attachmentAvatarRepository;
    }

    @Override
    @Transactional
    public AttachmentAvatar saveAttachment(MultipartFile file, int id) throws Exception {
        User user = userRepository.findById(id).get();
       String fileName = StringUtils.cleanPath(file.getOriginalFilename());
       try {
            if(fileName.contains("..")) {
                throw  new Exception("Filename contains invalid path sequence " + fileName);
            }

            AttachmentAvatar attachment
                    = new AttachmentAvatar(fileName,
                    file.getContentType());
            user.setAttachment(attachment);
            return attachmentAvatarRepository.save(attachment);

       } catch (Exception e) {
            throw new Exception("Could not save File: " + fileName);
       }
    }

}
