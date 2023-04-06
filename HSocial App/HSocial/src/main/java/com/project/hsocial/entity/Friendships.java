package com.project.hsocial.entity;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "friendships")
@Data
public class Friendships implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column(name = "friendships_id")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int friendshipsId;

    @Column(name = "`status`")
    @Enumerated(EnumType.STRING)
    private Status status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "friend_id")
    private User friend;

    public enum Status {
        pending, accepted, rejected
    }
}
