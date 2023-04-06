package com.project.hsocial.controller;

import com.project.hsocial.dto.CommentDTO;
import com.project.hsocial.entity.Comment;
import com.project.hsocial.form.CreateCommentForm;
import com.project.hsocial.service.ICommentService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "hsocial/comments")
@CrossOrigin(origins = "*")
public class CommentController {
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private ICommentService commentService;
    @GetMapping(value = "/{id}")
    public List<CommentDTO> getCommentByPostId(@PathVariable(value = "id") int id){
        List<Comment> comments = commentService.getCommentByPostId(id);
        List<CommentDTO> commentDTOS = modelMapper.map(comments, new TypeToken<List<CommentDTO>>(){}.getType());
        return commentDTOS;
    }

    @PostMapping
    public ResponseEntity<?> createComment(@RequestBody CreateCommentForm form){
        commentService.createComment(form);
        return new ResponseEntity<>("Tạo comment thành công.", HttpStatus.OK);
    }
    @DeleteMapping(value = "/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable(value = "commentId") int commentId){
        commentService.deleteComment(commentId);
        return new ResponseEntity<>("Xoá thành công.", HttpStatus.OK);
    }
    @PutMapping(value = "/{commentId}")
    public ResponseEntity<?> updateComment(@PathVariable(value = "commentId") int commentId, @RequestBody String newComment){
        commentService.updateComment(newComment, commentId);
        return new ResponseEntity<>("Cập nhật thành công.", HttpStatus.OK);
    }
}
