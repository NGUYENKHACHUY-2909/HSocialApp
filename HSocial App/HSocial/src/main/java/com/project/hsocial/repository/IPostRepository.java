package com.project.hsocial.repository;

import com.project.hsocial.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IPostRepository extends JpaRepository<Post, Integer> {
     List<Post> findByUser_UserId(int id);

     // lấy tất cả post của danh sách friendId
     @Query (value = "SELECT * FROM post WHERE user_id in (:ids) ORDER BY created_date DESC", nativeQuery = true)
     List<Post> getPostsOfFriend(@Param("ids") List<Integer> ids);

}
