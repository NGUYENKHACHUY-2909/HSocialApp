package com.project.hsocial.service;

import com.project.hsocial.entity.Comment;
import com.project.hsocial.form.CreateCommentForm;

import java.util.List;

public interface ICommentService {
     List<Comment> getCommentByPostId(int id);
     void createComment(CreateCommentForm form);
     void deleteComment(int commentId);
     void updateComment(String newContent, int commentId);
}
