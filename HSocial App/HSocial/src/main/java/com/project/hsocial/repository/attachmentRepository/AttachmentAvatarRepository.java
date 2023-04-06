package com.project.hsocial.repository.attachmentRepository;


import com.project.hsocial.entity.attachment.AttachmentAvatar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttachmentAvatarRepository extends JpaRepository<AttachmentAvatar, String> {
}
