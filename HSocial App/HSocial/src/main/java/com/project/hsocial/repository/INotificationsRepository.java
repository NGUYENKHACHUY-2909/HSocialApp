package com.project.hsocial.repository;

import com.project.hsocial.entity.Notifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface INotificationsRepository extends JpaRepository<Notifications, Integer> {
    @Modifying
    @Transactional
    @Query(value = "UPDATE notifications SET is_read = 1 WHERE is_read = 0 AND user_id = :userId", nativeQuery = true)
    void updateNotification(@Param("userId") int userId);
    Page<Notifications> findAllByUserUserId(int userId, Pageable pageable);
}
