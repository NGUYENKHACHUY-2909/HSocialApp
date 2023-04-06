package com.project.hsocial.entity;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table (name = "`like`", uniqueConstraints={@UniqueConstraint(columnNames={"user_id", "post_id"})})
@Data
public class Like implements Serializable {
    private static final long SerialVersionUID = 1L;

    @Column(name = "like_id")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int likeId;

    @Column(name = "created_date")
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    private Date createDate;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, referencedColumnName = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false, referencedColumnName = "post_id")
    private Post post;
}
