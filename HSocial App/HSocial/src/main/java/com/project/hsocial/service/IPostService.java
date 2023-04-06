package com.project.hsocial.service;

import com.project.hsocial.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IPostService {
     List<Post> getAllPost();
     void createPost(String content, int id, MultipartFile file) ;
     void updatePost(int id, String content);
     Post getPostById(int id);
     void deletePostById(int id);

     List<Post> getPostByUserId(int id);

     List<Post> getPostsOfFriends(int userId);
}
