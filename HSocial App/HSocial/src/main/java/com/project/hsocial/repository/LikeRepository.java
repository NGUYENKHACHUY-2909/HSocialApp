package com.project.hsocial.repository;

import com.project.hsocial.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LikeRepository extends JpaRepository<Like, Integer> {

    @Query(value = "SELECT user_id FROM hsocial.`like` WHERE `like`.like_id = :likeId", nativeQuery = true)
     int getUserByLikeId(@Param("likeId") int likeId);

    @Modifying
    @Query(value = "DELETE FROM `like` WHERE user_id = :userId AND post_id = :postId", nativeQuery = true)
     void cancelLikeByUserIdAndPostId(@Param("userId") int userId, @Param("postId") int postId);

}
