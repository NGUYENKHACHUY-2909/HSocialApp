package com.project.hsocial.service;

import com.project.hsocial.entity.Notifications;
import com.project.hsocial.repository.INotificationsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationsService implements INotificationsService{
    @Autowired
    private INotificationsRepository notificationsRepository;
    @Override
    public void updateNotification(int userId) {
        notificationsRepository.updateNotification(userId);
    }

    @Override
    public Page<Notifications> getAllNotificationsByUserId(int userId, Pageable pageable) {
        return notificationsRepository.findAllByUserUserId(userId, pageable);
    }
}
