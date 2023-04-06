package com.project.hsocial.repository;

import com.project.hsocial.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    public List<Comment> getAllByPost_PostId(int id);

}
