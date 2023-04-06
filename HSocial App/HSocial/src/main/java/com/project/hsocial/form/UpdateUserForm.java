package com.project.hsocial.form;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotBlank;
import java.util.Date;

@Data
public class UpdateUserForm {
    @Length(min = 6, max = 50, message = "The length of the user name between 6 - 50 characters!")
    @NotBlank(message = "Tên người dùng không được để trống!")
    private String userName;
    @Length(min = 6, max = 50, message = "The length of the user name between 6 - 50 characters!")
    private String address;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dateOfBirth;
    private String description;
    @Length(min = 6, max = 50, message = "The length of the user name between 6 - 50 characters!")
    private String education;
    private String phoneNumber;
}
