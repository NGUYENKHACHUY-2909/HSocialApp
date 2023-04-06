package com.project.hsocial.entity;

import com.project.hsocial.entity.attachment.AttachmentAvatar;
import com.project.hsocial.entity.attachment.AttachmentBackground;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "user")
@Data
public class User implements Serializable {
    private static final long serialVersionUID = 1L;
    @Column(name = "user_id")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;

    @Column(name = "user_name", length = 50, nullable = false)
    private String userName;

    @Column(name = "password", length = 800, nullable = false)
    private String password;

    @Column(name = "email", length = 255, unique = true, nullable = false, updatable = false)
    private String email;


    @Column(name = "address",  nullable = false)
    private String address;

    @Column(name = "date_of_birth", nullable = false)
    private Date dateOfBirth;

    @Column(name = "`description`")
    private String description;

    @Column(name = "education")
    private String education;

    @Column(name = "gender")
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "created_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    private Date createDate;

    @OneToOne
    private AttachmentAvatar attachment;


    @OneToMany(mappedBy = "user")
    private List<Post> posts;

    @OneToOne
    private AttachmentBackground attachmentBackground;


    @OneToMany(mappedBy = "friend")
    private List<Friendships> friendships;

    public enum Gender{
        MALE, FEMALE
    }

    public enum Role{
        ADMIN, USER
    }
}
