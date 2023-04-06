package com.project.hsocial.entity.attachment;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
@Data@NoArgsConstructor
@Table(name = "Attachment_Avatar")
public class AttachmentAvatar {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String id;

    private String fileName;
    private String fileType;


    public AttachmentAvatar(String fileName, String fileType) {
        this.fileName = fileName;
        this.fileType = fileType;
    }
}
