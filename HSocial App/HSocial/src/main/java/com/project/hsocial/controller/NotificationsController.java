package com.project.hsocial.controller;

import com.project.hsocial.dto.NotificationDTO;
import com.project.hsocial.entity.Notifications;
import com.project.hsocial.service.INotificationsService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "hsocial/notifications")
@CrossOrigin(origins = "*")
public class NotificationsController {
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private INotificationsService notificationsService;
    @PutMapping(value = "/{userId}")
    public void updateNotification(@PathVariable(value = "userId") int userId){
        notificationsService.updateNotification(userId);
    }
    @GetMapping(value = "/{userId}")
    public Page<NotificationDTO> getAllNotificationsByUserId(@PathVariable (value = "userId") int userId, Pageable pageable){
        Page<Notifications> notifications =  notificationsService.getAllNotificationsByUserId(userId, pageable);
        List<NotificationDTO> notificationDTOS = modelMapper.map(notifications.getContent(), new TypeToken<List<NotificationDTO>>(){}.getType());
        Page<NotificationDTO> notificationDTOPage = new PageImpl<>(notificationDTOS, pageable, notifications.getTotalElements());
        return notificationDTOPage;
    }
}
