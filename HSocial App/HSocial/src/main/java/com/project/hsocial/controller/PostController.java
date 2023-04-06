package com.project.hsocial.controller;

import com.project.hsocial.dto.PostDTO;
import com.project.hsocial.entity.Post;
import com.project.hsocial.service.IPostService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping(value = "/hsocial/posts")
@CrossOrigin(origins = "*")
public class PostController {
    @Autowired
    private IPostService postService;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping
    public ResponseEntity<?> getAllPosts(){
        List<Post> posts = postService.getAllPost();
        List<PostDTO> postDTOS = modelMapper.map(posts, new TypeToken<List<PostDTO>>(){}.getType());
        return new ResponseEntity<>(postDTOS, HttpStatus.OK);
    }
    @DeleteMapping(value = "/{id}")
    public ResponseEntity<?> deletePostById(@PathVariable(value = "id") int id){
        postService.deletePostById(id);
        return new ResponseEntity<>("Xoá Post thành công.", HttpStatus.OK);
    }

    @PostMapping(value = "/{id}")
    public ResponseEntity<?> createPost(@RequestParam("content") String content, @RequestParam("file") MultipartFile file, @PathVariable(value = "id") int id) {
        Path path = Paths.get("src/main/resources/static/images/" + file.getOriginalFilename());
        try {
            file.transferTo(path);
        }
        catch (IOException e){
            e.printStackTrace();
        }
        postService.createPost(content, id, file);
        return new ResponseEntity<>("Tạo bài viết thành công", HttpStatus.OK);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<?> updatePost(@PathVariable (value = "id") int id, @RequestParam("content") String content){
        postService.updatePost(id, content);
        return  new ResponseEntity<>("Update Successfully!", HttpStatus.OK);
    }
    @GetMapping(value = "/{id}")
    public List<PostDTO> getPostByUserId(@PathVariable (value = "id") int id){
        List<Post> posts = postService.getPostByUserId(id);
        List<PostDTO> postDTOS = modelMapper.map(posts, new TypeToken<List<PostDTO>>(){}.getType());
        return postDTOS;
    }
    @GetMapping(value = "postId/{id}")
    public ResponseEntity<?> getPostById(@PathVariable(value = "id") int id){
        Post post = postService.getPostById(id);
        PostDTO postDTO = modelMapper.map(post, PostDTO.class);
        return new ResponseEntity<>(postDTO, HttpStatus.OK);
    }

    @GetMapping(value = "friendsPosts/{userId}")
    public ResponseEntity<?> getAllPostsOfFriends(@PathVariable(value = "userId") int userId){
        List<Post> posts = postService.getPostsOfFriends(userId);
        List<PostDTO> postDTOS = modelMapper.map(posts, new TypeToken<List<PostDTO>>(){}.getType());
        return new ResponseEntity<>(postDTOS, HttpStatus.OK);
    }
}
