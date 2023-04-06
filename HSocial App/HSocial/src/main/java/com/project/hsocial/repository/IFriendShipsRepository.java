package com.project.hsocial.repository;

import com.project.hsocial.entity.Friendships;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IFriendShipsRepository extends JpaRepository<Friendships, Integer> {

    // lấy danh sách friendShips của userId
    @Query(value = "SELECT * FROM hsocial.friendships AS f WHERE f.user_id = :userId OR f.friend_id = :userId", nativeQuery = true)
    List<Friendships> getFriendsByUserId(@Param("userId") int userId);


    // lấy danh sách id bạn bè của user
    @Query(value = "SELECT user_id FROM friendships WHERE friend_id = :userId AND `status` = 'accepted' UNION SELECT friend_id FROM friendships WHERE user_id = :userId AND `status` = 'accepted'", nativeQuery = true)
    List<Integer> getAllFriendsIdByUserId(@Param("userId") int userId);
}
