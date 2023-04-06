package com.project.hsocial.service;

import com.project.hsocial.entity.Post;
import com.project.hsocial.entity.User;
import com.project.hsocial.form.CreatePostForm;
import com.project.hsocial.repository.IFriendShipsRepository;
import com.project.hsocial.repository.IPostRepository;
import com.project.hsocial.repository.IUserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class PostService implements IPostService{
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private IPostRepository postRepository;

    @Autowired
    private IFriendShipsRepository friendShipsRepository;

    @Autowired
    private IUserRepository iUserRepository;
    @Override
    public List<Post> getAllPost() {
        return postRepository.findAll();
    }

    @Override
    @Transactional
    public void createPost(String content, int id, MultipartFile file) {
        User user = iUserRepository.findById(id).get();
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        CreatePostForm.User user1 = modelMapper.map(user, CreatePostForm.User.class);
        CreatePostForm createPostForm = new CreatePostForm(content, fileName, user1);
        Post post = modelMapper.map(createPostForm, Post.class);
        postRepository.save(post);
        List<Post> posts = new ArrayList<>();
        posts.add(post);
        user.setPosts(posts);
    }


    @Override
    @Transactional
    public void updatePost(int id, String content) {
        Post post = getPostById(id);
        post.setContent(content);
        postRepository.save(post);
    }

    @Override
    public Post getPostById(int id) {
        return postRepository.findById(id).get();
    }

    @Override
    @Transactional
    public void deletePostById(int id) {
        postRepository.deleteById(id);
    }

    public List<Post> getPostByUserId(int id){
        return postRepository.findByUser_UserId(id);
    }

    @Override
    public List<Post> getPostsOfFriends(int userId) {
        List<Integer> ids = friendShipsRepository.getAllFriendsIdByUserId(userId);
        ids.add(userId);
        return postRepository.getPostsOfFriend(ids);
    }
}
