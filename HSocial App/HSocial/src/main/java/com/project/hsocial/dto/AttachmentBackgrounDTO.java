package com.project.hsocial.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttachmentBackgrounDTO {
    private String fileName;
    private String downloadURL;
    private String fileType;
}
