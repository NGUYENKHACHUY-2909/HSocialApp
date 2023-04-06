package com.project.hsocial.controller;

import com.project.hsocial.form.CreateLikeForm;
import com.project.hsocial.service.ILikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/hsocial/likes")
@CrossOrigin(origins = "*")
public class LikeController {
    @Autowired
    private ILikeService likeService;

    @PostMapping
    public ResponseEntity<?> createLike(@RequestBody CreateLikeForm form){
        likeService.likePosts(form);
        return new ResponseEntity<>("Like thành công.", HttpStatus.OK);
    }
    @GetMapping(value = "/{likeId}")
    public int getUserIdByLikeId(@PathVariable(value = "likeId") int likeId){
        return likeService.getUserIdByLikeId(likeId);
    }
    @DeleteMapping(value = "/{userId}/{postId}")
    public ResponseEntity<?> cancelLike(@PathVariable(value = "userId") int userId, @PathVariable(value = "postId") int postId){
        likeService.cancelLike(userId, postId);
        return new ResponseEntity<>("Huỷ like thành công!", HttpStatus.OK);
    }
}
