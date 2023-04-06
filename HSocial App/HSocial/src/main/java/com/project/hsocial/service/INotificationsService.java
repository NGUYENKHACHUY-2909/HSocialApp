package com.project.hsocial.service;

import com.project.hsocial.entity.Notifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface INotificationsService {
    void updateNotification(int userId);
    Page<Notifications> getAllNotificationsByUserId(int userId, Pageable pageable);
}
