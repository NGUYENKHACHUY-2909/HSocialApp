package com.project.hsocial.entity;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "notifications")
@Data
public class Notifications implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column(name = "notifications_id")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int notificationsId;

    @Column(name = "notification_text", nullable = false)
    private String notificationText;

    @Column(name = "is_read", nullable = false)
    private Boolean isRead;

    @Column(name = "created_at", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    private Date createdAt;

    @ManyToOne
    @JoinColumn(name = "friend_id", referencedColumnName = "user_id")
    private User friend;

    @Column(name = "create_user_attachment")
    private String attachment;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;

}
