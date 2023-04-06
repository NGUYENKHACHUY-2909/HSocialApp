package com.project.hsocial.service;

import com.project.hsocial.entity.Comment;
import com.project.hsocial.entity.Notifications;
import com.project.hsocial.entity.Post;
import com.project.hsocial.entity.User;
import com.project.hsocial.form.CreateCommentForm;
import com.project.hsocial.repository.CommentRepository;
import com.project.hsocial.repository.INotificationsRepository;
import com.project.hsocial.repository.IPostRepository;
import com.project.hsocial.repository.IUserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CommentService implements ICommentService{
    @Autowired
    private INotificationsRepository notificationsRepository;
    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IPostRepository postRepository;

    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private CommentRepository commentRepository;
    @Override
    public List<Comment> getCommentByPostId(int id) {
        return commentRepository.getAllByPost_PostId(id);
    }

    @Override
    public void createComment(CreateCommentForm form) {
        Comment comment = modelMapper.map(form, Comment.class);
        commentRepository.save(comment);
        Notifications notifications = new Notifications();
        // id cua nguoi binh luan
        int userId = form.getUser().getUserId();
        User user = userRepository.findById(userId).get();
        // thong bao cua nguoi dung nao?
        int postId = form.getPost().getPostId();
        Post post = postRepository.findById(postId).get();
        notifications.setNotificationText (user.getUserName() + " đã bình luận về bài viết của bạn. '" + post.getContent() + " '");
        notifications.setUser(post.getUser());
        notifications.setIsRead(Boolean.FALSE);
        notifications.setFriend(user);
        // neu tu minh comment thi khong luu thong bao
        if(form.getUser().getUserId() != post.getUser().getUserId()){
            notificationsRepository.save(notifications);
        }
    }

    @Override
    @Transactional
    public void deleteComment(int commentId) {
        commentRepository.deleteById(commentId);
    }

    @Override
    public void updateComment(String newContent, int commentId) {
        Comment comment = commentRepository.findById(commentId).get();
        comment.setContentComment(newContent);
        commentRepository.save(comment);
    }
}
