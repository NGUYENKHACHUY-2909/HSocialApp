package com.project.hsocial.repository;

import com.project.hsocial.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IUserRepository extends JpaRepository<User, Integer> {
    @Query(value = "SELECT * FROM `user` WHERE user_name LIKE :name%", nativeQuery = true)
    List<User> getUserByName(@Param("name") String name);

    User findByEmail(String email);
}
