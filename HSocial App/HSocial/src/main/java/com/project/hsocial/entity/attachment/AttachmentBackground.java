package com.project.hsocial.entity.attachment;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Data
@NoArgsConstructor
@Table(name = "Attachment_Background")
public class AttachmentBackground {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String id;
    private String fileName;
    private String fileType;

    public AttachmentBackground(String fileName, String fileType) {
        this.fileName = fileName;
        this.fileType = fileType;
    }
}
